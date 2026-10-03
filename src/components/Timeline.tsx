import { profile } from "@/data/profile";

/*
 * Layout family F: vertical rail with node markers.
 * A timeline is genuinely ordered, so a rail beats a grid here.
 */
export default function Timeline() {
  return (
    <section id="timeline" className="scene-section border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-3xl text-fg md:text-4xl">Timeline</h2>
              <p className="mt-4 measure text-sm leading-relaxed text-fg-muted">
                Reconstructed from commit history rather than a CV. Where the
                repositories do not support a date, there is no entry.
              </p>
            </div>
          </div>

          <ol className="lg:col-span-8" data-reveal>
            {profile.timeline.map((entry, index) => (
              <li
                key={entry.title}
                className="relative border-l border-line pb-10 pl-8 last:pb-0"
              >
                {/* Node marker sitting on the rail. */}
                <span
                  aria-hidden="true"
                  className={`absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full ${
                    index === 0 ? "bg-accent" : "bg-line-strong"
                  }`}
                />

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-sm text-accent">
                    {entry.year}
                  </span>
                  <h3 className="text-xl text-fg">{entry.title}</h3>
                </div>
                <p className="mt-2.5 measure text-base leading-relaxed text-fg-muted">
                  {entry.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
