import { LegalPage } from "~/components/legal/LegalPage";
import Body from "~/content/legal/terms.mdx";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

export const meta = () =>
  pageMeta({
    title: "Terms of Service",
    description: "The terms that govern use of the ServeProGen website.",
    path: "/terms",
    jsonLd: [
      breadcrumbLd([
        { label: "Home", to: "/" },
        { label: "Terms of Service", to: "/terms" },
      ]),
    ],
  });

export default function Terms() {
  return <LegalPage title="Terms of Service" path="/terms" Body={Body} />;
}
