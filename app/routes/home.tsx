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

  // Sections 05 and 07 are conditional; number the visible ones without gaps.
  const showWork = work.length > 0;
  const workIndex = 5;
  const whyIndex = showWork ? 6 : 5;
  const insightsIndex = whyIndex + 1;

  return (
    <>
      <Hero hasWork={projects.some((p) => p.published)} />
      <CapabilityStrip />
      <Positioning />
      <ServicesBento />
      <AiSpotlight />
      <ProcessPreview />
      <SelectedWork projects={work} index={workIndex} />
      <WhyServeProGen index={whyIndex} />
      <InsightsPreview articles={insights} index={insightsIndex} />
      <CtaBand />
    </>
  );
}
