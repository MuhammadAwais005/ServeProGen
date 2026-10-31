import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { LatticePoster } from "~/components/sections/LatticePoster";
import { useDeviceTier } from "~/hooks/useDeviceTier";
import { cn } from "~/lib/cn";

const NeuralLatticeScene = lazy(() => import("./NeuralLatticeScene"));

/**
 * Hero background. The static lattice poster is always in the HTML; on capable
 * devices the WebGL scene loads after the page is idle and cross-fades in.
 * The scene pauses whenever the hero is off-screen or the tab is hidden.
 */
export function HeroScene({ className }: { className?: string }) {
  const tier = useDeviceTier();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  // Start loading the 3D chunk only once the browser is idle.
  useEffect(() => {
    if (!tier || tier === "poster") return;
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => setLoad(true), { timeout: 2500 });
    return () => cancel(handle);
  }, [tier]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      {
        threshold: 0,
      },
    );
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <LatticePoster
        className={cn(
          "absolute top-1/2 right-[-14%] h-auto w-[60rem] max-w-none -translate-y-1/2 transition-opacity duration-[1400ms] ease-out-expo lg:right-[-6%]",
          ready ? "opacity-0" : "opacity-90",
        )}
      />
      {load && tier && tier !== "poster" && (
        <Suspense fallback={null}>
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-out-expo",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <NeuralLatticeScene
              tier={tier}
              active={visible && pageVisible}
              onReady={onReady}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}
