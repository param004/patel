/**
 * Build-only seam. The hash-verified LandingPages.tsx imports the Sylva
 * variant styles and appliers from a sibling module the registered
 * kage-landing-page bundle does not ship. KageLandingPage never uses them.
 *
 * Shapes match the call site: each style is a CSS string injected into the
 * document head, and each applier rewrites a document source string.
 */
export const SAKURA_SUNSET_STYLE = "";
export const MAPLE_AUTUMN_STYLE = "";
export const SEQUOIA_MIST_STYLE = "";

export function applySakuraSunsetVariant(source: string): string {
  return source;
}

export function applyMapleAutumnVariant(source: string): string {
  return source;
}

export function applySequoiaMistVariant(source: string): string {
  return source;
}
