import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Logo } from "~/components/brand/Logo";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { mainNav, primaryCta } from "~/content/site";
import { useScrolled } from "~/hooks/useScrolled";
import { cn } from "~/lib/cn";

const MENU_ID = "mobile-menu";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Global header.
 * - Transparent over the hero; blurred dark bar after 24px of scroll.
 * - Desktop (≥1024px): inline nav + primary CTA.
 * - Mobile: full-screen menu. While open, the page behind is inert, scroll is
 *   locked, Tab cycles inside the header, Esc closes and focus returns to the toggle.
 */
export function SiteHeader() {
  const scrolled = useScrolled(24);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Close on navigation (state adjusted during render, React's recommended pattern).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Close when the viewport grows to desktop.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => media.matches && setOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Modal behavior while the menu is open.
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    const root = document.documentElement;
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    root.style.overflow = "hidden";

    const firstLink = headerRef.current?.querySelector<HTMLElement>(`#${MENU_ID} a`);
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;
      const items = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      root.style.overflow = "";
    };
  }, [open, close]);

  // Note: backdrop-filter creates a containing block for fixed children, which
  // would collapse the fixed mobile panel. So the open state uses a solid
  // background and no blur.
  const surface = open
    ? "border-border bg-bg"
    : scrolled
      ? "border-border bg-bg/80 backdrop-blur-md"
      : "border-transparent bg-transparent";

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-(--duration-base) ease-standard",
        surface,
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-header">
        <Link to="/" aria-label="ServeProGen home" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  prefetch="intent"
                  className={({ isActive }) =>
                    cn(
                      "relative inline-flex h-11 items-center rounded-full px-4 text-small transition-colors duration-(--duration-fast)",
                      isActive ? "text-text" : "text-muted hover:text-text",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button to={primaryCta.to}>{primaryCta.label}</Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-text lg:hidden"
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </Container>

      <div
        id={MENU_ID}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-bg lg:hidden"
      >
        <Container className="flex min-h-full flex-col justify-between gap-12 py-10">
          <nav aria-label="Main">
            <ul className="flex flex-col">
              {mainNav.map((item, i) => (
                <li key={item.to} className="border-b border-border">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-baseline gap-4 py-5 font-display text-h3",
                        isActive ? "text-text" : "text-muted",
                      )
                    }
                  >
                    <span className="text-label text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Button to={primaryCta.to} size="lg" className="w-full">
            {primaryCta.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}
