import { profile } from "@/data/profile";

/*
 * Layout family D: asymmetric 7/5 with offset column baselines.
 * Grouped lists, not one flat cloud of twenty pills.
 */
export default function Capabilities() {
  return (
    <section id="stack" className="scene-section-alt border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <h2 className="text-3xl text-fg md:text-4xl">Stack</h2>
          {/* Vertical stack, not a headline beside an explainer. */}
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">
            Grouped by the job each tool does, not by when I learned it. Read
            from the manifests of the five repositories on this page.
          </p>
        </div>

        <div data-reveal className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {profile.capabilities.map((group, index) => (
            <div
              key={group.group}
              // Offset baselines on the middle and last columns.
              className={index === 1 ? "md:mt-10" : index === 2 ? "md:mt-20" : ""}
            >
              <h3 className="font-mono text-xs tracking-[0.16em] text-accent uppercase">
                {group.group}
              </h3>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {group.items.map((item) => (
                  <li key={item} className="text-base text-fg-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
