/**
 * Build-only seam. Imported by the hash-verified LandingPages.tsx but absent
 * from the registered kage-landing-page bundle, with no call site reachable
 * from KageLandingPage.
 *
 * The import specifier in registered source carries a .js suffix, which
 * Turbopack resolves literally, so this file is authored as JavaScript rather
 * than TypeScript.
 */
export function buildMeridianDocument(..._args) {
  // Parameters exist only to satisfy the registered call sites.
  void _args;
  return "";
}
