import { capabilities } from "~/content/site";

/**
 * Slow capability marquee. Screen readers get one plain list; the duplicated
 * copy that makes the loop seamless is hidden. Pauses on hover and focus;
 * static under reduced motion.
 */
export function CapabilityStrip() {
  const items = [...capabilities];
  return (
    <section aria-label="Capabilities" className="border-y border-border bg-surface/40">
      <div className="marquee relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center"
            >
              {items.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="px-8 font-display text-xl font-semibold whitespace-nowrap text-text/85 sm:text-2xl">
                    {item}
                  </span>
                  <span aria-hidden="true" className="size-1.5 rotate-45 bg-accent" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
