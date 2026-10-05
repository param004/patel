"use client";

import {
  LandingPageFrame,
  type LandingPageProps,
} from "@/shaders/landing-pages/LandingPageFrame";
import {
  splitTypographyProps,
  usePageTypography,
  type PageTypographyProps,
} from "@/shaders/landing-pages/pageTypography";
import { KAGE_TYPOGRAPHY } from "@/shaders/landing-pages/pageRecipes";
import "@/shaders/threeui.css";

/**
 * Kage landing page, personalised copy.
 *
 * This is a LOCAL variant of the registered `KageLandingPage`, and it is
 * byte-for-byte identical to it except for two values:
 *
 *   sourceUrl  /landing-pages/kage.html
 *           -> /landing-pages/kage.portfolio.html
 *   title      "Kage - Where stillness reveals the unseen"
 *           -> "Param Pambhar - Full-Stack-Entwickler"
 *
 * `KageLandingPage` itself is never edited: it is part of the registered
 * source bundle and is covered by its published SHA-256. The registered
 * `kage.html` is likewise never edited and still passes its hash, so this
 * route can be deleted at any time to fall back to the exact original.
 *
 * The underlying document, its CSS, JavaScript, shaders and every asset under
 * `secret-pathways-assets/` are shared with the original. Only the visible
 * text differs. See tools/build-kage-personalization.py, which regenerates the
 * document and self-checks that nothing beyond text changed.
 *
 * .shader-frame is app-side and redefined for this route in globals.css.
 */
export function Scene() {
  const props: LandingPageProps & PageTypographyProps = {
    headingFont: "onest",
    bodyFont: "onest",
    headingWeight: "400",
    bodyWeight: "300",
    primaryColor: "#e0231c",
    headingSize: 46,
    bodySize: 17,
    headingLetterSpacing: -0.012,
  };
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);

  return (
    <div className="shader-frame">
      <LandingPageFrame
        {...frame}
        customization={customization}
        title="Param Pambhar - Full-Stack-Entwickler"
        sourceUrl="/landing-pages/kage.portfolio.html"
      />
    </div>
  );
}

export default Scene;