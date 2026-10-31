/**
 * Motion tokens for JavaScript animation (Motion, GSAP). Mirrors the CSS
 * variables in styles/tokens.css so CSS and JS animations feel identical.
 *
 * Ownership rules (see the Phase 1 spec):
 *  - CSS transitions  → hovers, focus, small state changes
 *  - Motion           → React-driven enter/exit: menus, page transitions, reveals
 *  - GSAP             → scroll-linked timelines: hero text, pinned sections
 *  - Lenis            → smooth scrolling only (desktop, not under reduced motion)
 *  - React Three Fiber→ the hero 3D scene only
 * One element is animated by one system, never two.
 */

export const duration = {
  fast: 0.15,
  base: 0.25,
  reveal: 0.6,
  slow: 0.9,
} as const;

export const stagger = 0.06;

/** cubic-bezier control points */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  standard: [0.2, 0, 0, 1],
} as const;

/** GSAP accepts CustomEase strings; this is the named equivalent for most uses. */
export const gsapEase = {
  outExpo: "expo.out",
  standard: "power2.out",
} as const;
