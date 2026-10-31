import { ArticleCard } from "~/components/insights/ArticleCard";
import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { reveal } from "~/components/ui/PageBlocks";
import { ProjectCard } from "~/components/work/ProjectCard";
import type { Article, Project } from "~/content";
import { differentiators } from "~/content/site";

/** Two-digit section number, e.g. 5 → "05". */
const num = (n: number) => String(n).padStart(2, "0");

/** Selected work: only shown when there are visible projects. */
export function SelectedWork({
  projects,
  index,
}: {
  projects: Project[];
  index: number;
}) {
  if (projects.length === 0) return null;
  return (
    <section
      aria-labelledby="work-title"
      className="section-y relative border-t border-border"
    >
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="text-label text-muted" {...reveal()}>
              <span className="text-accent">{num(index)}</span> / Selected work
            </p>
            <h2 id="work-title" className="text-h2" {...reveal(1)}>
              From ideas to intelligent products.
            </h2>
          </div>
          <div {...reveal(2)}>
            <Button to="/work" variant="secondary">
              View all work
              <ArrowRight />
            </Button>
          </div>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.slug} {...reveal(i)}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Why ServeProGen: real differentiators, no statistics. */
export function WhyServeProGen({ index }: { index: number }) {
  return (
    <section
      aria-labelledby="why-title"
      className="section-y relative overflow-hidden border-t border-border"
    >
      <div
        aria-hidden="true"
        className="bg-blueprint absolute inset-0 -z-10 opacity-60"
      />
      <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <p className="text-label text-muted" {...reveal()}>
            <span className="text-accent">{num(index)}</span> / Why ServeProGen
          </p>
          <h2 id="why-title" className="text-h2" {...reveal(1)}>
            Why build with us?
          </h2>
          <p className="text-lead text-muted" {...reveal(2)}>
            A studio that treats software as engineering: careful, transparent and focused
            on what lasts beyond launch day.
          </p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-2">
          {differentiators.map((d, i) => (
            <li
              key={d.title}
              className="group relative flex flex-col gap-3 bg-bg p-7 transition-colors duration-(--duration-base) hover:bg-surface lg:p-8"
              {...reveal(i)}
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-0 bg-accent transition-[width] duration-(--duration-slow) ease-out-expo group-hover:w-full"
              />
              <span className="text-label text-accent">0{i + 1}</span>
              <h3 className="text-h3">{d.title}</h3>
              <p className="text-small text-muted">{d.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Insights preview: hidden until at least three published articles exist. */
export function InsightsPreview({
  articles,
  index,
}: {
  articles: Article[];
  index: number;
}) {
  if (articles.length < 3) return null;
  return (
    <section
      aria-labelledby="insights-title"
      className="section-y relative border-t border-border"
    >
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="text-label text-muted" {...reveal()}>
              <span className="text-accent">{num(index)}</span> / Insights
            </p>
            <h2 id="insights-title" className="text-h2" {...reveal(1)}>
              Explore ideas. Discover innovation.
            </h2>
          </div>
          <div {...reveal(2)}>
            <Button to="/insights" variant="secondary">
              View all insights
              <ArrowRight />
            </Button>
          </div>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {articles.map((a, i) => (
            <li key={a.slug} {...reveal(i)}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
