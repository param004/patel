"use client";

import { KageLandingPage } from "@/shaders/landing-pages/LandingPages";
import "@/shaders/threeui.css";

/**
 * Kage landing page, mounted from the registered ThreeUI source bundle.
 *
 * Imports the vendored registered source rather than the npm package, for the
 * same reason the temple scene does: the published
 * @designcodeio/threeui build is a reduced six-export cut of this module
 * (KageLandingPage, LandingPageFrame, CompleteShelfLandingPage,
 * BestsellersBookShowcase, MengToSketchbookLandingPage, SylvaHero), its
 * LandingPageFrame has none of the background-presentation or applyScene
 * props, and its stylesheet is a different 72,923-byte style.css rather than
 * the registered 40,715-byte threeui.css. Only the verified bundle is
 * authoritative, so the package is used as the asset mirror and the component
 * itself is vendored.
 *
 * The JSX and props below are the configured usage verbatim. KageLandingPage
 * loads the packaged document from its own URL inside a sandboxed iframe, so
 * the authored navigation, scroll scenes and Three.js world all run intact
 * without any of kage.html being rewritten.
 *
 * .shader-frame is app-side and is redefined for this route in globals.css:
 * the homepage version is a fixed z-index -10 background layer, whereas the
 * full page needs a scrollable in-flow box.
 */
export function Scene() {
  return (
    <div className="shader-frame">
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}

export default Scene;
