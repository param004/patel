/**
 * Build-only seam.
 *
 * LandingPages.tsx is registered source and imports this module, but the
 * registered kage-landing-page bundle does not ship it. None of its call sites
 * are reachable from KageLandingPage, which loads the packaged document from
 * its own URL instead of composing a srcDoc string.
 *
 * The signature matches the call site so the module graph type-checks without
 * editing the hash-verified component.
 */
export function buildSandboxedPageDocument(source: string, _options?: unknown): string {
  return source;
}
