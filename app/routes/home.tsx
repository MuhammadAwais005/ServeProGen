import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { LatticePoster } from "~/components/sections/LatticePoster";
import { primaryCta, site } from "~/content/site";
import { pageMeta } from "~/lib/seo";

export const meta = () => pageMeta({ path: "/" });

/**
 * Phase 1: static hero shell only (real HTML, no animation).
 * Phase 3 adds the Neural Lattice scene, the intro sequence and the other
 * ten homepage sections defined in the Phase 1 spec.
 */
export default function Home() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden pt-header"
    >
      <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="glow-accent absolute -right-40 top-1/4 -z-10 size-[48rem] opacity-60"
      />
      <LatticePoster className="absolute top-1/2 right-[-12%] -z-10 hidden w-[56rem] -translate-y-1/2 opacity-90 md:block lg:right-[-4%]" />

      <Container className="py-20">
        <div className="flex max-w-4xl flex-col gap-8">
          <p className="text-label text-muted">
            <span className="text-accent">●</span> {site.positioning}
          </p>

          <h1 id="hero-title" className="text-display">
            <span className="block">Engineering Intelligence.</span>
            <span className="block text-muted">Building Possibilities.</span>
          </h1>

          <p className="text-lead max-w-2xl text-muted">
            We design and engineer intelligent software, from machine learning and
            computer vision to automation and scalable web platforms, that solves real
            business problems.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button to={primaryCta.to} size="lg" className="group">
              {primaryCta.label}
              <ArrowRight />
            </Button>
            <Button to="/work" variant="secondary" size="lg">
              View our work
            </Button>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-border md:block"
      >
        <span className="block h-4 w-px animate-[scroll-cue_2s_ease-in-out_infinite] bg-accent" />
      </div>
    </section>
  );
}
