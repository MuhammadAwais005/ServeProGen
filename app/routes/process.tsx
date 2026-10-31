import { useEffect, useState } from "react";
import { Container } from "~/components/ui/Container";
import { CtaBand, Faq, PageHero, reveal, Section } from "~/components/ui/PageBlocks";
import { processStages } from "~/content/process";
import { cn } from "~/lib/cn";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

const crumbs = [
  { label: "Home", to: "/" },
  { label: "Our Process", to: "/process" },
];

export const meta = () =>
  pageMeta({
    title: "Our Process",
    description:
      "How ServeProGen delivers software: Discover, Strategize, Design, Engineer, Validate, and Launch & Evolve.",
    path: "/process",
    jsonLd: [breadcrumbLd(crumbs)],
  });

const faqs = [
  {
    q: "How long does each stage take?",
    a: "It depends on scope. A small project may move through Discover and Strategize in days; a complex product takes longer. The roadmap from Strategize gives you concrete estimates for your project.",
  },
  {
    q: "How involved do we need to be?",
    a: "Most involved in Discover and Design, where your knowledge of the business matters most. During Engineer, short regular reviews of working software keep the project on track.",
  },
  {
    q: "What happens after launch?",
    a: "Launch & Evolve covers monitoring, fixes and improvements based on real usage. Ongoing support is agreed separately so it fits your needs.",
  },
];

/** Scroll-spy: which stage section is currently in the reading zone. */
function useActiveStage(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const stageIds = processStages.map((s) => s.slug);

export default function Process() {
  const active = useActiveStage(stageIds);
  const activeIndex = stageIds.indexOf(active ?? stageIds[0]!);

  return (
    <>
      <PageHero
        crumbs={crumbs}
        label="Our Process"
        title="Six stages from idea to impact."
        intro="A transparent, engineering-led process. Each stage ends with something you can see, question and approve, so there are no surprises at the end."
      />

      <Section labelledBy="stages-title" bordered={false} className="pt-0!">
        <h2 id="stages-title" className="sr-only">
          Process stages
        </h2>
        <div className="grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-20">
          {/* Stage navigator */}
          <nav aria-label="Process stages" className="hidden lg:block">
            <ol className="sticky top-28 flex flex-col">
              {processStages.map((s, i) => (
                <li key={s.slug} className="relative">
                  {i < processStages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-9 left-[11px] h-[calc(100%-1.25rem)] w-px transition-colors duration-(--duration-slow)",
                        i < activeIndex ? "bg-accent" : "bg-border",
                      )}
                    />
                  )}
                  <a
                    href={`#${s.slug}`}
                    aria-current={active === s.slug ? "step" : undefined}
                    className={cn(
                      "group flex items-center gap-4 rounded-md py-3 transition-colors",
                      active === s.slug ? "text-text" : "text-muted hover:text-text",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full border text-[0.625rem] font-mono transition-colors duration-(--duration-base)",
                        i <= activeIndex
                          ? "border-accent bg-accent text-on-accent"
                          : "border-border-strong bg-bg",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="font-display text-lg font-semibold">{s.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="flex flex-col gap-6">
            {processStages.map((s) => (
              <li key={s.slug} id={s.slug} className="scroll-mt-28">
                <article
                  data-number={s.number}
                  className={cn(
                    "relative overflow-hidden rounded-panel border bg-surface p-7 transition-colors duration-(--duration-slow) lg:p-10",
                    // Decorative watermark number, drawn by CSS so it is not read or contrast-checked.
                    "before:pointer-events-none before:absolute before:-top-6 before:-right-2 before:font-display before:text-[9rem] before:leading-none before:font-semibold before:text-text/[0.035] before:content-[attr(data-number)]",
                    active === s.slug ? "border-accent/50" : "border-border",
                  )}
                  {...reveal()}
                >
                  <p className="text-label text-accent">Stage {s.number}</p>
                  <h3 className="text-h2 mt-3">{s.name}</h3>
                  <p className="text-lead mt-4 max-w-2xl text-text/90">{s.summary}</p>
                  <p className="mt-4 max-w-2xl text-muted">{s.detail}</p>
                  <div className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
                    <div>
                      <h4 className="text-label mb-4 font-sans font-normal text-muted">
                        What happens
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        {s.activities.map((a) => (
                          <li key={a} className="flex gap-3 text-small text-text">
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-label mb-4 font-sans font-normal text-muted">
                        You receive
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        {s.outputs.map((o) => (
                          <li key={o} className="flex gap-3 text-small text-text">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-px w-3 shrink-0 bg-accent-soft"
                            />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <Container className="px-0!">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
            <h2 id="faq-title" className="text-h2" {...reveal()}>
              Process questions
            </h2>
            <div {...reveal(1)}>
              <Faq items={faqs} />
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Ready for Discover?"
        text="Every project starts with a conversation about the problem. Tell us about yours."
      />
    </>
  );
}
