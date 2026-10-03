"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#timeline", label: "Timeline" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    /*
     * A scroll sentinel observed by IntersectionObserver rather than a scroll
     * listener. One observer callback instead of a handler running on every
     * frame, and it is the pattern the motion rules ask for.
     */
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link
          href="#top"
          className="font-mono text-sm tracking-tight text-fg transition-colors hover:text-accent"
        >
          {profile.name}
        </Link>

        <ul className="flex items-center gap-5 sm:gap-7">
          {/*
            The Kage experience is the homepage now, and it is a separate
            document with its own navigation, so this is a route link rather
            than one of the same-page hash links below.
          */}
          <li>
            <Link
              href="/"
              className="text-sm text-fg-muted transition-colors hover:text-accent"
            >
              Kage
            </Link>
          </li>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-fg-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xs border border-line-strong px-3 py-1.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
