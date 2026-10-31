import { Container } from "~/components/ui/Container";
import { reveal } from "~/components/ui/PageBlocks";
import { useScrollAnimation } from "~/hooks/useScrollAnimation";

const statement =
  "Technology should do more than function. It should solve meaningful problems, simplify complexity, and create new possibilities.";

const pillars = [
  {
    label: "Engineering discipline",
    text: "Clear architecture, tested code and documentation, so what we build keeps working and keeps growing.",
  },
  {
    label: "Intelligent technology",
    text: "Machine learning, computer vision and automation, applied where they create real value.",
  },
  {
    label: "Business focus",
    text: "Every decision is tied to the problem you're solving and the people who will use the result.",
  },
];

/** Positioning statement: words brighten as the reader scrolls (GSAP scrub). */
export function Positioning() {
  const ref = useScrollAnimation<HTMLDivElement>(({ gsap, root }) => {
    const words = root.querySelectorAll("[data-word]");
    // Dim state stays at 4.1:1 contrast (#71717A), never near-invisible.
    gsap.fromTo(
      words,
      { color: "#71717A" },
      {
        color: "#F5F5F5",
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 78%", end: "bottom 55%", scrub: 0.6 },
      },
    );
  });

  return (
    <section aria-labelledby="positioning-title" className="section-y relative">
      <Container>
        <div ref={ref} className="flex flex-col gap-10">
          <p className="text-label text-muted" {...reveal()}>
            <span className="text-accent">01</span> / Our approach
          </p>
          <h2
            id="positioning-title"
            className="max-w-5xl font-display text-[clamp(1.75rem,1.1rem+2.6vw,3.5rem)] leading-[1.12] font-semibold tracking-[-0.025em]"
          >
            {statement.split(" ").map((word, i) => (
              <span key={i} data-word className="inline-block">
                {word}&nbsp;
              </span>
            ))}
          </h2>
        </div>
        <ul className="mt-16 grid gap-px overflow-hidden rounded-panel border border-border bg-border md:grid-cols-3">
          {pillars.map((p, i) => (
            <li
              key={p.label}
              className="flex flex-col gap-3 bg-bg p-7 lg:p-9"
              {...reveal(i)}
            >
              <span className="text-label text-accent">0{i + 1}</span>
              <h3 className="text-h3">{p.label}</h3>
              <p className="text-small text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
