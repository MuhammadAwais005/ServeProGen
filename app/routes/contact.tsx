import { Mail, MapPin, Phone } from "lucide-react";
import { useSearchParams } from "react-router";
import { ContactForm } from "~/components/contact/ContactForm";
import { Container } from "~/components/ui/Container";
import { Breadcrumbs, Faq, reveal, Section } from "~/components/ui/PageBlocks";
import { isPreview } from "~/content";
import { processStages } from "~/content/process";
import { getService } from "~/content/services";
import { site } from "~/content/site";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

const crumbs = [
  { label: "Home", to: "/" },
  { label: "Contact", to: "/contact" },
];

export const meta = () =>
  pageMeta({
    title: "Contact",
    description:
      "Start a project with ServeProGen. Tell us about your software, AI or automation challenge and we'll reply with a practical next step.",
    path: "/contact",
    jsonLd: [breadcrumbLd(crumbs)],
  });

const faqs = [
  {
    q: "What should I include in my message?",
    a: "The problem you're trying to solve, who it's for, any existing systems involved and, if you have them, rough timing and budget. A few sentences is enough to start.",
  },
  {
    q: "Do I need a detailed specification first?",
    a: "No. Turning an idea into a clear specification is part of Discover and Strategize. Bring the problem; we'll help shape the solution.",
  },
  {
    q: "Is my information kept private?",
    a: "Yes. Your details are used only to respond to your inquiry. See the privacy policy for how contact form data is handled.",
  },
];

const nextSteps = [
  {
    title: "We read your inquiry",
    text: "Every message is read personally, not by an autoresponder.",
  },
  {
    title: "We reply with questions",
    text: "Usually a few clarifying questions about goals and constraints.",
  },
  {
    title: "We suggest a next step",
    text: `Often a short ${processStages[0]!.name} conversation to scope the work.`,
  },
];

export default function Contact() {
  const [params] = useSearchParams();
  const service = getService(params.get("service") ?? "")?.title;
  const { email, phone, location, bookingUrl } = site.contact;
  const hasDetails = Boolean(email || phone || location);

  return (
    <>
      <section className="relative isolate overflow-hidden pt-header">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-20" />
        <div
          aria-hidden="true"
          className="glow-accent absolute -top-40 -left-40 -z-10 size-[40rem] opacity-50"
        />
        <Container className="grid gap-14 pt-14 pb-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:pt-20 lg:pb-28">
          <div className="flex flex-col gap-6">
            <Breadcrumbs crumbs={crumbs} />
            <p className="text-label hero-fade flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              Contact
            </p>
            <h1 className="text-h1">
              <span className="hero-line">
                <span>Let's engineer what's next.</span>
              </span>
            </h1>
            <p className="text-lead hero-fade text-muted">
              Whether you're launching a startup, modernising your business or exploring
              AI-powered innovation, tell us what you're working on. We'll reply with
              honest questions and a practical next step.
            </p>

            <ol className="mt-4 flex flex-col gap-px overflow-hidden rounded-card border border-border bg-border">
              {nextSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4 bg-bg p-5">
                  <span className="text-label pt-1 text-accent">0{i + 1}</span>
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-text">{s.title}</span>
                    <span className="text-small text-muted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            {hasDetails && (
              <ul className="flex flex-col gap-3 pt-2">
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-3 text-text hover:text-accent-soft"
                    >
                      <Mail aria-hidden="true" className="size-4 text-accent" /> {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-3 text-text hover:text-accent-soft"
                    >
                      <Phone aria-hidden="true" className="size-4 text-accent" /> {phone}
                    </a>
                  </li>
                )}
                {location && (
                  <li className="inline-flex items-center gap-3 text-muted">
                    <MapPin aria-hidden="true" className="size-4 text-accent" />{" "}
                    {location}
                  </li>
                )}
              </ul>
            )}
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small font-medium text-accent-soft hover:text-text"
              >
                Prefer a call? Book a time →
              </a>
            )}
            {isPreview && !hasDetails && (
              <p
                role="note"
                className="rounded-card border border-dashed border-accent/60 p-4 text-small text-muted"
              >
                <span className="text-label mr-2 text-accent">Preview only</span>
                Email, phone and location appear here once they are set in
                app/content/site.ts.
              </p>
            )}
          </div>

          <div
            className="rounded-panel border border-border bg-surface p-6 sm:p-8 lg:p-10"
            {...reveal()}
          >
            <h2 className="text-h3 mb-2">Tell us about your project</h2>
            <p className="mb-8 text-small text-muted">It takes about two minutes.</p>
            <ContactForm defaultService={service} />
          </div>
        </Container>
      </section>

      <Section labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
          <h2 id="faq-title" className="text-h2" {...reveal()}>
            Before you write
          </h2>
          <div {...reveal(1)}>
            <Faq items={faqs} />
          </div>
        </div>
      </Section>
    </>
  );
}
