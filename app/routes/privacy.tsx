import { LegalPage } from "~/components/legal/LegalPage";
import Body from "~/content/legal/privacy.mdx";
import { breadcrumbLd, pageMeta } from "~/lib/seo";

export const meta = () =>
  pageMeta({
    title: "Privacy Policy",
    description:
      "How ServeProGen collects, uses and protects information sent through this website.",
    path: "/privacy",
    jsonLd: [
      breadcrumbLd([
        { label: "Home", to: "/" },
        { label: "Privacy Policy", to: "/privacy" },
      ]),
    ],
  });

export default function Privacy() {
  return <LegalPage title="Privacy Policy" path="/privacy" Body={Body} />;
}
