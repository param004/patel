import { profile } from "@/data/profile";

/*
 * Layout family E: single statement plus inline links.
 *
 * The contact fields are empty on purpose. Rather than render a dead mailto or
 * an empty LinkedIn row, the links that have real destinations are printed and
 * the rest are simply absent.
 */
export default function Contact() {
  return (
    <footer
      id="contact"
      className="scene-section-alt border-t border-line px-6 py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.16em] text-accent uppercase">
          Contact
        </p>

        <h2 className="mt-6 max-w-4xl text-3xl text-fg md:text-5xl">
          Every project here has a public repository. The code is the honest
          part of the portfolio.
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-10">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-lg text-accent underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="text-lg text-accent underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
          ) : null}
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="text-lg text-accent underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
          ) : null}

          <p className="text-sm text-fg-faint">
            No live deployments linked, because none are confirmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
