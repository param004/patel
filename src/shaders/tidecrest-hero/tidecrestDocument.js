/**
 * Build-only seam. The registered kage-landing-page bundle imports
 * buildTidecrestDocument but does not ship this module, and no call site is
 * reachable from KageLandingPage. Present so the hash-verified component
 * resolves without being edited.
 *
 * The import specifier in registered source carries a .js suffix, which
 * Turbopack resolves literally, so this file is authored as JavaScript rather
 * than TypeScript.
 */
export function buildTidecrestDocument(..._args) {
  // Parameters exist only to satisfy the registered call sites.
  void _args;
  return "";
}
