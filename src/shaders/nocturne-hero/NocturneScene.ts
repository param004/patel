/**
 * Build-only seam. The hash-verified LandingPages.tsx imports these four names
 * from a Nocturne sibling module that the registered kage-landing-page bundle
 * does not ship. KageLandingPage never touches them; they exist so the
 * component type-checks unmodified.
 *
 * Shapes match the call sites: NOCTURNE_VARIANTS is probed with .includes()
 * and NOCTURNE_TITLES is indexed by the resulting variant.
 */
export const NOCTURNE_VARIANTS = ["midnight"] as const;

export const NOCTURNE_TITLES: Record<string, string> = {
  midnight: "Nocturne",
};

export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];

export function buildNocturneDocument(_variant: NocturneVariant): string {
  return "";
}
