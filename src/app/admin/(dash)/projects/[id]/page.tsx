import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const created = (await searchParams).created === "1";
  const project = await getProjectById((await params).id);
  if (!project) notFound();
  return <ProjectForm key={project.id} initial={project} justCreated={created} />;
}
