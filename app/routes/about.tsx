import { LogoMark } from "~/components/brand/Logo";
import { TechTag } from "~/components/ui/Badge";
import { CtaBand, PageHero, reveal, Section, SplitRow } from "~/components/ui/PageBlocks";
import { processStages } from "~/content/process";
import { site, techEcosystem, values } from "~/content/site";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

const crumbs = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

export const meta = () =>
  pageMeta({
    title: "About",
    description:
      "ServeProGen is an emerging AI and software engineering studio. Our mission, vision, values and the way we approach engineering.",
    path: "/about",
    jsonLd: [breadcrumbLd(crumbs)],
  });

const philosophy = [
  {
    title: "Problems before technology",
    text: "We choose tools after understanding the problem, the users and the constraints. Sometimes the right answer is simpler than expected.",
  },
  {
    title: "Practical intelligence",
    text: "AI is valuable when it is scoped, measured and built into real workflows. We are as clear about what a model can't do as what it can.",
  },
  {
    title: "Built to be maintained",
    text: "Readable code, written-down decisions and clean handover, because software is a long-term asset, not a one-off delivery.",
  },
];

export default function About() {
  const { founder } = site;
  return (
    <>
      <PageHero
        crumbs={crumbs}
        label="About ServeProGen"
        title="An engineering studio for intelligent software."
        intro={site.intro}
        aside={
          <div className="relative flex aspect-square items-center justify-center rounded-panel border border-border bg-surface">
            <div
              aria-hidden="true"
              className="bg-blueprint absolute inset-0 opacity-80"
            />
            <div
              aria-hidden="true"
              className="glow-accent absolute inset-10 opacity-60"
            />
            <LogoMark size={200} title={null} className="relative" />
          </div>
        }
      />

      <Section labelledBy="who-title">
        <SplitRow label="01 / Who we are" title="ServeProGen" id="who-title">
          <div className="flex flex-col gap-6 text-lead text-muted">
            <p>
              ServeProGen is a technology-driven software engineering studio. We develop
              intelligent digital products, custom software, AI-powered solutions, SaaS
              platforms and business automation systems.
            </p>
            <p>
              We work with established businesses modernising their operations and with
              startups and founders turning ideas into working products. In both cases the
              goal is the same: practical, scalable technology that solves a real problem.
            </p>
            <p>
              We are an emerging studio, and we say so plainly. What we offer is careful
              engineering, honest communication and a genuine stake in what we build with
              you.
            </p>
          </div>
        </SplitRow>
      </Section>

      <Section labelledBy="mission-title">
        <div className="grid gap-5 md:grid-cols-2">
          <article
            className="relative flex flex-col gap-5 overflow-hidden rounded-panel border border-border bg-surface p-8 lg:p-12"
            {...reveal()}
          >
            <div
              aria-hidden="true"
              className="glow-accent absolute -top-32 -right-32 size-80 opacity-60"
            />
            <p className="text-label text-accent">Our mission</p>
            <h2
              id="mission-title"
              className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight font-semibold"
            >
              {site.mission}
            </h2>
          </article>
          <article
            className="flex flex-col gap-5 rounded-panel border border-border bg-surface p-8 lg:p-12"
            {...reveal(1)}
          >
            <p className="text-label text-accent">Our vision</p>
            <p className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight font-semibold">
              {site.vision}
            </p>
          </article>
        </div>
      </Section>

      <Section labelledBy="philosophy-title">
        <SplitRow
          label="02 / Engineering philosophy"
          title="How we think about technology"
          id="philosophy-title"
        >
          <ol className="flex flex-col divide-y divide-border border-y border-border">
            {philosophy.map((p, i) => (
              <li key={p.title} className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr]">
                <span className="text-label pt-2 text-accent">0{i + 1}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h3">{p.title}</h3>
                  <p className="text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </SplitRow>
      </Section>

      <Section labelledBy="values-title">
        <div className="mb-12 flex max-w-2xl flex-col gap-5">
          <p className="text-label text-muted" {...reveal()}>
            <span className="text-accent">03</span> / Core values
          </p>
          <h2 id="values-title" className="text-h2" {...reveal(1)}>
            Seven values, applied every day.
          </h2>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.name} className="flex flex-col gap-3 bg-bg p-7" {...reveal(i)}>
              <span className="text-label text-accent">0{i + 1}</span>
              <h3 className="font-display text-xl font-semibold">{v.name}</h3>
              <p className="text-small text-muted">{v.text}</p>
            </li>
          ))}
          <li
            className="hidden flex-col justify-end gap-3 bg-surface p-7 lg:flex"
            aria-hidden="true"
          >
            <LogoMark size={40} title={null} />
          </li>
        </ul>
      </Section>

      <Section labelledBy="capabilities-title">
        <SplitRow
          label="04 / Technical capabilities"
          title="The tools we work with"
          id="capabilities-title"
        >
          <div className="flex flex-col gap-8">
            <p className="text-lead text-muted">
              We favour mature, well-supported technology, and only list what we genuinely
              use.
            </p>
            <dl className="flex flex-col divide-y divide-border border-y border-border">
              {techEcosystem.map((group) => (
                <div
                  key={group.group}
                  className="grid gap-4 py-6 sm:grid-cols-[9rem_1fr]"
                >
                  <dt className="text-label pt-1.5 text-muted">{group.group}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <TechTag className="text-[0.8125rem] text-text">{item}</TechTag>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </SplitRow>
      </Section>

      <Section labelledBy="approach-title">
        <SplitRow
          label="05 / Our approach"
          title="How we solve problems"
          id="approach-title"
        >
          <div className="flex flex-col gap-6">
            <p className="text-lead text-muted">
              Every engagement follows the same six stages, so you always know where the
              work stands and what comes next.
            </p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {processStages.map((s) => (
                <li
                  key={s.slug}
                  className="flex gap-4 rounded-card border border-border bg-surface p-5"
                >
                  <span className="text-label pt-1 text-accent">{s.number}</span>
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-text">{s.name}</span>
                    <span className="text-small text-muted">{s.summary}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </SplitRow>
      </Section>

      {founder.enabled && founder.name && (
        <Section labelledBy="founder-title">
          <div className="grid items-center gap-10 md:grid-cols-[18rem_1fr]">
            {founder.photo && (
              <img
                src={founder.photo}
                alt={`${founder.name}, ${founder.role} of ServeProGen`}
                width={288}
                height={288}
                loading="lazy"
                className="aspect-square w-full rounded-panel border border-border object-cover"
              />
            )}
            <div className="flex flex-col gap-4">
              <p className="text-label text-accent">{founder.role}</p>
              <h2 id="founder-title" className="text-h2">
                {founder.name}
              </h2>
              {founder.bio && <p className="text-lead text-muted">{founder.bio}</p>}
            </div>
          </div>
        </Section>
      )}

      <CtaBand
        title="Let's build something worth maintaining."
        text="Tell us about the problem you're solving. We'll reply with honest questions and a practical next step."
        secondary={{ label: "Our process", to: "/process" }}
      />
    </>
  );
}
