#!/usr/bin/env node
/**
 * Generates the hero portrait point cloud from a single photograph.
 *
 * Depth Anything V2 runs here, at build time, on the CPU. The browser
 * never downloads the model, which is the entire point: the quantized
 * weights are roughly 26 MB, and shipping them to the client would
 * destroy the Largest Contentful Paint score. What reaches the browser
 * is a quantised Int16 point buffer of a few hundred kilobytes.
 *
 *   node tools/generate-portrait.mjs <photo> [--points 60000] [--width 768]
 *
 * Outputs into public/portrait/:
 *   points.bin   Int16 x,y,z triples, little endian, plus a JSON header
 *   depth.png    the predicted depth map, for inspection
 *   poster.png   flat silhouette used as the reduced-motion and LCP image
 *   meta.json    scale, count and framing metadata
 *
 * Model weights are cached in .cache/portrait-models and are gitignored.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "portrait");
const CACHE_DIR = path.join(ROOT, ".cache", "portrait-models");

const MODEL = "onnx-community/depth-anything-v2-small";
/** Quantised weights. 26 MB rather than the 94 MB fp32 build. */
const DTYPE = "q8";

function parseArgs(argv) {
  const args = { points: 60000, width: 768, photo: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--points") args.points = Number(argv[++i]);
    else if (a === "--width") args.width = Number(argv[++i]);
    else if (!a.startsWith("--")) args.photo = a;
  }
  return args;
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));

if (!args.photo) {
  fail(
    "Usage: node tools/generate-portrait.mjs <photo.jpg> [--points 60000] [--width 768]",
  );
}
if (!existsSync(args.photo)) fail(`No such file: ${args.photo}`);
if (!Number.isFinite(args.points) || args.points < 1000) {
  fail("--points must be at least 1000");
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(CACHE_DIR, { recursive: true });

// transformers.js resolves the HF cache through an env var. Point it at a
// local, gitignored directory so the weights never re-download per run.
process.env.TRANSFORMERS_CACHE = CACHE_DIR;

let pipeline, RawImage;
try {
  ({ pipeline, RawImage } = await import("@huggingface/transformers"));
} catch {
  fail(
    "Missing dependency. Run:  npm install --save-dev @huggingface/transformers sharp",
  );
}

const sharp = (await import("sharp")).default;

console.log(`\n  photo     ${args.photo}`);
console.log(`  points    ${args.points.toLocaleString()}`);
console.log(`  width     ${args.width}px`);
console.log(`  model     ${MODEL} (${DTYPE})`);
console.log(`  cache     ${path.relative(ROOT, CACHE_DIR)}\n`);

const t0 = Date.now();

/* ------------------------------------------------------------ 1. load + fit */

const portrait = await sharp(args.photo)
  .rotate() // respect EXIF orientation before anything else
  .resize({ width: args.width, withoutEnlargement: true })
  .toBuffer();

const meta = await sharp(portrait).metadata();
const width = meta.width;
const height = meta.height;
console.log(`  1. loaded        ${width}x${height}`);

/* ------------------------------------------------------ 2. predict depth */

console.log(`  2. depth         fetching weights on first run...`);
const depthEstimator = await pipeline("depth-estimation", MODEL, {
  dtype: DTYPE,
  device: "cpu",
});

const input = await RawImage.fromBlob(new Blob([portrait]));
const { predicted_depth } = await depthEstimator(input);

/*
 * Depth Anything emits relative inverse depth: larger means nearer.
 * Normalise to 0..1 across the whole frame.
 */
const raw = predicted_depth.data;
const dims = predicted_depth.dims;
const dw = dims[dims.length - 2];
const dh = dims[dims.length - 1];

let lo = Infinity;
let hi = -Infinity;
for (let i = 0; i < raw.length; i++) {
  if (raw[i] < lo) lo = raw[i];
  if (raw[i] > hi) hi = raw[i];
}
const span = hi - lo || 1;
const depth = new Float32Array(raw.length);
for (let i = 0; i < raw.length; i++) depth[i] = (raw[i] - lo) / span;

console.log(
  `  2. depth         ${dw}x${dh} in ${((Date.now() - t0) / 1000).toFixed(1)}s`,
);

/* ------------------------------------------ 3. estimate the subject region */

/*
 * A portrait usually has the subject against a flatter background, and in
 * inverse-depth space background sits near 0 while the subject sits higher.
 * Thresholding at a percentile of the non-zero mass isolates the person
 * without needing a segmentation model.
 */
/*
 * Otsu thresholding on the depth histogram separates the subject from the
 * background without any magic percentile. In a portrait the background is
 * the flatter, further mass, so the largest between-class variance lands
 * naturally on the subject boundary.
 */
const histogram = new Uint32Array(256);
for (let i = 0; i < depth.length; i++) {
  histogram[Math.min(255, (depth[i] * 255) | 0)]++;
}

const total = depth.length;
let sumAll = 0;
for (let b = 0; b < 256; b++) sumAll += b * histogram[b];

let sumBackground = 0;
let weightBackground = 0;
let bestVariance = -1;
let otsu = 128;

for (let b = 0; b < 256; b++) {
  weightBackground += histogram[b];
  if (weightBackground === 0) continue;

  const weightForeground = total - weightBackground;
  if (weightForeground === 0) break;

  sumBackground += b * histogram[b];

  const meanBackground = sumBackground / weightBackground;
  const meanForeground = (sumAll - sumBackground) / weightForeground;

  const variance =
    weightBackground * weightForeground * (meanBackground - meanForeground) ** 2;

  if (variance > bestVariance) {
    bestVariance = variance;
    otsu = b;
  }
}

/* Lift the cut slightly so anti-aliased background edge pixels drop out. */
const subjectCut = Math.min(1, (otsu + 8) / 255);

let minX = dw;
let maxX = -1;
let minY = dh;
let maxY = -1;
const mask = new Uint8Array(depth.length);
let maskCount = 0;

for (let i = 0; i < depth.length; i++) {
  if (depth[i] <= subjectCut) continue;
  const x = i % dw;
  const y = (i / dw) | 0;
  mask[i] = 1;
  maskCount++;
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}

const maskRatio = maskCount / depth.length;

if (maxX < minX || maxY < minY || maskRatio < 0.02) {
  fail(
    `Could not isolate a subject (only ${(maskRatio * 100).toFixed(1)}% of the ` +
      "frame passed the depth threshold). Use a photo with the subject clearly " +
      "separated from the background, ideally facing the camera.",
  );
}

if (maskRatio > 0.88) {
  console.log(
    `  !. subject filled ${(maskRatio * 100).toFixed(0)}% of the frame. There is ` +
      "little background separation, so the point cloud will include it. A photo " +
      "with more space around you will frame far better.",
  );
}

console.log(
  `  3. subject       otsu ${otsu}/255, bbox ${maxX - minX + 1}x${maxY - minY + 1}, ` +
    `${(maskRatio * 100).toFixed(1)}% of frame`,
);

/* --------------------------------------------- 4. reject outliers in depth */

/*
 * Within the mask, guard against depth spikes at hair edges and shoulders,
 * which otherwise produce isolated points flying far off the head.
 */
const inside = [];
for (let i = 0; i < mask.length; i++) if (mask[i]) inside.push(depth[i]);
inside.sort((a, b) => a - b);
const p02 = inside[Math.floor(inside.length * 0.02)];
const p98 = inside[Math.floor(inside.length * 0.98)];

/* ---------------------------------------------------- 5. sample the points */

const target = args.points;
const stride = Math.max(1, Math.round(Math.sqrt(maskCount / target)));

const positions = [];
const bw = maxX - minX + 1;
const bh = maxY - minY + 1;

/*
 * Normalise so the subject's WIDER dimension fills the unit range. Depth is
 * then scaled separately: a head should read as a head, not a flat wall.
 */
const zScale = 0.55;

for (let y = minY; y <= maxY; y += 1) {
  for (let x = minX; x <= maxX; x += 1) {
    if (((y - minY) / stride) % 1 !== 0) continue;
    if (((x - minX) / stride) % 1 !== 0) continue;

    const i = y * dw + x;
    if (!mask[i]) continue;

    let d = depth[i];
    if (d < p02) d = p02;
    if (d > p98) d = p98;

    const u = (x - minX) / (bw - 1 || 1);
    const v = (y - minY) / (bh - 1 || 1);
    const centreness = 1 - Math.min(1, Math.abs(u - 0.5) * 2);

    positions.push(
      (u - 0.5) * 2,
      -(v - 0.5) * 2,
      ((d - p02) / (p98 - p02 || 1)) * zScale * centreness,
    );
  }
}

const count = positions.length / 3;
if (count < 1000) {
  fail(
    `Only sampled ${count} points. Lower --points to fit the detected subject.`,
  );
}

console.log(`  4. sampled       ${count.toLocaleString()} points`);

/* --------------------------------------------------- 6. quantise to Int16 */

const quantised = new Int16Array(positions.length);
for (let i = 0; i < positions.length; i++) {
  quantised[i] = Math.max(-32768, Math.min(32767, Math.round(positions[i] * 10000)));
}

const header = Buffer.from(
  JSON.stringify({ count, scale: 10000, version: 1 }),
  "utf8",
);
const headerPadded = Buffer.alloc(64);
header.copy(headerPadded, 0);

const bin = Buffer.concat([headerPadded, Buffer.from(quantised.buffer)]);
await writeFile(path.join(OUT_DIR, "points.bin"), bin);

/* ------------------------------------------------- 7. depth map + poster */

/** Resize the depth field up to the photo resolution for inspection. */
const depthBytes = Buffer.alloc(dw * dh);
for (let i = 0; i < depth.length; i++) {
  depthBytes[i] = Math.max(0, Math.min(255, Math.round(depth[i] * 255)));
}
await sharp(depthBytes, { raw: { width: dw, height: dh, channels: 1 } })
  .png()
  .toFile(path.join(OUT_DIR, "depth.png"));

/** Flat silhouette on the page background. Used for LCP and reduced motion. */
await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: "#0a0a0b",
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="#0a0a0b"/><ellipse cx="${width / 2}" cy="${
          minY + (maxY - minY) * 0.45
        }" rx="${(bw / 2) * 0.92}" ry="${(bh / 2) * 0.98}" fill="#1a1a1d"/></svg>`,
      ),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toFile(path.join(OUT_DIR, "poster.png"));

const metaOut = {
  count,
  source: path.basename(args.photo),
  depthResolution: [dw, dh],
  subjectBox: [minX, minY, bw, bh],
  zScale,
  bytes: bin.length,
};
await writeFile(
  path.join(OUT_DIR, "meta.json"),
  JSON.stringify(metaOut, null, 2),
);

console.log(`  5. written       public/portrait/points.bin (${(bin.length / 1024).toFixed(0)} KB)`);
console.log(`                   public/portrait/depth.png`);
console.log(`                   public/portrait/poster.png`);
console.log(`\n  done in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);