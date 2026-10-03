"use client";

import Link from "next/link";
import { profile } from "@/data/profile";

/**
 * The hero sits directly on the temple-night render, with no panel behind it.
 *
 * The previous hero ran a second WebGL context here (the React Three Fiber
 * point-cloud portrait). Two contexts plus two animation loops on one page is
 * a poor trade, so the scene is the hero visual now and the portrait pipeline
 * is kept in the repo but unmounted. See tools/generate-portrait.mjs.
 *
 * Four text elements, per the hero budget: name, headline, subtext, CTAs.
 */
export default function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-6xl grid-cols-1 content-center items-center px-6 pt-20 pb-16 lg:px-8 lg:pt-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
            {profile.name}
          </p>

          <h1 className="mt-5 text-4xl text-fg md:text-5xl lg:text-6xl">
            Full-stack developer building 3D product experiences
          </h1>

          <p className="mt-6 text-base leading-relaxed text-fg-muted md:text-lg">
            Five shipped projects, from a Redux Q&amp;A client to a WebGL
            product viewer you can take apart.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#work"
              className="rounded-xs bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim"
            >
              See the work
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xs border border-line-strong px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
            >
              GitHub profile
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              { k: "Projects", v: "5 public" },
              { k: "Years", v: "2025 to 2026" },
              { k: "WebGL", v: "1 flagship" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                  {item.k}
                </dt>
                <dd className="mt-1.5 text-sm text-fg-muted">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}
