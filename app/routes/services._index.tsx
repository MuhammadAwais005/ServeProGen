import { Link } from "react-router";
import { ServiceIcon } from "~/components/brand/ServiceIcon";
import { ArrowRight } from "~/components/ui/Button";
import { CtaBand, Faq, PageHero, reveal, Section } from "~/components/ui/PageBlocks";
import { services } from "~/content/services";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

const crumbs = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
];

export const meta = () =>
  pageMeta({
    title: "Services",
    description:
      "Full-stack web development, AI and machine learning, SaaS product development, business process automation and custom software from ServeProGen.",
    path: "/services",
    jsonLd: [breadcrumbLd(crumbs)],
  });

const generalFaqs = [
  {
    q: "How does a project start?",
    a: "With a conversation about the problem, not the technology. Send an inquiry through the contact form and we'll reply with questions and a suggested next step.",
  },
  {
    q: "Do you work with startups and established businesses?",
    a: "Yes. Startups usually need a focused first version of a product; established businesses usually need to modernise or automate existing work. The process adapts to both.",
  },
  {
    q: "Can one project combine several services?",
    a: "Often. A SaaS product might combine full-stack development with an AI feature and some automation. We scope it as one coherent system.",
  },
];

export default function Services() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        label="Services"
        title="Engineering for intelligent, scalable software."
        intro="Five disciplines that work on their own or together, all delivered with the same engineering standard and the same transparent process."
      />

      <Section labelledBy="services-list" bordered={false} className="pt-0!">
        <h2 id="services-list" className="sr-only">
          Our services
        </h2>
        <ol className="flex flex-col gap-4">
          {services.map((s, i) => (
            <li key={s.slug} {...reveal(i)}>
              <article className="group relative grid gap-6 overflow-hidden rounded-panel border border-border bg-surface p-7 transition-[border-color,box-shadow] duration-(--duration-base) focus-within:border-accent/60 hover:border-accent/50 hover:shadow-glow-sm md:grid-cols-[auto_1fr_auto] md:items-center lg:p-10">
                <span className="flex size-16 items-center justify-center rounded-card border border-border bg-bg">
                  <ServiceIcon kind={s.icon} size={32} />
                </span>
                <div className="flex flex-col gap-3">
                  <p className="text-label text-muted">
                    <span className="text-accent">{s.number}</span> / {s.shortTitle}
                  </p>
                  <h3 className="text-h2">
                    <Link
                      to={`/services/${s.slug}`}
                      prefetch="intent"
                      viewTransition
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="max-w-2xl text-muted">{s.summary}</p>
                  <p className="max-w-2xl text-small text-text/80">
                    <span className="text-accent-soft">Who it's for: </span>
                    {s.solves}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-full border border-border-strong text-text transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
                >
                  <ArrowRight />
                </span>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
          <h2 id="faq-title" className="text-h2" {...reveal()}>
            Common questions
          </h2>
          <div {...reveal(1)}>
            <Faq items={generalFaqs} />
          </div>
        </div>
      </Section>

      <CtaBand secondary={{ label: "See our process", to: "/process" }} />
    </>
  );
}
