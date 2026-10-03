"use client";

import { TempleNightScene } from "@/shaders/temple-night/TempleNightScene";
import "@/shaders/threeui.css";

/**
 * Full-viewport temple-night background.
 *
 * Imports the vendored registered source rather than the npm package: the
 * published @designcodeio/threeui renderer does not match the registered
 * SHA-256, so only the verified bundle is authoritative here.
 *
 * The .shader-frame wrapper is app-side. It is not defined in threeui.css,
 * which only ships the .temple-night-* rules, so the layout below is ours.
 *
 * This component is the client boundary. TempleNightScene.tsx is registered
 * source and carries no "use client" of its own; importing it from a client
 * module puts the whole subgraph on the client, so the file stays unmodified.
 */
export default function Scene() {
  return (
    <div className="shader-frame">
      <TempleNightScene variant="temple-night" />
    </div>
  );
}
