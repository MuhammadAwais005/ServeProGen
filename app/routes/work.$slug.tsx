import { ExternalLink } from "lucide-react";
import bodies from "virtual:content/project-bodies";
import { Link } from "react-router";
import { StatusBadge, TechTag } from "~/components/ui/Badge";
import { ArrowRight } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Breadcrumbs, CtaBand, DraftNotice } from "~/components/ui/PageBlocks";
import { ProjectVisual } from "~/components/work/ProjectVisual";
import { getProject, projects } from "~/content";
import { getService } from "~/content/services";
import { projectAreaLabel } from "~/content/status";
import { breadcrumbLd, pageMeta } from "~/lib/seo";
import { NotFound } from "./not-found";
import type { Route } from "./+types/work.$slug";

/*
 * No loader: content comes from the build-time content module, so the same
 * lookup works in pre-rendering and in the browser. Only visible projects have
 * pages; any other slug is answered by the 404 page.
 */
export const meta = ({ params }: Route.MetaArgs) => {
  const project = getProject(params.slug);
  if (!project)
    return [
      { title: "Page not found | ServeProGen" },
      { name: "robots", content: "noindex" },
    ];
  return pageMeta({
    title: project.title,
    description: project.summary,
    path: `/work/${project.slug}`,
    noindex: !project.published,
    image: project.screenshots[0]?.src,
    imageAlt: project.screenshots[0]?.alt,
    jsonLd: [
      breadcrumbLd([
        { label: "Home", to: "/" },
        { label: "Portfolio", to: "/work" },
        { label: project.title, to: `/work/${project.slug}` },
      ]),
    ],
  });
};

export default function CaseStudy({ params }: Route.ComponentProps) {
  const project = getProject(params.slug);
  if (!project) return <NotFound />;
  const Body = bodies[project.slug];
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Portfolio", to: "/work" },
    { label: project.title, to: `/work/${project.slug}` },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pt-header">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-20" />
        <div
          aria-hidden="true"
          className="glow-accent absolute -top-40 -right-40 -z-10 size-[40rem] opacity-50"
        />
        <Container className="flex flex-col gap-6 pt-14 pb-12 lg:pt-20">
          <Breadcrumbs crumbs={crumbs} />
          {!project.published && (
            <DraftNotice
              reasons={[
                ...project.unconfirmed,
                ...(project.screenshots.length === 0 ? ["screenshots"] : []),
              ]}
            />
          )}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-label text-accent">{project.category}</p>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-h1 hero-line max-w-5xl">
            <span>{project.title}</span>
          </h1>
          <p className="text-lead hero-fade max-w-3xl text-muted">{project.summary}</p>
        </Container>
      </section>

      <Container>
        {project.screenshots.length > 0 ? (
          <div className="grid gap-4">
            {project.screenshots.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full rounded-panel border border-border"
              />
            ))}
          </div>
        ) : (
          <ProjectVisual kind={project.visual} className="aspect-[16/8]" />
        )}
      </Container>

      <Container className="grid gap-14 py-16 lg:grid-cols-[1fr_20rem] lg:gap-20 lg:py-24">
        <article className="prose-forge max-w-3xl">{Body ? <Body /> : null}</article>

        <aside
          aria-label="Project facts"
          className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start"
        >
          <dl className="flex flex-col divide-y divide-border rounded-panel border border-border bg-surface">
            <Fact label="Status">
              <StatusBadge status={project.status} />
            </Fact>
            {project.role && <Fact label="Role">{project.role}</Fact>}
            {project.year && <Fact label="Year">{project.year}</Fact>}
            <Fact label="Areas">
              {project.areas.map((a) => projectAreaLabel[a]).join(", ")}
            </Fact>
            <Fact label="Services">
              <ul className="flex flex-col gap-1">
                {project.services.map((slug) => {
                  const s = getService(slug);
                  return s ? (
                    <li key={slug}>
                      <Link
                        to={`/services/${slug}`}
                        className="text-accent-soft hover:text-text"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </Fact>
            {project.stack.length > 0 && (
              <Fact label="Technology">
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <li key={t}>
                      <TechTag className="text-text">{t}</TechTag>
                    </li>
                  ))}
                </ul>
              </Fact>
            )}
            {(project.links.demo || project.links.repo) && (
              <Fact label="Links">
                <ul className="flex flex-col gap-2">
                  {project.links.demo && (
                    <li>
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent-soft hover:text-text"
                      >
                        Live demo <ExternalLink aria-hidden="true" className="size-3.5" />
                      </a>
                    </li>
                  )}
                  {project.links.repo && (
                    <li>
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent-soft hover:text-text"
                      >
                        Source code{" "}
                        <ExternalLink aria-hidden="true" className="size-3.5" />
                      </a>
                    </li>
                  )}
                </ul>
              </Fact>
            )}
          </dl>
          {project.features.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-label text-muted">Main features</h2>
              <ul className="flex flex-col gap-2.5">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3 text-small text-text">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      {next && next.slug !== project.slug && (
        <Container className="pb-16">
          <Link
            to={`/work/${next.slug}`}
            prefetch="intent"
            viewTransition
            className="group flex flex-col gap-3 rounded-panel border border-border bg-surface p-8 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between lg:p-10"
          >
            <span className="flex flex-col gap-2">
              <span className="text-label text-muted">Next project</span>
              <span className="text-h3">{next.title}</span>
            </span>
            <span className="flex size-12 items-center justify-center rounded-full border border-border-strong transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
              <ArrowRight />
            </span>
          </Link>
        </Container>
      )}

      <CtaBand title="Building something similar?" />
    </>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 p-5">
      <dt className="text-label text-muted">{label}</dt>
      <dd className="text-small text-text">{children}</dd>
    </div>
  );
}
