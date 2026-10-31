import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Content is visible without JavaScript; see the reveal system in app.css.
 * Elements can set style={{ "--reveal-index": n }} to stagger.
 */
export function RevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-revealed])",
    );
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
