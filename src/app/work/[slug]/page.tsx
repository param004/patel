import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: `${project.title}, case study`,
    description: project.summary,
  };
}

const tierLabel = {
  flagship: "Flagship",
  supporting: "Supporting",
  archive: "Archive",
} as const;

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const sections = [
    { heading: "The problem", body: project.problem },
    { heading: "The approach", body: project.approach },
    { heading: "The outcome", body: project.outcome },
  ];

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-14 lg:px-8 lg:pt-36 lg:pb-20">
          <Link
            href="/portfolio#work"
            className="text-sm text-fg-muted underline-offset-4 hover:text-accent hover:underline"
          >
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tracking-[0.16em] uppercase">
            <span className="text-accent">{tierLabel[project.tier]}</span>
            <span className="text-fg-faint">{project.year}</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl text-fg md:text-6xl">
            {project.title}
          </h1>

          <p className="measure mt-6 text-lg leading-relaxed text-fg-muted">
            {project.summary}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xs bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim"
            >
              View source
            </a>
            {project.deployTarget ? (
              <span className="text-sm text-fg-faint">
                Configured to deploy on {project.deployTarget}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Meta column. */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                Role
              </h2>
              <p className="mt-3 text-sm text-fg">{project.role}</p>

              <h2 className="mt-8 font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                Stack
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-xs border border-line px-2 py-1 font-mono text-[11px] text-fg-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                Verified in the repo
              </h2>
              <ul className="mt-3 space-y-2">
                {project.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-fg-muted">
                    <span aria-hidden="true" className="text-accent">
                      /
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Narrative column. */}
          <div className="lg:col-span-8">
            {sections.map((section) => (
              <section key={section.heading} className="mb-12 last:mb-0">
                <h2 className="text-2xl text-fg md:text-3xl">
                  {section.heading}
                </h2>
                <p className="measure mt-4 text-lg leading-relaxed text-fg-muted">
                  {section.body}
                </p>
              </section>
            ))}

            {/*
              Image galleries only render where the repository actually ships
              photography. Inventing placeholders here would be the exact
              failure the imagery rules are aimed at.
            */}
            {project.images.length > 0 ? (
              <div className="mt-14">
                <h2 className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                  From the repository
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.images.map((image) => (
                    <figure
                      key={image.src}
                      className="overflow-hidden rounded-xs border border-line"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={1000}
                        height={Math.round(1000 / image.ratio)}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        style={{ aspectRatio: String(image.ratio) }}
                      />
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
