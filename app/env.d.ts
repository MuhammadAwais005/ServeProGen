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
