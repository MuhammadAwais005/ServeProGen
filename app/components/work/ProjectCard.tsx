import { Link } from "react-router";
import { StatusBadge, TechTag } from "~/components/ui/Badge";
import { ArrowRight } from "~/components/ui/Button";
import type { Project } from "~/content";
import { cn } from "~/lib/cn";
import { ProjectVisual } from "./ProjectVisual";

/** Project card: one tab stop (stretched link), visual, status, stack. */
export function ProjectCard({
  project,
  headingLevel: Heading = "h3",
  className,
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const shot = project.screenshots[0];
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-panel border border-border bg-surface transition-[border-color,box-shadow,transform] duration-(--duration-base) ease-standard",
        "focus-within:border-accent/60 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow-sm",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        {shot ? (
          <img
            src={shot.src}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-out-expo group-hover:scale-[1.03]"
          />
        ) : (
          <ProjectVisual
            kind={project.visual}
            className="h-full rounded-none border-0 transition-transform duration-(--duration-slow) ease-out-expo group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-label text-muted">{project.category}</p>
          <StatusBadge status={project.status} />
        </div>
        <Heading className="text-h3">
          <Link
            to={`/work/${project.slug}`}
            prefetch="intent"
            viewTransition
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="text-small text-muted">{project.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Technology">
          {project.stack.slice(0, 5).map((tech) => (
            <li key={tech}>
              <TechTag>{tech}</TechTag>
            </li>
          ))}
        </ul>
        <p
          className="flex items-center gap-2 text-small font-medium text-accent-soft"
          aria-hidden="true"
        >
          View case study <ArrowRight />
        </p>
        {!project.published && (
          <p className="text-label absolute top-4 right-4 rounded-full bg-accent px-2.5 py-1.5 text-[0.625rem] text-on-accent">
            Draft
          </p>
        )}
      </div>
    </article>
  );
}
