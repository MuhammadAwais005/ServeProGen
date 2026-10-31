/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical origin, e.g. https://serveprogen.com. Empty until the domain exists. */
  readonly VITE_SITE_URL?: string;
  /** "false" only for production; anything else adds noindex to every page. */
  readonly VITE_NOINDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** True in `npm run dev` and preview builds: drafts are shown with a banner. */
declare const __CONTENT_PREVIEW__: boolean;

type ContentTocItem = { depth: 2 | 3; text: string; id: string };

declare module "virtual:content/projects" {
  import type { ProjectFrontmatter } from "~/content/schema";
  const projects: Array<
    ProjectFrontmatter & { slug: string; readingMinutes: number; toc: ContentTocItem[] }
  >;
  export default projects;
}

declare module "virtual:content/project-bodies" {
  import type { MDXContent } from "mdx/types";
  const bodies: Record<string, MDXContent>;
  export default bodies;
}

declare module "virtual:content/insights" {
  import type { ArticleFrontmatter } from "~/content/schema";
  const articles: Array<
    ArticleFrontmatter & { slug: string; readingMinutes: number; toc: ContentTocItem[] }
  >;
  export default articles;
}

declare module "virtual:content/insight-bodies" {
  import type { MDXContent } from "mdx/types";
  const bodies: Record<string, MDXContent>;
  export default bodies;
}
