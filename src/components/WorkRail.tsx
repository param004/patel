"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

/*
 * Layout family A: pinned horizontal rail.
 *
 * Desktop pins the section and scrubs the track sideways. Below lg the pin is
 * skipped entirely and the same DOM becomes a native scroll-snap carousel,
 * which is the documented mobile fallback rather than a second implementation.
 */

const tierLabel: Record<Project["tier"], string> = {
  flagship: "Flagship",
  supporting: "Supporting",
  archive: "Archive",
};

function ProjectPanel({ project }: { project: Project }) {
  const isFlagship = project.tier === "flagship";

  // Deliberate width asymmetry so the rail never reads as equal cards.
  const widthClass =
    project.tier === "flagship"
      ? "lg:w-[42rem]"
      : project.tier === "supporting"
        ? "lg:w-[31rem]"
        : "lg:w-[24rem]";

  return (
    <article
      className={`scene-panel flex w-[85vw] shrink-0 snap-center flex-col justify-between p-7 sm:w-[30rem] lg:p-8 ${widthClass}`}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span
            className={`font-mono text-xs tracking-[0.16em] uppercase ${
              isFlagship ? "text-accent" : "text-fg-faint"
            }`}
          >
            {tierLabel[project.tier]}
          </span>
          <span className="font-mono text-xs text-fg-faint">
            {project.year}
          </span>
        </div>

        <h3 className="mt-4 text-2xl text-fg sm:text-3xl">{project.title}</h3>
        <p className="mt-1.5 font-mono text-xs text-fg-muted">{project.kicker}</p>

        <p className="mt-5 text-base leading-relaxed text-fg-muted">
          {project.summary}
        </p>

        {/*
          The flagship ships no product photography, so it gets a real manifest
          panel instead of a stand-in image. Real content, and it keeps the
          rail from reading as five photo cards.
        */}
        {isFlagship ? (
          <div className="mt-7 border border-line bg-bg-sunken p-5">
            <p className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
              Manifest
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {project.stack.map((item) => (
                <li key={item} className="font-mono text-xs text-fg-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : project.images.length > 0 ? (
          <figure className="mt-7 overflow-hidden rounded-xs border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.images[0].src}
              alt={project.images[0].alt}
              width={1000}
              height={Math.round(1000 / project.images[0].ratio)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              style={{
                aspectRatio: String(project.images[0].ratio),
              }}
            />
          </figure>
        ) : null}
      </div>

      <div className="mt-8">
        <ul className="mb-6 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((item) => (
            <li
              key={item}
              className="rounded-xs border border-line px-2 py-1 font-mono text-[11px] text-fg-muted"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/work/${project.slug}`}
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Read the case study
          </Link>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Source
          </a>
        </div>
      </div>
    </article>
  );
}

export default function WorkRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // matchMedia, not a manual matchMedia check, so the pin is torn down and
    // rebuilt cleanly when the viewport crosses the breakpoint.
    const mm = gsap.matchMedia();

    mm.add(
      {
        pin: "(min-width: 1024px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { pin, motion } = context.conditions as {
          pin: boolean;
          motion: boolean;
        };

        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section || !pin || !motion) return;

        // Overscroll so the last panel clears the right edge.
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative border-t border-line"
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-8 lg:px-8 lg:pt-28">
        {/* Stacked header. A right-aligned sub-line here reads as the banned
            split-header pattern. */}
        <h2 className="text-3xl text-fg md:text-4xl">Selected work</h2>
        <p className="measure mt-4 text-sm leading-relaxed text-fg-muted">
          Five projects, five public repositories, two years. Ordered by how
          much each one leans on 3D rather than by date.
        </p>
      </div>

      <div className="lg:overflow-hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-16 lg:w-max lg:snap-none lg:overflow-visible lg:px-8 lg:pb-0"
        >
          {projects.map((project) => (
            <ProjectPanel key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
