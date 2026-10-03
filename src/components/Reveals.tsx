"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll reveals for the prose sections.
 *
 * Every element is hidden with GSAP rather than a CSS class so that the
 * reduced-motion branch can skip the animation without leaving anything stuck
 * at opacity 0. The rule is: if motion is off, elements must be visible from
 * the first paint.
 */
export default function Reveals() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      for (const target of targets) {
        gsap.from(target, {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 88%",
            once: true,
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return null;
}
