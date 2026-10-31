import { AiSpotlight } from "~/components/home/AiSpotlight";
import { CapabilityStrip } from "~/components/home/CapabilityStrip";
import { Hero } from "~/components/home/Hero";
import {
  InsightsPreview,
  SelectedWork,
  WhyServeProGen,
} from "~/components/home/HomeSections";
import { Positioning } from "~/components/home/Positioning";
import { ProcessPreview } from "~/components/home/ProcessPreview";
import { ServicesBento } from "~/components/home/ServicesBento";
import { CtaBand } from "~/components/ui/PageBlocks";
import { featuredProjects, homepageArticles, projects } from "~/content";
import { pageMeta } from "~/lib/seo";

export const meta = () =>
  pageMeta({
    path: "/",
    description:
      "ServeProGen is an AI and software engineering studio building intelligent software, AI and computer vision solutions, SaaS products and automation for businesses and startups.",
  });

export default function Home() {
  // Production: published projects only. Preview builds also show drafts (flagged).
  const work = featuredProjects.length ? featuredProjects : projects.slice(0, 3);
  // Hidden until three published (non-sample) articles exist, even in preview.
  const insights = homepageArticles();

  return (
    <>
      <Hero hasWork={projects.some((p) => p.published)} />
      <CapabilityStrip />
      <Positioning />
      <ServicesBento />
      <AiSpotlight />
      <ProcessPreview />
      <SelectedWork projects={work} />
      <WhyServeProGen />
      <InsightsPreview articles={insights} />
      <CtaBand />
    </>
  );
}
