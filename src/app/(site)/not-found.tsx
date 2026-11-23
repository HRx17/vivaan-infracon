import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <span className="rule-accent mb-6" aria-hidden />
      <h1 className="text-4xl font-extrabold sm:text-5xl">This page isn&rsquo;t here.</h1>
      <p className="mt-4 text-lg text-muted">It may have been moved or archived.</p>
      <ButtonLink href="/projects" className="mt-8">See all projects</ButtonLink>
    </Container>
  );
}
