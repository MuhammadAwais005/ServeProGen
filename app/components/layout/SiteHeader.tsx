import { ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Logo } from "~/components/brand/Logo";
import { ServiceIcon } from "~/components/brand/ServiceIcon";
import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { services } from "~/content/services";
import { mainNav, primaryCta } from "~/content/site";
import { useScrolled } from "~/hooks/useScrolled";
import { cn } from "~/lib/cn";
import { ease } from "~/lib/motion";

const MENU_ID = "mobile-menu";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const desktopLink =
  "relative inline-flex h-11 items-center gap-1 rounded-full px-3.5 text-small transition-colors duration-(--duration-fast)";

/**
 * Global header.
 * - Transparent over the hero; blurred dark bar after 24px of scroll.
 * - Desktop (≥1024px): nav with a Services menu + primary CTA.
 * - Mobile: full-screen menu. While open, the page behind is inert, scroll is
 *   locked, Tab cycles inside the header, Esc closes and focus returns.
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

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => media.matches && setOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    const root = document.documentElement;
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    root.style.overflow = "hidden";

    const first = headerRef.current?.querySelector<HTMLElement>(`#${MENU_ID} a`);
    first?.focus();

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
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!firstItem || !lastItem) return;
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
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

  // backdrop-filter creates a containing block for fixed children, which would
  // collapse the fixed mobile panel, so the open state is solid with no blur.
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
        <Link to="/" aria-label="ServeProGen home" className="rounded-md" viewTransition>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) =>
              item.to === "/services" ? (
                <li key={item.to}>
                  <ServicesMenu />
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    prefetch="intent"
                    viewTransition
                    className={({ isActive }) =>
                      cn(
                        desktopLink,
                        isActive ? "text-text" : "text-muted hover:text-text",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <ActiveDot />}
                      </>
                    )}
                  </NavLink>
                </li>
              ),
            )}
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
            <path
              d={open ? "M6 6l12 12" : "M4 8h16"}
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-[d] duration-(--duration-base)"
            />
            <path
              d={open ? "M18 6 6 18" : "M4 16h16"}
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-[d] duration-(--duration-base)"
            />
          </svg>
        </button>
      </Container>

      <MobileMenu open={open} pathname={pathname} />
    </header>
  );
}

function ActiveDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
    />
  );
}

/** Desktop Services disclosure menu: click or hover, Esc to close. */
function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();
  // Pre-rendering requests pages with a trailing slash; normalise so the
  // server HTML and the browser agree (otherwise hydration fails).
  const path = pathname.replace(/\/+$/, "") || "/";
  const active = path.startsWith("/services") || path === "/process";

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hoverOpen = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hoverClose()}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          desktopLink,
          active || open ? "text-text" : "text-muted hover:text-text",
        )}
      >
        Services
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-(--duration-base)",
            open && "rotate-180",
          )}
        />
        {active && <ActiveDot />}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id={panelId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: ease.outExpo }}
            className="absolute top-full left-1/2 w-[44rem] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-panel border border-border bg-surface shadow-[0_24px_80px_-24px_rgb(0_0_0/0.8)]">
              <ul className="grid grid-cols-2 gap-1 p-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      prefetch="intent"
                      viewTransition
                      className="group flex gap-4 rounded-card p-4 transition-colors duration-(--duration-fast) hover:bg-surface-raised"
                    >
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-field border border-border bg-bg">
                        <ServiceIcon kind={s.icon} size={22} />
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-small font-medium text-text">
                          {s.title}
                        </span>
                        <span className="text-[0.8125rem] leading-snug text-muted">
                          {s.summary}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/process"
                    prefetch="intent"
                    viewTransition
                    className="flex h-full flex-col justify-center gap-1 rounded-card border border-dashed border-border p-4 transition-colors duration-(--duration-fast) hover:border-accent/50"
                  >
                    <span className="text-label text-accent">How we work</span>
                    <span className="text-small font-medium text-text">Our Process</span>
                  </Link>
                </li>
              </ul>
              <Link
                to="/services"
                prefetch="intent"
                viewTransition
                className="group flex items-center justify-between border-t border-border px-7 py-4 text-small text-muted transition-colors hover:text-text"
              >
                Explore all services
                <ArrowRight />
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ open, pathname }: { open: boolean; pathname: string }) {
  const [servicesOpen, setServicesOpen] = useState(pathname.startsWith("/services"));
  const subId = useId();

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id={MENU_ID}
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-bg lg:hidden"
        >
          <div
            aria-hidden="true"
            className="bg-blueprint pointer-events-none absolute inset-0"
          />
          <Container className="relative flex min-h-full flex-col justify-between gap-10 py-8">
            <nav aria-label="Main">
              <ul className="flex flex-col">
                {mainNav.map((item, i) => (
                  <m.li
                    key={item.to}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.04 + i * 0.045,
                      duration: 0.5,
                      ease: ease.outExpo,
                    }}
                    className="border-b border-border"
                  >
                    {item.to === "/services" ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={servicesOpen}
                          aria-controls={subId}
                          onClick={() => setServicesOpen((v) => !v)}
                          className="flex w-full items-baseline gap-4 py-4 text-left font-display text-h3 text-muted"
                        >
                          <span className="text-label text-accent">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          <ChevronDown
                            aria-hidden="true"
                            className={cn(
                              "size-5 self-center transition-transform duration-(--duration-base)",
                              servicesOpen && "rotate-180",
                            )}
                          />
                        </button>
                        <ul
                          id={subId}
                          hidden={!servicesOpen}
                          className="flex flex-col pb-4 pl-9"
                        >
                          <li>
                            <MobileSubLink to="/services">All services</MobileSubLink>
                          </li>
                          {services.map((s) => (
                            <li key={s.slug}>
                              <MobileSubLink to={`/services/${s.slug}`}>
                                {s.title}
                              </MobileSubLink>
                            </li>
                          ))}
                          <li>
                            <MobileSubLink to="/process">Our Process</MobileSubLink>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          cn(
                            "flex items-baseline gap-4 py-4 font-display text-h3",
                            isActive ? "text-text" : "text-muted",
                          )
                        }
                      >
                        <span className="text-label text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </NavLink>
                    )}
                  </m.li>
                ))}
              </ul>
            </nav>
            <m.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5, ease: ease.outExpo }}
            >
              <Button to={primaryCta.to} size="lg" className="w-full">
                {primaryCta.label}
                <ArrowRight />
              </Button>
            </m.div>
          </Container>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function MobileSubLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex min-h-11 items-center text-small transition-colors",
          isActive ? "text-text" : "text-muted hover:text-text",
        )
      }
    >
      {children}
    </NavLink>
  );
}
