import { getAllProjects, getTestimonials } from "@/lib/data";
import { ReviewsManager } from "@/components/admin/ReviewsManager";

export default async function ReviewsPage() {
  const [items, projects] = await Promise.all([getTestimonials(), getAllProjects()]);
  return <ReviewsManager items={items} projects={projects.map((p) => p.title)} />;
}
