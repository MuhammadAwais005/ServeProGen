import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { reveal } from "~/components/ui/PageBlocks";
import { processStages } from "~/content/process";
import { useScrollAnimation } from "~/hooks/useScrollAnimation";

/**
 * Six-stage process. A signal line fills as the section scrolls past and each
 * node and number lights up when the line reaches it (GSAP scrub, no pinning).
 * Text is always fully readable. Without JavaScript or with reduced motion,
 * every stage is shown fully lit.
 */
export function ProcessPreview() {
  const ref = useScrollAnimation<HTMLOListElement>(({ gsap, root }) => {
    const fill = root.querySelector("[data-fill]");
    const nodes = root.querySelectorAll("[data-node]");
    const items = root.querySelectorAll("[data-stage]");
    const numbers = root.querySelectorAll("[data-stage-number]");
    const vertical = window.matchMedia("(max-width: 1023px)").matches;

    gsap.set(fill, vertical ? { scaleY: 0 } : { scaleX: 0 });
    gsap.set(nodes, { backgroundColor: "#08090D", borderColor: "#71717A" });
    // Text stays fully readable; only the signal (line, nodes, numbers) lights up.
    gsap.set(numbers, { color: "#A1A1AA" }); // muted text, 7.8:1

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 60%", scrub: 0.5 },
    });
    tl.to(fill, vertical ? { scaleY: 1, ease: "none" } : { scaleX: 1, ease: "none" }, 0);
    items.forEach((_item, i) => {
      const at = i / (items.length - 1);
      tl.to(
        nodes[i]!,
        { backgroundColor: "#FF702E", borderColor: "#FF702E", duration: 0.05 },
        at * 0.95,
      );
      tl.to(numbers[i]!, { color: "#FF702E", duration: 0.05 }, at * 0.95);
    });
  });

  return (
    <section
      aria-labelledby="process-title"
      className="section-y relative border-t border-border"
    >
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="text-label text-muted" {...reveal()}>
              <span className="text-accent">04</span> / Process
            </p>
            <h2 id="process-title" className="text-h2" {...reveal(1)}>
              A clear path from idea to impact.
            </h2>
            <p className="text-lead text-muted" {...reveal(2)}>
              Six stages, each ending with something you can see and approve.
            </p>
          </div>
          <div {...reveal(3)}>
            <Button to="/process" variant="secondary">
              Our process in detail
              <ArrowRight />
            </Button>
          </div>
        </div>

        <ol
          ref={ref}
          className="relative grid gap-10 pl-10 lg:grid-cols-6 lg:gap-6 lg:pt-12 lg:pl-0"
        >
          {/* Track: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-border lg:top-[7px] lg:right-[calc(100%/12)] lg:bottom-auto lg:left-[calc(100%/12)] lg:h-px lg:w-auto"
          />
          <span
            data-fill
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent lg:top-[7px] lg:right-[calc(100%/12)] lg:bottom-auto lg:left-[calc(100%/12)] lg:h-px lg:w-auto lg:origin-left"
          />
          {processStages.map((stage) => (
            <li
              key={stage.slug}
              data-stage
              className="relative flex flex-col gap-3 lg:items-center lg:text-center"
            >
              <span
                data-node
                aria-hidden="true"
                className="absolute top-1 -left-10 size-[15px] rounded-full border-2 border-accent bg-accent lg:static lg:-mt-12 lg:mb-4"
              />
              <span data-stage-number className="text-label text-accent">
                {stage.number}
              </span>
              <h3 className="text-h3">{stage.name}</h3>
              <p className="text-small text-muted">{stage.summary}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
