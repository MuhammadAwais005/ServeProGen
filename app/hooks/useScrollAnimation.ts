import { useEffect, useRef, type RefObject } from "react";
import type { gsap } from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

type Gsap = typeof gsap;
type ScrollTriggerType = typeof ScrollTrigger;

/**
 * Runs a GSAP + ScrollTrigger setup scoped to `ref`, loading GSAP lazily.
 * Skipped entirely under prefers-reduced-motion: the static layout is final.
 * All tweens and triggers are reverted on unmount via gsap.context().
 */
export function useScrollAnimation<T extends HTMLElement>(
  setup: (ctx: { gsap: Gsap; ScrollTrigger: ScrollTriggerType; root: T }) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => setup({ gsap, ScrollTrigger, root }), root);
        revert = () => ctx.revert();
      },
    );

    return () => {
      cancelled = true;
      revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setup is intentionally static per deps
  }, deps);

  return ref;
}
