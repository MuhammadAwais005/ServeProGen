import type { ReactNode } from "react";
import { Logo, LogoMark } from "~/components/brand/Logo";
import { StatusBadge, TechTag } from "~/components/ui/Badge";
import { ArrowRight, Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Container } from "~/components/ui/Container";
import { SelectField, TextAreaField, TextField } from "~/components/ui/Field";
import { SectionHeader } from "~/components/ui/SectionHeader";
import { projects as visibleProjects } from "~/content";
import { processStages } from "~/content/process";
import { projectStatuses } from "~/content/status";
import { services } from "~/content/services";
import { pageMeta } from "~/lib/seo";

export const meta = () =>
  pageMeta({
    title: "Brand system",
    description: "Internal reference for the ServeProGen brand and component system.",
    path: "/brand",
    noindex: true,
  });

const colors = [
  { token: "bg", hex: "#08090D", use: "Page background", ratio: "n/a" },
  { token: "surface", hex: "#11131A", use: "Cards, header, inputs", ratio: "n/a" },
  { token: "surface-raised", hex: "#171A23", use: "Hover surfaces", ratio: "n/a" },
  { token: "text", hex: "#F5F5F5", use: "Headlines, body", ratio: "18.25:1" },
  { token: "muted", hex: "#A1A1AA", use: "Secondary text", ratio: "7.77:1" },
  {
    token: "accent",
    hex: "#FF702E",
    use: "Signal: CTAs, active states",
    ratio: "7.21:1",
  },
  { token: "accent-soft", hex: "#FF9A55", use: "Hover, focus ring", ratio: "9.48:1" },
  { token: "border", hex: "#292B34", use: "Decorative dividers", ratio: "1.41:1" },
  { token: "border-strong", hex: "#71717A", use: "Form controls", ratio: "4.12:1" },
  { token: "danger", hex: "#F87171", use: "Form errors", ratio: "7.19:1" },
  { token: "success", hex: "#4ADE80", use: "Success, live status", ratio: "11.42:1" },
];

const typeScale = [
  { name: "Display", className: "text-display", size: "48 → 120px" },
  { name: "H1", className: "text-h1", size: "40 → 72px" },
  { name: "H2", className: "text-h2", size: "32 → 52px" },
  { name: "H3", className: "text-h3", size: "22 → 28px" },
];

function Block({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-border py-16 lg:py-24">
      <Container className="flex flex-col gap-12">{children}</Container>
    </section>
  );
}

export default function BrandPage() {
  const projects = visibleProjects;
  return (
    <>
      <section className="relative isolate overflow-hidden pt-header">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-10" />
        <Container className="py-20 lg:py-28">
          <SectionHeader
            as="h1"
            label="Internal · not indexed"
            title="ServeProGen brand system"
            intro="The tokens and components every page is built from. Phase 1 reference for review."
          />
        </Container>
      </section>

      <Block id="logo">
        <SectionHeader id="logo" index="01" label="Logo" title="Generator Node" />
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex aspect-[4/3] items-center justify-center">
            <LogoMark size={160} />
          </Card>
          <Card className="flex aspect-[4/3] flex-col items-center justify-center gap-8">
            <Logo markSize={36} className="[&>span:last-child]:text-[1.75rem]" />
            <div className="flex items-end gap-6">
              <LogoMark size={48} title={null} />
              <LogoMark size={24} variant="small" title={null} />
              <LogoMark size={16} variant="small" title={null} />
            </div>
          </Card>
          <Card className="flex aspect-[4/3] items-center justify-center gap-10 !bg-text">
            <img
              src="/brand/generator-node-mark-on-light.svg"
              alt=""
              width={72}
              height={72}
            />
            <img
              src="/brand/generator-node-mono-black.svg"
              alt=""
              width={72}
              height={72}
            />
          </Card>
        </div>
      </Block>

      <Block id="color">
        <SectionHeader
          id="color"
          index="02"
          label="Color"
          title="Orange is a signal, not a paint"
          intro="Contrast ratios are measured against the page background (#08090D)."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <li
              key={c.token}
              className="flex items-center gap-4 rounded-card border border-border p-4"
            >
              <span
                aria-hidden="true"
                className="size-14 shrink-0 rounded-field border border-border"
                style={{ backgroundColor: c.hex }}
              />
              <div className="flex min-w-0 flex-col">
                <span className="font-mono text-small">{c.token}</span>
                <span className="text-small text-muted">
                  {c.hex} · {c.use}
                </span>
                <span className="text-small text-muted">Contrast {c.ratio}</span>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="type">
        <SectionHeader
          id="type"
          index="03"
          label="Typography"
          title="Clash Display, Geist, Geist Mono"
          intro="Display sizes are fluid: they scale smoothly from phone to large desktop."
        />
        <div className="flex flex-col gap-8">
          {typeScale.map((t) => (
            <div
              key={t.name}
              className="grid gap-2 border-b border-border pb-8 lg:grid-cols-[12rem_1fr]"
            >
              <p className="text-label text-muted">
                {t.name} · {t.size}
              </p>
              <p className={`${t.className} font-display font-semibold`}>
                Engineering Intelligence.
              </p>
            </div>
          ))}
          <div className="grid gap-2 lg:grid-cols-[12rem_1fr]">
            <p className="text-label text-muted">Lead · Body · Label</p>
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="text-lead text-muted">
                Lead text introduces a section in one or two calm sentences.
              </p>
              <p>
                Body text is set at 17px with a 1.65 line height for comfortable reading
                on dark backgrounds.
              </p>
              <p className="text-label text-muted">
                <span className="text-accent">04</span> / Mono label
              </p>
            </div>
          </div>
        </div>
      </Block>

      <Block id="components">
        <SectionHeader
          id="components"
          index="04"
          label="Components"
          title="Core components"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button className="group">
            Start a project <ArrowRight />
          </Button>
          <Button variant="secondary">View our work</Button>
          <Button variant="ghost">Read more</Button>
          <Button size="lg">Large primary</Button>
          <Button disabled>Disabled</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {projectStatuses.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
          <TechTag>React</TechTag>
          <TechTag>Django</TechTag>
          <TechTag>YOLOX-S</TechTag>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.slice(0, 3).map((s) => (
            <Card key={s.slug} interactive>
              <h3 className="text-h3">
                <a
                  href={`#${s.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {s.title}
                </a>
              </h3>
              <p className="mt-3 text-small text-muted">{s.summary}</p>
            </Card>
          ))}
        </div>

        <form
          className="grid max-w-2xl gap-6"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <TextField label="Full name" name="name" autoComplete="name" required />
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            error="Enter an email address like name@company.com."
            defaultValue="name@"
          />
          <SelectField label="Service" name="service" defaultValue="">
            <option value="" disabled>
              Choose a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </SelectField>
          <TextAreaField
            label="Project details"
            name="message"
            hint="What are you building, and what does success look like?"
          />
        </form>
      </Block>

      <Block id="process">
        <SectionHeader
          id="process"
          index="05"
          label="Process"
          title="Six stages, one vocabulary"
          intro="Imported from content/process.ts everywhere so the wording never drifts."
        />
        <ol className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {processStages.map((stage) => (
            <li key={stage.slug} className="flex flex-col gap-3 bg-bg p-6">
              <span className="text-label text-accent">{stage.number}</span>
              <span className="text-h3 font-display font-semibold">{stage.name}</span>
              <span className="text-small text-muted">{stage.summary}</span>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="content">
        <SectionHeader
          id="content"
          index="06"
          label="Content status"
          title="Projects awaiting confirmation"
          intro="Unpublished projects never appear on public pages or in the sitemap."
        />
        <ul className="flex flex-col divide-y divide-border rounded-card border border-border">
          {projects.map((p) => (
            <li
              key={p.slug}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="flex flex-col">
                <span className="font-medium">{p.title}</span>
                <span className="text-small text-muted">{p.category}</span>
                {p.unconfirmed.length > 0 && (
                  <span className="text-small text-danger">
                    Unconfirmed: {p.unconfirmed.join(", ")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={p.status} />
                <span className="text-label text-muted">
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Block>
    </>
  );
}
