import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * The registered Kage component imports five sibling-scene documents with a
   * `?raw` specifier, which resolves to a file's contents as a string. That
   * suffix is authored into hash-verified source and cannot be rewritten, and
   * Turbopack has no `?raw` support: it loads the file as text and then tries
   * to parse the result as JavaScript, failing with "Unknown module type".
   *
   * Webpack expresses this natively as an asset/source module, so dev and build
   * both run with --webpack (see package.json scripts).
   */
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
