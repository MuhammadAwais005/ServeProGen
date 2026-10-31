import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Lenis smooth scrolling: desktop pointers only, never under reduced motion or
 * on touch devices (native scrolling feels better there). Loaded lazily after
 * the page is interactive so it costs nothing on first paint. Keyboard
 * scrolling, anchors and focus behave natively.
 */
export function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return;

    let destroyed = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        document.documentElement.classList.remove("lenis");
      };
    };

    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => void start());

    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  // Keep ScrollTrigger measurements correct after client-side navigation.
  useEffect(() => {
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) =>
      ScrollTrigger.refresh(),
    );
  }, [pathname]);

  return null;
}
