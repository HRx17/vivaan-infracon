import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import { ReviewForm } from "@/components/site/ReviewForm";

export const metadata: Metadata = { title: "Write a review", description: "Share your experience with Vivaan Infracon." };

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams;
  const projects = await getPublishedProjects();
  return (
    <div className="pb-section pt-32 md:pt-40">
      <Container className="max-w-2xl">
        <Reveal className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span className="rule-accent" aria-hidden />
            <p className="eyebrow">Your experience</p>
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Write a review</h1>
          <p className="mt-4 text-lg text-muted">Bought a home or a shop, or worked with us? Tell others how it went.</p>
        </Reveal>
        <Reveal delay={80}>
          <ReviewForm projects={projects.map((p) => p.title)} project={project} />
        </Reveal>
      </Container>
    </div>
  );
}
