import type { MDXContent } from "mdx/types";
import type { ReactNode } from "react";
import { Container } from "~/components/ui/Container";
import { Breadcrumbs } from "~/components/ui/PageBlocks";
import { site } from "~/content/site";

/** Highlights a detail that must be confirmed before production. */
function Confirm({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-soft">
      [To confirm: {children}]
    </mark>
  );
}

/** Banner reminding that legal text needs human and legal review. */
function Review() {
  return (
    <div
      role="note"
      className="not-prose rounded-card border border-dashed border-accent/60 bg-accent/5 p-4 text-small text-text"
    >
      <span className="text-label mr-2 text-accent">Review required</span>
      This text is a starting draft written for an emerging software studio. It must be
      reviewed, and the highlighted details confirmed, before the website is published.
    </div>
  );
}

export function LegalPage({
  title,
  path,
  Body,
}: {
  title: string;
  path: string;
  Body: MDXContent;
}) {
  const crumbs = [
    { label: "Home", to: "/" },
    { label: title, to: path },
  ];
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border pt-header">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-10" />
        <Container className="flex max-w-4xl flex-col gap-6 pt-14 pb-12 lg:pt-20">
          <Breadcrumbs crumbs={crumbs} />
          <p className="text-label text-accent">Legal</p>
          <h1 className="text-h1">{title}</h1>
          <p className="text-muted">
            {site.legal.entityName ?? site.name} · Last reviewed:{" "}
            <span className="text-accent-soft">[to confirm before publication]</span>
          </p>
        </Container>
      </section>
      <Container className="max-w-4xl py-14 lg:py-20">
        <article className="prose-forge max-w-3xl">
          <Body components={{ Confirm, Review }} />
        </article>
      </Container>
    </>
  );
}
