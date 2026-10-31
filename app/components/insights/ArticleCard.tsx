import { Link } from "react-router";
import { ArrowRight } from "~/components/ui/Button";
import { formatDate, type Article } from "~/content";
import { cn } from "~/lib/cn";

/** Article card. Draft samples are marked; dates appear only when real. */
export function ArticleCard({
  article,
  headingLevel: Heading = "h3",
  className,
}: {
  article: Article;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const date = formatDate(article.date);
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-5 rounded-panel border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-(--duration-base) ease-standard sm:p-7",
        "focus-within:border-accent/60 hover:border-accent/50 hover:shadow-glow-sm",
        className,
      )}
    >
      {article.cover && (
        <img
          src={article.cover.src}
          alt={article.cover.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full rounded-card border border-border object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem] text-muted">
        <span className="text-label text-accent">{article.category}</span>
        <span aria-hidden="true">·</span>
        <span>{article.readingMinutes} min read</span>
        {date && (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={article.date}>{date}</time>
          </>
        )}
      </div>
      <Heading className="text-h3">
        <Link
          to={`/insights/${article.slug}`}
          prefetch="intent"
          viewTransition
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {article.title}
        </Link>
      </Heading>
      <p className="text-small text-muted">{article.description}</p>
      <p
        className="mt-auto flex items-center gap-2 pt-2 text-small font-medium text-accent-soft"
        aria-hidden="true"
      >
        Read article <ArrowRight />
      </p>
      {!article.published && (
        <p className="text-label absolute top-4 right-4 rounded-full bg-accent px-2.5 py-1.5 text-[0.625rem] text-on-accent">
          {article.sample ? "Sample draft" : "Draft"}
        </p>
      )}
    </article>
  );
}
