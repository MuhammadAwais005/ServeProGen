import type { CSSProperties } from "react";
import { HeroScene } from "~/components/hero/HeroScene";
import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { site } from "~/content/site";

/**
 * Cinematic hero. Text is real HTML and visible without JavaScript; the intro
 * is pure CSS. Sized by viewport width and height so the headline and both
 * CTAs sit inside the first screen on a 1366×768 laptop.
 */
export function Hero({ hasWork }: { hasWork: boolean }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(36rem,100svh)] items-center overflow-hidden pt-16 lg:pt-header"
    >
      <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-30" />
      <div
        aria-hidden="true"
        className="glow-accent absolute top-[18%] -right-48 -z-20 size-[52rem] opacity-70"
      />
      <HeroScene className="absolute inset-0 -z-10" />
      {/* Readability scrim behind the text column */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-full bg-[linear-gradient(90deg,var(--color-bg)_0%,rgb(8_9_13/0.85)_38%,transparent_75%)] lg:w-[78%]"
      />

      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-6 lg:gap-7">
          <p className="text-label hero-fade flex items-center gap-3 text-muted">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {site.positioning}
          </p>

          <h1 id="hero-title" className="text-hero font-display font-semibold">
            <span className="hero-line" style={{ "--line": 0 } as CSSProperties}>
              <span>Engineering Intelligence.</span>
            </span>
            <span className="hero-line" style={{ "--line": 1 } as CSSProperties}>
              <span className="hero-sweep bg-[linear-gradient(100deg,var(--color-text)_4.5%,var(--color-accent-soft)_25%,var(--color-accent)_43%,var(--color-text)_62%)] bg-clip-text text-transparent">
                Building Possibilities.
              </span>
            </span>
          </h1>

          <p
            className="text-lead hero-fade max-w-2xl text-muted"
            style={{ "--line": 1 } as CSSProperties}
          >
            We engineer intelligent software, AI-powered solutions, and scalable digital
            products that help businesses and startups move ideas into reality.
          </p>

          <div
            className="hero-fade flex flex-wrap gap-3 pt-1"
            style={{ "--line": 2 } as CSSProperties}
          >
            <Button to="/contact" size="lg">
              Start a Project
              <ArrowRight />
            </Button>
            <Button to={hasWork ? "/work" : "/services"} variant="secondary" size="lg">
              {hasWork ? "Explore Our Work" : "Explore Our Services"}
            </Button>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden h-10 w-px -translate-x-1/2 overflow-hidden bg-border md:block"
      >
        <span className="block h-3 w-px animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-accent" />
      </div>
    </section>
  );
}
