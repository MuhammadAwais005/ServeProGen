import { Link } from "react-router";
import { Logo } from "~/components/brand/Logo";
import { ArrowRight } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { services } from "~/content/services";
import { companyNav, legalNav, primaryCta, site } from "~/content/site";

const socialLabels: Record<keyof typeof site.social, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
  youtube: "YouTube",
};

const linkClass =
  "text-small text-muted transition-colors duration-(--duration-fast) hover:text-text";

const headingClass = "text-label mb-5 font-sans font-normal text-muted";

/** Global footer. Contact and social links appear only once their values are set in site.ts. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = (Object.keys(site.social) as Array<keyof typeof site.social>).filter(
    (key) => site.social[key],
  );
  const { email, phone, location } = site.contact;

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden="true"
        className="glow-accent pointer-events-none absolute -bottom-72 left-1/2 size-[44rem] -translate-x-1/2 opacity-40"
      />
      <Container className="relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-20">
        <div className="flex max-w-sm flex-col gap-5">
          <Link to="/" aria-label="ServeProGen home" className="self-start rounded-md">
            <Logo />
          </Link>
          <p className="font-display text-lg font-semibold text-text">{site.tagline}</p>
          <p className="text-small text-muted">{site.intro}</p>
          <Link
            to={primaryCta.to}
            className="group inline-flex items-center gap-2 self-start text-small font-medium text-accent-soft hover:text-text"
          >
            {primaryCta.label}
            <ArrowRight />
          </Link>
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className={headingClass}>
            Services
          </h2>
          <ul className="flex flex-col gap-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className={linkClass}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className={headingClass}>
            Company
          </h2>
          <ul className="flex flex-col gap-3">
            {companyNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Contact</h2>
          <ul className="flex flex-col gap-3">
            {email && (
              <li>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className={linkClass}>
                  {phone}
                </a>
              </li>
            )}
            {!email && (
              <li>
                <Link to="/contact" className={linkClass}>
                  Send a project inquiry
                </Link>
              </li>
            )}
            {location && <li className="text-small text-muted">{location}</li>}
            {socials.map((key) => (
              <li key={key}>
                <a
                  href={site.social[key] ?? undefined}
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialLabels[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="relative flex flex-col gap-4 border-t border-border py-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.legal.entityName ?? site.name}. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {legalNav.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
