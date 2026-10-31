import { Link } from "react-router";
import { ServiceIcon } from "~/components/brand/ServiceIcon";
import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { reveal } from "~/components/ui/PageBlocks";
import { services, type Service } from "~/content/services";
import { cn } from "~/lib/cn";

/** Bento layout on 12 columns: AI 7 + (5 over 5), then 5 + 7. */
const layout: Record<string, string> = {
  "ai-ml": "md:col-span-2 lg:col-span-7 lg:row-span-2",
  "full-stack-web": "lg:col-span-5",
  saas: "lg:col-span-5",
  automation: "lg:col-span-5",
  "custom-software": "md:col-span-2 lg:col-span-7",
};

export function ServicesBento() {
  const ordered = ["ai-ml", "full-stack-web", "saas", "automation", "custom-software"]
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));

  return (
    <section
      aria-labelledby="services-title"
      className="section-y relative border-t border-border"
    >
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="text-label text-muted" {...reveal()}>
              <span className="text-accent">02</span> / Services
            </p>
            <h2 id="services-title" className="text-h2" {...reveal(1)}>
              Five disciplines. One engineering standard.
            </h2>
          </div>
          <div {...reveal(2)}>
            <Button to="/services" variant="secondary">
              All services
              <ArrowRight />
            </Button>
          </div>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {ordered.map((s, i) => (
            <li key={s.slug} className={cn(layout[s.slug])} {...reveal(i)}>
              <ServiceTile service={s} feature={s.slug === "ai-ml"} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ServiceTile({ service, feature }: { service: Service; feature: boolean }) {
  return (
    <article
      className={cn(
        "group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-panel border border-border bg-surface p-7 transition-[border-color,box-shadow] duration-(--duration-base) lg:p-8",
        "focus-within:border-accent/60 hover:border-accent/50 hover:shadow-glow-sm",
        feature && "lg:p-10",
      )}
    >
      {feature && (
        <>
          <div
            aria-hidden="true"
            className="bg-blueprint absolute inset-0 -z-10 opacity-60"
          />
          <div
            aria-hidden="true"
            className="glow-accent absolute -right-24 -bottom-24 -z-10 size-96 opacity-70 transition-opacity duration-(--duration-slow) group-hover:opacity-100"
          />
        </>
      )}
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex items-center justify-center rounded-card border border-border bg-bg",
            feature ? "size-16" : "size-12",
          )}
        >
          <ServiceIcon kind={service.icon} size={feature ? 34 : 26} />
        </span>
        <span className="text-label text-muted">{service.number}</span>
      </div>
      <h3 className={feature ? "text-h2" : "text-h3"}>
        <Link
          to={`/services/${service.slug}`}
          prefetch="intent"
          viewTransition
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {service.title}
        </Link>
      </h3>
      <p className={cn("text-muted", feature ? "text-lead max-w-md" : "text-small")}>
        {service.summary}
      </p>
      <ul
        aria-label={`${service.title} capabilities`}
        className={cn(
          "mt-auto flex flex-wrap gap-2 pt-2",
          !feature &&
            "lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-[max-height,opacity] lg:duration-(--duration-slow) lg:group-focus-within:max-h-40 lg:group-focus-within:opacity-100 lg:group-hover:max-h-40 lg:group-hover:opacity-100",
        )}
      >
        {service.capabilities.slice(0, feature ? 6 : 4).map((c) => (
          <li
            key={c.name}
            className="rounded-full border border-border px-3 py-1 text-[0.8125rem] text-muted"
          >
            {c.name}
          </li>
        ))}
      </ul>
      <p
        className="flex items-center gap-2 text-small font-medium text-accent-soft"
        aria-hidden="true"
      >
        Learn more <ArrowRight />
      </p>
    </article>
  );
}
