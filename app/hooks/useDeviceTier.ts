import { useEffect, useState } from "react";

export type DeviceTier = "full" | "reduced" | "poster";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Decides once, on the client, how much of the hero scene a device gets:
 * - poster:  reduced motion, data saver, slow network, low memory, or no WebGL
 * - reduced: phones, tablets and modest hardware
 * - full:    capable desktops
 * Returns null during pre-rendering and before the check runs, so the static
 * poster is always what ships in the HTML.
 */
export function useDeviceTier(): DeviceTier | null {
  const [tier, setTier] = useState<DeviceTier | null>(null);

  useEffect(() => {
    const nav = navigator as NavigatorHints;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = nav.connection?.saveData === true;
    const slowNet = ["slow-2g", "2g"].includes(nav.connection?.effectiveType ?? "");
    const lowMemory = (nav.deviceMemory ?? 8) <= 2;
    const fewCores = (nav.hardwareConcurrency ?? 8) <= 2;

    // QA override: ?hero=full | reduced | poster
    const forced = new URLSearchParams(window.location.search).get("hero");

    let next: DeviceTier;
    if (forced === "full" || forced === "reduced" || forced === "poster") {
      next = forced;
    } else if (
      reducedMotion ||
      saveData ||
      slowNet ||
      lowMemory ||
      fewCores ||
      !hasWebGL()
    ) {
      next = "poster";
    } else if (
      window.innerWidth < 1024 ||
      window.matchMedia("(pointer: coarse)").matches ||
      (nav.hardwareConcurrency ?? 8) <= 4
    ) {
      next = "reduced";
    } else {
      next = "full";
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client capability probe
    setTier(next);
  }, []);

  return tier;
}
