/** First focusable element on every page: jumps keyboard users past the header. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-accent px-5 py-3 text-small font-medium text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70]"
    >
      Skip to content
    </a>
  );
}
