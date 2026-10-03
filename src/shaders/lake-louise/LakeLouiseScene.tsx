/*
 * Placeholder for a sibling world of the same scene family.
 *
 * TempleNightScene.tsx lazy-imports this path so that opening any one world
 * never downloads the others. The verified temple-night bundle contains only
 * the temple-night renderer, so this sibling is not part of the registered
 * source and no verified implementation of it exists here.
 *
 * The import is only ever evaluated when variant="lake-louise" is selected. This build
 * pins variant="temple-night", which returns the real world, so nothing below
 * is ever mounted. It exists purely so the bundler and type checker can
 * resolve the dynamic import.
 */
export function LakeLouiseScene({ className = "" }: { className?: string }) {
  return <div className={className} data-variant-unavailable="lake-louise" />;
}
