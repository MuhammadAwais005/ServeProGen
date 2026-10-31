import { Search } from "lucide-react";
import { useState } from "react";
import { ArticleCard } from "~/components/insights/ArticleCard";
import { ArrowRight, Button } from "~/components/ui/Button";
import { CtaBand, PageHero, reveal, Section } from "~/components/ui/PageBlocks";
import { articles, isPreview } from "~/content";
import { articleCategories } from "~/content/status";
import { cn } from "~/lib/cn";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

const crumbs = [
  { label: "Home", to: "/" },
  { label: "Insights", to: "/insights" },
];

export const meta = () =>
  pageMeta({
    title: "Insights",
    description:
      "Technical insights from ServeProGen on artificial intelligence, machine learning, computer vision, SaaS development, automation and software engineering.",
    path: "/insights",
    jsonLd: [breadcrumbLd(crumbs)],
  });

export default function Insights() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const categories = articleCategories.filter((c) =>
    articles.some((a) => a.category === c),
  );

  const q = query.trim().toLowerCase();
  const shown = articles.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      (!q ||
        [a.title, a.description, a.category, ...a.tags].some((t) =>
          t.toLowerCase().includes(q),
        )),
  );

  const featured = shown.find((a) => a.featured);
  const rest = featured ? shown.filter((a) => a !== featured) : shown;

  return (
    <>
      <PageHero
        crumbs={crumbs}
        label="Insights"
        title="Explore ideas. Discover innovation."
        intro="Practical writing on AI, computer vision, SaaS architecture, automation and the craft of building software that lasts."
      />

      <Section labelledBy="articles-title" bordered={false} className="pt-0!">
        <h2 id="articles-title" className="sr-only">
          Articles
        </h2>

        {articles.length === 0 ? (
          <div
            className="flex flex-col items-start gap-5 rounded-panel border border-border bg-surface p-8 lg:p-12"
            {...reveal()}
          >
            <p className="text-label text-accent">Coming soon</p>
            <h3 className="text-h2 max-w-2xl">Our first articles are being written.</h3>
            <p className="max-w-2xl text-muted">
              We'll publish practical, technical writing here, based on real engineering
              work rather than filler. Until then, you can explore our services or get in
              touch.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button to="/services">
                Explore services <ArrowRight />
              </Button>
              <Button to="/contact" variant="secondary">
                Contact us
              </Button>
            </div>
          </div>
        ) : (
          <>
            {isPreview && articles.some((a) => !a.published) && (
              <p
                className="mb-6 rounded-card border border-dashed border-accent/60 bg-accent/5 p-4 text-small"
                role="note"
              >
                <span className="text-label mr-2 text-accent">Draft preview</span>
                Sample and draft articles are visible only in local and preview builds.
              </p>
            )}
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                role="group"
                aria-label="Filter by category"
                className="flex flex-wrap gap-2"
              >
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "h-11 rounded-full border px-5 text-small transition-colors duration-(--duration-fast)",
                      category === c
                        ? "border-accent bg-accent text-on-accent"
                        : "border-border-strong text-muted hover:border-text hover:text-text",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <label className="relative block w-full lg:w-80">
                <span className="sr-only">Search articles</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  className="h-11 w-full rounded-full border border-border-strong bg-surface pr-4 pl-11 text-small text-text placeholder:text-muted/70 focus:border-accent-soft focus:outline-none"
                />
              </label>
            </div>
            <p className="sr-only" aria-live="polite">
              {shown.length} {shown.length === 1 ? "article" : "articles"} found
            </p>

            {shown.length === 0 ? (
              <p className="rounded-card border border-border p-8 text-muted">
                No articles match your search. Try another term or category.
              </p>
            ) : (
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {featured && (
                  <li className="md:col-span-2 lg:col-span-3">
                    <ArticleCard
                      article={featured}
                      headingLevel="h3"
                      className="lg:p-10"
                    />
                  </li>
                )}
                {rest.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={a} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
