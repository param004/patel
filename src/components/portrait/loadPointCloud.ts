/**
 * Decodes the Int16 point buffer produced by tools/generate-portrait.mjs.
 *
 * File layout: 64 byte JSON header, then count * 3 Int16 values in
 * little endian order (x, y, z triples).
 */

export type PointCloud = {
  count: number;
  positions: Float32Array;
};

type Header = { count: number; scale: number; version: number };

const HEADER_BYTES = 64;

export async function loadPointCloud(
  url = "/portrait/points.bin",
  signal?: AbortSignal,
): Promise<PointCloud> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`points.bin ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  /*
   * The writer pads the JSON header out to a fixed 64 bytes with NULs, so the
   * padding has to come off before parsing.
   */
  const rawHeader = new TextDecoder().decode(
    new Uint8Array(buffer, 0, HEADER_BYTES),
  );
  const header = JSON.parse(rawHeader.replace(/\0+$/, "")) as Header;

  if (header.version !== 1) {
    throw new Error(`Unsupported point cloud version ${header.version}`);
  }

  const { count, scale } = header;
  const quantised = new Int16Array(buffer, HEADER_BYTES, count * 3);
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < positions.length; i++) {
    positions[i] = quantised[i] / scale;
  }

  return { count, positions };
}