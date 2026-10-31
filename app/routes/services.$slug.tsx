import { Check } from "lucide-react";
import { Link } from "react-router";
import { ServiceIcon } from "~/components/brand/ServiceIcon";
import { TechTag } from "~/components/ui/Badge";
import { ArrowRight } from "~/components/ui/Button";
import {
  CtaBand,
  Faq,
  PageHero,
  reveal,
  Section,
  SplitRow,
} from "~/components/ui/PageBlocks";
import { ProjectCard } from "~/components/work/ProjectCard";
import { projectsForService } from "~/content";
import { processStages } from "~/content/process";
import { getService, services } from "~/content/services";
import { breadcrumbLd, pageMeta, serviceLd } from "~/lib/seo";
import { NotFound } from "./not-found";
import type { Route } from "./+types/services.$slug";

/* No loader: service content is static data. Unknown slugs get the 404 page. */
export const meta = ({ params }: Route.MetaArgs) => {
  const service = getService(params.slug);
  if (!service)
    return [
      { title: "Page not found | ServeProGen" },
      { name: "robots", content: "noindex" },
    ];
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: service.title, to: `/services/${service.slug}` },
  ];
  return pageMeta({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    jsonLd: [serviceLd(service), breadcrumbLd(crumbs)],
  });
};

export default function ServicePage({ params }: Route.ComponentProps) {
  const service = getService(params.slug);
  if (!service) return <NotFound />;
  const related = projectsForService(service.slug).slice(0, 3);
  const others = services.filter((s) => s.slug !== service.slug);
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: service.shortTitle, to: `/services/${service.slug}` },
  ];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        label={`Service ${service.number}`}
        title={service.title}
        intro={service.intro}
        aside={
          <div className="relative ml-auto flex aspect-square w-72 items-center justify-center rounded-panel border border-border bg-surface">
            <div
              aria-hidden="true"
              className="bg-blueprint absolute inset-0 opacity-80"
            />
            <div aria-hidden="true" className="glow-accent absolute inset-6 opacity-70" />
            <ServiceIcon kind={service.icon} size={120} className="relative" />
          </div>
        }
      />

      <Section labelledBy="problem-title">
        <SplitRow
          label="01 / The problem"
          title={service.problem.title}
          id="problem-title"
        >
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {service.problem.points.map((point) => (
              <li key={point} className="flex gap-4 py-5 text-lead text-muted">
                <span aria-hidden="true" className="mt-3 h-px w-5 shrink-0 bg-accent" />
                {point}
              </li>
            ))}
          </ul>
        </SplitRow>
      </Section>

      <Section labelledBy="solution-title">
        <SplitRow
          label="02 / Our solution"
          title={service.solution.title}
          id="solution-title"
        >
          <div className="flex flex-col gap-8">
            <p className="text-lead text-muted">{service.solution.text}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.solution.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex gap-3 rounded-card border border-border bg-surface p-5"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-accent"
                  />
                  <span className="text-small text-text">{o}</span>
                </li>
              ))}
            </ul>
            <p className="text-small text-muted">
              Outcomes depend on each project's scope, data and constraints; we agree on
              success criteria together during Discover.
            </p>
          </div>
        </SplitRow>
      </Section>

      <Section labelledBy="capabilities-title">
        <div className="mb-12 flex max-w-2xl flex-col gap-5">
          <p className="text-label text-muted" {...reveal()}>
            <span className="text-accent">03</span> / Capabilities
          </p>
          <h2 id="capabilities-title" className="text-h2" {...reveal(1)}>
            What we deliver
          </h2>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {service.capabilities.map((c, i) => (
            <li key={c.name} className="flex flex-col gap-2 bg-bg p-7" {...reveal(i % 3)}>
              <h3 className="font-display text-lg font-semibold">{c.name}</h3>
              <p className="text-small text-muted">{c.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="approach-title">
        <SplitRow
          label="04 / Technology approach"
          title={service.approach.title}
          id="approach-title"
        >
          <div className="flex flex-col gap-6">
            <p className="text-lead text-muted">{service.approach.text}</p>
            <ul className="flex flex-wrap gap-2" aria-label="Typical technology">
              {service.approach.stack.map((t) => (
                <li key={t}>
                  <TechTag className="text-[0.8125rem] text-text">{t}</TechTag>
                </li>
              ))}
            </ul>
          </div>
        </SplitRow>
      </Section>

      <Section labelledBy="delivery-title">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="text-label text-muted" {...reveal()}>
              <span className="text-accent">05</span> / Delivery process
            </p>
            <h2 id="delivery-title" className="text-h2" {...reveal(1)}>
              How the work is delivered
            </h2>
          </div>
          <Link
            to="/process"
            className="group inline-flex items-center gap-2 text-small font-medium text-accent-soft hover:text-text"
          >
            Our process in detail <ArrowRight />
          </Link>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-2 lg:grid-cols-6">
          {processStages.map((s, i) => (
            <li key={s.slug} className="flex flex-col gap-2 bg-bg p-6" {...reveal(i)}>
              <span className="text-label text-accent">{s.number}</span>
              <span className="font-display text-lg font-semibold">{s.name}</span>
              <span className="text-[0.8125rem] text-muted">{s.summary}</span>
            </li>
          ))}
        </ol>
      </Section>

      {related.length > 0 && (
        <Section labelledBy="related-title">
          <h2 id="related-title" className="text-h2 mb-12" {...reveal()}>
            Related work
          </h2>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <li key={p.slug} {...reveal(i)}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
          <h2 id="faq-title" className="text-h2" {...reveal()}>
            Frequently asked questions
          </h2>
          <div {...reveal(1)}>
            <Faq items={service.faqs} />
          </div>
        </div>
      </Section>

      <Section labelledBy="other-title">
        <h2 id="other-title" className="text-label mb-6 text-muted">
          Other services
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                to={`/services/${s.slug}`}
                prefetch="intent"
                viewTransition
                className="group flex h-full items-center gap-4 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <ServiceIcon kind={s.icon} size={24} />
                <span className="flex-1 text-small font-medium">{s.title}</span>
                <ArrowRight />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={`Discuss your ${service.shortTitle} project`}
        text="Tell us what you're trying to achieve. We'll reply with questions and a practical next step."
      />
    </>
  );
}
