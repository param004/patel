"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioTransition() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    const frame = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      const hero = document.querySelector<HTMLElement>("#hero");
      if (!hero) return;
      gsap.to(hero, {
        scale: 0.68,
        borderRadius: "28px",
        boxShadow: "0 40px 120px rgba(0,0,0,.5)",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=95%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return <div ref={rootRef} aria-hidden="true" />;
}
