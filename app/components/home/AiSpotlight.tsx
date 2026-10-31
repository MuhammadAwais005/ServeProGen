import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { reveal } from "~/components/ui/PageBlocks";
import { useScrollAnimation } from "~/hooks/useScrollAnimation";

const pipeline = [
  { step: "Frame", text: "Images or video arrive from a camera, upload or stream." },
  { step: "Prepare", text: "Frames are resized, normalised and batched for the model." },
  {
    step: "Infer",
    text: "A trained detector or classifier runs on cloud or edge hardware.",
  },
  {
    step: "Decide",
    text: "Detections become events, counts or alerts in your software.",
  },
];

/** AI & computer vision spotlight: an illustrated inference pipeline. */
export function AiSpotlight() {
  const ref = useScrollAnimation<HTMLDivElement>(({ gsap, root }) => {
    const boxes = root.querySelectorAll<SVGRectElement>("[data-box]");
    const tags = root.querySelectorAll("[data-tag]");
    const links = root.querySelectorAll<SVGPathElement>("[data-link]");
    boxes.forEach((b) => {
      const len = b.getTotalLength();
      gsap.set(b, { strokeDasharray: len, strokeDashoffset: len });
    });
    links.forEach((l) => {
      const len = l.getTotalLength();
      gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.set(tags, { opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 70%", once: true },
    });
    tl.to(links, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.inOut",
      stagger: 0.05,
    })
      .to(
        boxes,
        { strokeDashoffset: 0, duration: 0.9, ease: "power3.out", stagger: 0.2 },
        "-=0.4",
      )
      .to(tags, { opacity: 1, duration: 0.4, stagger: 0.2 }, "-=0.6");
  });

  return (
    <section
      aria-labelledby="ai-title"
      className="section-y relative overflow-hidden border-t border-border"
    >
      <div
        aria-hidden="true"
        className="glow-accent absolute top-1/3 -left-72 size-[44rem] opacity-50"
      />
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <p className="text-label text-muted" {...reveal()}>
            <span className="text-accent">03</span> / AI & Computer Vision
          </p>
          <h2 id="ai-title" className="text-h2" {...reveal(1)}>
            From pixels to decisions.
          </h2>
          <p className="text-lead text-muted" {...reveal(2)}>
            We build the whole path: data preparation, model training and honest
            evaluation, through to software that turns predictions into action, on servers
            or on edge devices.
          </p>
          <ol className="mt-2 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2">
            {pipeline.map((p, i) => (
              <li key={p.step} className="flex flex-col gap-2 bg-bg p-5" {...reveal(i)}>
                <span className="text-label flex items-center gap-2 text-accent">
                  0{i + 1} <span className="text-text">{p.step}</span>
                </span>
                <span className="text-small text-muted">{p.text}</span>
              </li>
            ))}
          </ol>
          <div className="pt-2" {...reveal(3)}>
            <Button to="/services/ai-ml" variant="secondary">
              AI & Machine Learning
              <ArrowRight />
            </Button>
          </div>
        </div>

        <div ref={ref} {...reveal(1)}>
          <figure className="relative overflow-hidden rounded-panel border border-border bg-surface">
            <div
              aria-hidden="true"
              className="bg-blueprint absolute inset-0 opacity-70"
            />
            <svg
              viewBox="0 0 560 420"
              fill="none"
              role="img"
              aria-label="Illustration of an object detection pipeline: a camera frame passes through a neural network, which outputs labelled bounding boxes."
              className="relative h-auto w-full"
            >
              {/* Camera frame */}
              <rect
                x="28"
                y="40"
                width="300"
                height="220"
                rx="10"
                stroke="var(--color-border-strong)"
              />
              <path d="M28 70h300" stroke="var(--color-border)" />
              <text
                x="44"
                y="60"
                fill="var(--color-muted)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                INPUT FRAME
              </text>
              {/* abstract scene */}
              <path
                d="M28 230l70-50 50 30 70-60 60 40 50-20v80H28z"
                fill="var(--color-text)"
                opacity="0.05"
              />
              <g stroke="var(--color-text)" strokeOpacity="0.7" strokeWidth="1.5">
                <circle cx="104" cy="122" r="13" />
                <path d="M80 210c0-36 10-60 24-60s24 24 24 60" />
                <rect x="190" y="150" width="104" height="52" rx="10" />
                <circle cx="212" cy="206" r="9" />
                <circle cx="272" cy="206" r="9" />
              </g>
              <rect
                data-box
                x="70"
                y="96"
                width="70"
                height="124"
                rx="2"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              <g data-tag>
                <rect x="70" y="82" width="58" height="14" fill="var(--color-accent)" />
                <text
                  x="75"
                  y="92.5"
                  fill="var(--color-on-accent)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  PERSON
                </text>
              </g>
              <rect
                data-box
                x="182"
                y="138"
                width="122"
                height="84"
                rx="2"
                stroke="var(--color-accent-soft)"
                strokeWidth="2"
              />
              <g data-tag>
                <rect
                  x="182"
                  y="124"
                  width="62"
                  height="14"
                  fill="var(--color-accent-soft)"
                />
                <text
                  x="187"
                  y="134.5"
                  fill="var(--color-on-accent)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  VEHICLE
                </text>
              </g>

              {/* Network */}
              <g>
                {[0, 1, 2].map((layer) =>
                  [0, 1, 2, 3].map((n) => (
                    <circle
                      key={`${layer}-${n}`}
                      cx={384 + layer * 64}
                      cy={78 + n * 50}
                      r="7"
                      stroke="var(--color-border-strong)"
                      fill="var(--color-bg)"
                    />
                  )),
                )}
                {[0, 1, 2, 3].map((a) =>
                  [0, 1, 2, 3].map((b) => (
                    <path
                      data-link
                      key={`l1-${a}-${b}`}
                      d={`M391 ${78 + a * 50}L441 ${78 + b * 50}`}
                      stroke="var(--color-text)"
                      strokeOpacity="0.18"
                    />
                  )),
                )}
                {[0, 1, 2, 3].map((a) =>
                  [0, 1, 2, 3].map((b) => (
                    <path
                      data-link
                      key={`l2-${a}-${b}`}
                      d={`M455 ${78 + a * 50}L505 ${78 + b * 50}`}
                      stroke="var(--color-text)"
                      strokeOpacity="0.18"
                    />
                  )),
                )}
                <circle cx="512" cy="128" r="7" fill="var(--color-accent)" />
              </g>
              <path
                data-link
                d="M328 150h48"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Output */}
              <rect
                x="28"
                y="296"
                width="504"
                height="96"
                rx="10"
                stroke="var(--color-border)"
              />
              <text
                x="44"
                y="322"
                fill="var(--color-muted)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                OUTPUT → APPLICATION
              </text>
              {[
                ["person", "zone A", "event"],
                ["vehicle", "zone B", "logged"],
              ].map(([a, b, c], i) => (
                <g key={a} fontFamily="var(--font-mono)" fontSize="11">
                  <circle
                    cx="50"
                    cy={346 + i * 24}
                    r="3.5"
                    fill={i ? "var(--color-accent-soft)" : "var(--color-accent)"}
                  />
                  <text x="64" y={350 + i * 24} fill="var(--color-text)">
                    {a}
                  </text>
                  <text x="190" y={350 + i * 24} fill="var(--color-muted)">
                    {b}
                  </text>
                  <text x="330" y={350 + i * 24} fill="var(--color-muted)">
                    {c}
                  </text>
                </g>
              ))}
            </svg>
            <figcaption className="text-label relative border-t border-border px-5 py-3 text-[0.625rem] text-muted">
              Illustration · not a product screenshot
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
