import { Link } from "react-router";
import { Logo } from "~/components/brand/Logo";
import { Container } from "~/components/ui/Container";
import { services } from "~/content/services";
import { legalNav, mainNav, primaryCta, site } from "~/content/site";

const socialLabels: Record<keyof typeof site.social, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
  youtube: "YouTube",
};

const linkClass =
  "text-small text-muted transition-colors duration-(--duration-fast) hover:text-text";

/** Global footer. Contact and social links render only once their values are confirmed. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = (Object.keys(site.social) as Array<keyof typeof site.social>).filter(
    (key) => site.social[key],
  );
  const { email, location } = site.contact;

  return (
    <footer id="site-footer" className="border-t border-border">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div className="flex max-w-sm flex-col gap-5">
          <Link to="/" aria-label="ServeProGen home" className="self-start rounded-md">
            <Logo />
          </Link>
          <p className="text-small text-muted">{site.tagline}</p>
        </div>

        <nav aria-labelledby="footer-services">
          <h2
            id="footer-services"
            className="text-label mb-5 font-sans font-normal text-muted"
          >
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
          <h2
            id="footer-company"
            className="text-label mb-5 font-sans font-normal text-muted"
          >
            Company
          </h2>
          <ul className="flex flex-col gap-3">
            {mainNav
              .filter((item) => item.to !== "/services")
              .map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-label mb-5 font-sans font-normal text-muted">Contact</h2>
          <ul className="flex flex-col gap-3">
            {email ? (
              <li>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </li>
            ) : (
              <li>
                <Link to={primaryCta.to} className={linkClass}>
                  Send us a project inquiry
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

      <Container className="flex flex-col gap-4 border-t border-border py-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
        <ul className="flex gap-6">
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
