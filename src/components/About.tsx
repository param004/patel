import { profile } from "@/data/profile";

/*
 * Layout family C: 55/45 split.
 * Left column is a sticky heading, right column is a narrative column.
 */
export default function About() {
  return (
    <section id="about" className="scene-section border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:py-28">
        <div className="lg:col-span-5" data-reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="text-3xl text-fg md:text-4xl">About</h2>
            <p className="mt-4 font-mono text-sm text-fg-muted">
              {profile.role}
            </p>
            <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-fg-faint">Projects shipped</dt>
                <dd className="text-fg">5 public repositories</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-faint">Years in the set</dt>
                <dd className="text-fg">2025 to 2026</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-faint">WebGL projects</dt>
                <dd className="text-fg">1, the flagship</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <div className="measure space-y-6">
            {profile.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-lg leading-relaxed text-fg-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 border-l-2 border-accent pl-6">
            <p className="text-base leading-relaxed text-fg">
              Every stack below was read from a repository manifest, and every
              claim on this page maps to code you can open. No live deployments
              are linked because none are confirmed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
