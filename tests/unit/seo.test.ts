import { describe, expect, it } from "vitest";
import { organizationLd, pageMeta } from "../../app/lib/seo";

describe("page metadata", () => {
  it("builds a branded title and social tags", () => {
    const tags = pageMeta({ title: "Services", path: "/services" });
    expect(tags).toContainEqual({ title: "Services | ServeProGen" });
    expect(tags).toContainEqual({
      property: "og:title",
      content: "Services | ServeProGen",
    });
    expect(tags).toContainEqual({ name: "twitter:card", content: "summary_large_image" });
  });

  it("is noindex unless indexing is explicitly enabled", () => {
    const tags = pageMeta({ path: "/" });
    expect(tags).toContainEqual({ name: "robots", content: "noindex, nofollow" });
  });

  it("adds Organization and WebSite structured data on the homepage only", () => {
    const home = pageMeta({ path: "/" }).filter((t) => "script:ld+json" in t);
    const about = pageMeta({ path: "/about" }).filter((t) => "script:ld+json" in t);
    expect(home).toHaveLength(2);
    expect(about).toHaveLength(0);
  });

  it("never invents contact details in structured data", () => {
    const org = organizationLd();
    expect(org).not.toHaveProperty("email");
    expect(org).not.toHaveProperty("address");
    expect(org).not.toHaveProperty("telephone");
  });
});
