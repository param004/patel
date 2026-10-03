"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export default function PortfolioContact() {
  return (
    <footer id="contact" className="bg-[#080808] px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1320px]">
        <h2 className="max-w-[10ch] text-[clamp(3.4rem,8vw,8rem)] font-light leading-[0.9] tracking-[-0.07em] text-white">{portfolioData.contact.headline}</h2>
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-5 text-sm text-white/70">
          <a href={`mailto:${portfolioData.contact.email}`} className="transition hover:text-white">{portfolioData.contact.email}</a>
          <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition hover:text-white">GitHub <ArrowUpRight size={14} /></a>
          <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition hover:text-white">LinkedIn <ArrowUpRight size={14} /></a>
          <a href={portfolioData.resumePath} className="inline-flex items-center gap-1 transition hover:text-white">{portfolioData.contact.resumeLabel} <Download size={14} /></a>
        </div>
        <div className="mt-20 flex justify-between text-xs text-white/35"><span>Param Pambhar</span><span>© {new Date().getFullYear()}</span></div>
      </div>
    </footer>
  );
}
