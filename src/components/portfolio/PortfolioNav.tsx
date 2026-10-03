"use client";

export default function PortfolioNav() {
  return (
    <nav className="portfolio-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12" aria-label="Primary navigation">
      <a href="#hero" className="text-sm tracking-[0.22em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        <span className="font-light">PARAM</span>{" "}
        <span className="font-medium text-white/55">PAMBHAR</span>
      </a>
      <a href="#contact" className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-[#fff4ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        <span className="h-2.5 w-2.5 rounded-full bg-black transition-transform group-hover:scale-125" />
        Get in Touch
      </a>
    </nav>
  );
}
