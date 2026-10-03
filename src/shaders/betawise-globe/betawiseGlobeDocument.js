/**
 * Build-only seam. Imported by the hash-verified LandingPages.tsx but absent
 * from the registered kage-landing-page bundle. Only the Betawise globe
 * sibling calls it, never KageLandingPage.
 *
 * The import specifier in registered source carries a .js suffix, which
 * Turbopack resolves literally, so this file is authored as JavaScript rather
 * than TypeScript.
 */
export function buildBetawiseGlobeDocument(..._args) {
  // Parameters exist only to satisfy the registered call sites.
  void _args;
  return "";
}
