import { Link2 } from "lucide-react";
import bodies from "virtual:content/insight-bodies";
import { useState } from "react";
import { Link } from "react-router";
import { ArticleCard } from "~/components/insights/ArticleCard";
import { Container } from "~/components/ui/Container";
import { Breadcrumbs, CtaBand, DraftNotice } from "~/components/ui/PageBlocks";
import { formatDate, getArticle, relatedArticles } from "~/content";
import { absoluteUrl, articleLd, breadcrumbLd, pageMeta } from "~/lib/seo";
import { NotFound } from "./not-found";
import type { Route } from "./+types/insights.$slug";

/* No loader: see work.$slug.tsx. Unknown slugs get the 404 page. */
export const meta = ({ params }: Route.MetaArgs) => {
  const article = getArticle(params.slug);
  if (!article)
    return [
      { title: "Page not found | ServeProGen" },
      { name: "robots", content: "noindex" },
    ];
  return pageMeta({
    title: article.title,
    description: article.description,
    path: `/insights/${article.slug}`,
    type: "article",
    noindex: !article.published,
    image: article.cover?.src,
    imageAlt: article.cover?.alt,
    publishedTime: article.date,
    modifiedTime: article.updated,
    jsonLd: [
      articleLd(article),
      breadcrumbLd([
        { label: "Home", to: "/" },
        { label: "Insights", to: "/insights" },
        { label: article.title, to: `/insights/${article.slug}` },
      ]),
    ],
  });
};

export default function ArticlePage({ params }: Route.ComponentProps) {
  const article = getArticle(params.slug);
  if (!article) return <NotFound />;
  const Body = bodies[article.slug];
  const related = relatedArticles(article);
  const date = formatDate(article.date);
  const updated = formatDate(article.updated);
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Insights", to: "/insights" },
    { label: article.title, to: `/insights/${article.slug}` },
  ];
  const showToc = article.toc.length >= 3;

  return (
    <>
      <section className="relative isolate overflow-hidden pt-header">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-20" />
        <div
          aria-hidden="true"
          className="glow-accent absolute -top-40 -right-40 -z-10 size-[40rem] opacity-50"
        />
        <Container className="flex max-w-4xl flex-col gap-6 pt-14 pb-12 lg:pt-20">
          <Breadcrumbs crumbs={crumbs} />
          {!article.published && (
            <DraftNotice
              reasons={
                article.sample
                  ? ["this is a layout-testing sample and cannot be published"]
                  : article.date
                    ? []
                    : ["publication date"]
              }
            />
          )}
          <p className="text-label text-accent">{article.category}</p>
          <h1 className="text-h1">{article.title}</h1>
          <p className="text-lead text-muted">{article.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-6 text-small text-muted">
            <span className="text-text">{article.author}</span>
            {date && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={article.date}>{date}</time>
              </>
            )}
            {updated && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={article.updated}>{updated}</time>
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min read</span>
          </div>
        </Container>
      </section>

      {article.cover && (
        <Container className="max-w-5xl">
          <img
            src={article.cover.src}
            alt={article.cover.alt}
            className="aspect-[16/8] w-full rounded-panel border border-border object-cover"
          />
        </Container>
      )}

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_15rem] lg:gap-16 lg:py-20">
        <article className="prose-forge mx-auto w-full max-w-[42rem] lg:mx-0 lg:justify-self-end">
          {Body ? <Body /> : null}
        </article>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          {showToc && (
            <nav aria-labelledby="toc-title">
              <h2 id="toc-title" className="text-label mb-4 text-muted">
                On this page
              </h2>
              <ol className="flex flex-col gap-2 border-l border-border">
                {article.toc.map((item) => (
                  <li key={item.id} className={item.depth === 3 ? "pl-7" : "pl-4"}>
                    <a
                      href={`#${item.id}`}
                      className="block text-small text-muted transition-colors hover:text-text"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <ShareLinks title={article.title} slug={article.slug} />
        </aside>
      </Container>

      {related.length > 0 && (
        <section
          aria-labelledby="related-title"
          className="section-y border-t border-border"
        >
          <Container>
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-h2">
                Related articles
              </h2>
              <Link
                to="/insights"
                className="text-small font-medium text-accent-soft hover:text-text"
              >
                All insights
              </Link>
            </div>
            <ul className="grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}

/** Share links that need no third-party scripts. */
function ShareLinks({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/insights/${slug}`);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url ?? window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  const encoded = url ? encodeURIComponent(url) : undefined;
  const linkClass =
    "inline-flex h-11 items-center rounded-full border border-border-strong px-4 text-small text-muted transition-colors hover:border-text hover:text-text";

  return (
    <div>
      <h2 className="text-label mb-4 text-muted">Share</h2>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={linkClass}>
          <Link2 aria-hidden="true" className="mr-2 size-4" />
          {copied ? "Link copied" : "Copy link"}
        </button>
        {encoded && (
          <>
            <a
              className={linkClass}
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className={linkClass}
              href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
