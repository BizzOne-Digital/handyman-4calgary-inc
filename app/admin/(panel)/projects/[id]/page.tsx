import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { connectDb } from "@/lib/db/connect";
import type { ProjectInput } from "@/lib/validation/admin";
import { Project } from "@/models/Project";

const EMPTY: ProjectInput = {
  title: "",
  category: "residential",
  description: "",
  image: "",
  imageAlt: "",
  illustrative: false,
  order: 10,
  status: "draft",
};

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <ProjectForm id={null} initial={EMPTY} />;
  if (!isValidObjectId(id)) notFound();
  await connectDb();
  const p = await Project.findById(id).lean();
  if (!p) notFound();
  return (
    <ProjectForm
      id={id}
      initial={{
        title: p.title,
        category: p.category,
        description: p.description,
        image: p.image,
        imageAlt: p.imageAlt,
        illustrative: p.illustrative,
        order: p.order,
        status: p.status,
      }}
    />
  );
}
