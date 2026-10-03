"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Plus } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export default function PortfolioHero() {
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          portraitRef.current,
          { filter: "blur(18px)", scale: 1.08 },
          { filter: "blur(0px)", scale: 1, duration: 1.1 }
        )
        .fromTo(
          linesRef.current,
          { y: 46 },
          { y: 0, duration: 0.75, stagger: 0.11 },
          "-=0.55"
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="portfolio-hero relative min-h-[100dvh] overflow-hidden">
      <div className="portfolio-hero__scrim" aria-hidden="true" />
      <div className="relative z-[1] mx-auto flex min-h-[100dvh] max-w-[1500px] items-center px-5 pb-16 pt-24 sm:px-8 lg:px-12">
        <h1 className="relative z-[3] max-w-[11ch] text-[clamp(3.5rem,7.1vw,7rem)] font-light leading-[0.94] tracking-[-0.065em] text-white">
          {portfolioData.hero.lines.map((line, index) => (
            <span
              key={line}
              ref={(node) => {
                if (node) linesRef.current[index] = node;
              }}
              className="block"
            >
              {line}
            </span>
          ))}
        </h1>

        <div ref={portraitRef} className="portfolio-portrait pointer-events-none absolute bottom-0 right-[2%] z-[2] h-[78%] w-[73%] sm:right-[7%] sm:h-[89%] sm:w-[57%] lg:right-[9%] lg:w-[48%]">
          <Image
            src="/images/param.jpg"
            alt="Param Pambhar, full-stack developer"
            fill
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 48vw"
            className="object-contain object-bottom"
          />
        </div>

        <div className="absolute right-5 top-[19%] z-[3] text-right text-sm leading-[1.05] text-white/75 sm:right-8">
          {portfolioData.hero.rightMicrocopyTop.map((line) => <span key={line} className="block">{line}</span>)}
        </div>
        <div className="absolute bottom-[19%] right-5 z-[3] text-right text-sm leading-[1.05] text-white/75 sm:right-8">
          {portfolioData.hero.rightMicrocopyBottom.map((line) => <span key={line} className="block">{line}</span>)}
        </div>
        <a
          href="#work"
          aria-label="View selected work"
          className="absolute bottom-8 left-5 z-[4] grid h-14 w-14 place-items-center rounded-full border border-white/35 text-white transition hover:bg-white hover:text-[#d52d15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:left-8"
        >
          <Plus size={22} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
