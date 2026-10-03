"use client";

import { Rocket, Sparkles, Zap } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const icons = { Rocket, Sparkles, Zap };

export default function PortfolioWhy() {
  return (
    <section id="why" className="bg-[#080808] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-16 max-w-xl">
          <h2 className="text-[clamp(2.8rem,5vw,5.2rem)] font-light leading-[0.98] tracking-[-0.06em] text-white">Why work with me?</h2>
          <p className="mt-5 text-sm leading-relaxed text-white/60">{portfolioData.whyWorkWithMe.subtitle}</p>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {portfolioData.whyWorkWithMe.valueProps.map((prop) => {
            const Icon = icons[prop.icon as keyof typeof icons];
            return <div key={prop.title} className="border-t border-white/15 pt-5">
              <Icon className="mb-8 text-[#f0541a]" size={28} strokeWidth={1.4} />
              <h3 className="text-lg font-medium text-white">{prop.title}</h3>
              <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-white/55">{prop.description}</p>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
