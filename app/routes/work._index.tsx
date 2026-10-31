import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { ArrowRight, Button } from "~/components/ui/Button";
import { CtaBand, PageHero, reveal, Section } from "~/components/ui/PageBlocks";
import { ProjectCard } from "~/components/work/ProjectCard";
import { ProjectVisual } from "~/components/work/ProjectVisual";
import { isPreview, projectAreasInUse, projects } from "~/content";
import { projectAreaLabel, type ProjectArea } from "~/content/status";
import { cn } from "~/lib/cn";
import { ease } from "~/lib/motion";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

const crumbs = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/work" },
];

export const meta = () =>
  pageMeta({
    title: "Portfolio",
    description:
      "Case studies from ServeProGen: AI, computer vision, SaaS and full-stack engineering projects, with honest development status.",
    path: "/work",
    jsonLd: [breadcrumbLd(crumbs)],
  });

type Filter = "all" | ProjectArea;

export default function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const areas = projectAreasInUse();
  const shown =
    filter === "all" ? projects : projects.filter((p) => p.areas.includes(filter));

  return (
    <>
      <PageHero
        crumbs={crumbs}
        label="Portfolio"
        title="From ideas to intelligent products."
        intro="Real engineering projects across AI, computer vision, SaaS and full-stack development. Every status is shown as it is: in development means in development."
      />

      <Section labelledBy="projects-title" bordered={false} className="pt-0!">
        <h2 id="projects-title" className="sr-only">
          Projects
        </h2>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {isPreview && projects.some((p) => !p.published) && (
              <p
                className="mb-6 rounded-card border border-dashed border-accent/60 bg-accent/5 p-4 text-small"
                role="note"
              >
                <span className="text-label mr-2 text-accent">Draft preview</span>
                Projects marked Draft are visible only in local and preview builds.
              </p>
            )}
            {areas.length > 1 && (
              <div
                role="group"
                aria-label="Filter projects by area"
                className="mb-10 flex flex-wrap gap-2"
              >
                {(["all", ...areas] as Filter[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={filter === key}
                    onClick={() => setFilter(key)}
                    className={cn(
                      "h-11 rounded-full border px-5 text-small transition-colors duration-(--duration-fast)",
                      filter === key
                        ? "border-accent bg-accent text-on-accent"
                        : "border-border-strong text-muted hover:border-text hover:text-text",
                    )}
                  >
                    {key === "all" ? "All" : projectAreaLabel[key]}
                  </button>
                ))}
              </div>
            )}
            <p className="sr-only" aria-live="polite">
              {shown.length} {shown.length === 1 ? "project" : "projects"} shown
            </p>
            <m.ul layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((p) => (
                  <m.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: ease.outExpo }}
                  >
                    <ProjectCard project={p} />
                  </m.li>
                ))}
              </AnimatePresence>
            </m.ul>
          </>
        )}
      </Section>

      <CtaBand
        title="Have a project in mind?"
        text="Tell us about it. We'll reply with honest questions and a practical next step."
      />
    </>
  );
}

function EmptyState() {
  return (
    <div
      className="grid items-center gap-10 rounded-panel border border-border bg-surface p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12"
      {...reveal()}
    >
      <div className="flex flex-col gap-5">
        <p className="text-label text-accent">Case studies in preparation</p>
        <h3 className="text-h2">Detailed case studies are on their way.</h3>
        <p className="text-muted">
          We're documenting our AI, computer vision and SaaS projects properly, with real
          screenshots and accurate status, rather than rushing them online. In the
          meantime, explore what we do or tell us about your project.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button to="/services">
            Explore services
            <ArrowRight />
          </Button>
          <Button to="/contact" variant="secondary">
            Start a project
          </Button>
        </div>
      </div>
      <ProjectVisual kind="detection" className="aspect-[16/10]" />
    </div>
  );
}
