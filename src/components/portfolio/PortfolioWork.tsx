"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Code2 } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export default function PortfolioWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projects = portfolioData.projects;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.fromTo(headingRef.current, { y: 35, filter: "blur(8px)" }, {
        y: 0, filter: "blur(0px)", duration: 0.9,
        scrollTrigger: { trigger: headingRef.current, start: "top 78%", toggleActions: "play none none reverse" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="portfolio-work relative overflow-hidden px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
      <div className="relative z-[1] mx-auto max-w-[1320px]">
        <h2 ref={headingRef} className="mb-16 text-center text-[clamp(3rem,6.6vw,6.75rem)] font-light leading-none tracking-[-0.065em] text-white">Selected Work</h2>
        <div className="grid gap-12 lg:grid-cols-[minmax(190px,0.3fr)_minmax(0,1fr)] lg:gap-20">
          <div className="relative">
            <div className="hidden lg:block absolute bottom-1 left-[3px] top-1 w-px bg-white/20">
              <span className="absolute left-0 top-0 w-px bg-white transition-all duration-500" style={{ height: `${((activeIndex + 1) / projects.length) * 100}%` }} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-8 lg:overflow-visible lg:pb-0">
              {projects.map((project, index) => (
                <button
                  type="button"
                  key={project.slug}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative min-w-max text-left transition-opacity lg:block lg:pl-8 ${index === activeIndex ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
                >
                  <span className={`absolute left-0 top-1.5 hidden h-2 w-2 rounded-full border border-white lg:block ${index === activeIndex ? "bg-white" : "bg-transparent"}`} />
                  <span className="block text-base font-medium text-white">{project.title}</span>
                  <span className="mt-1 block text-xs text-white/60">{project.tags.join("  •  ")}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative min-h-[55vh] overflow-hidden rounded-[28px] border border-white/15 bg-black/25 shadow-[0_30px_90px_rgba(74,4,0,.25)] sm:min-h-[65vh]">
            {projects.map((project, index) => {
              const offset = index - activeIndex;
              return (
                <article key={project.slug} className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: `translateY(${offset * 100}%)` }}>
                  {project.image ? (
                    <Image src={project.image} alt={project.images[0]?.alt || `${project.title} project`} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-end bg-[radial-gradient(circle_at_70%_30%,rgba(240,84,26,.7),transparent_38%),linear-gradient(140deg,#29100e,#090909_65%)] p-8 sm:p-12">
                      <Code2 className="absolute right-10 top-10 text-white/30" size={80} strokeWidth={0.7} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 pt-28 sm:p-10 sm:pt-36">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">{project.tags.join("  •  ")}</p>
                    <h3 className="max-w-[15ch] text-3xl font-light tracking-[-0.04em] text-white sm:text-5xl">{project.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">{project.summary}</p>
                    <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#fff4ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                      Open project <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
