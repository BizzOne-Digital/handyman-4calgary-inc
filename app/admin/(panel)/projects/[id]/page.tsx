import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { connectDb } from "@/lib/db/connect";
import type { ProjectInput } from "@/lib/validation/admin";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";

const EMPTY: ProjectInput = {
  title: "",
  category: "residential",
  description: "",
  serviceKey: "",
  image: "",
  imageAlt: "",
  illustrative: false,
  order: 10,
  status: "draft",
};

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "new" && !isValidObjectId(id)) notFound();
  await connectDb();
  const services = (await Service.find({}, { key: 1, title: 1, division: 1 }).sort({ title: 1 }).lean()).map((s) => ({
    key: s.key,
    title: s.title,
    division: s.division,
  }));
  if (id === "new") return <ProjectForm id={null} initial={EMPTY} services={services} />;
  const p = await Project.findById(id).lean();
  if (!p) notFound();
  return (
    <ProjectForm
      id={id}
      services={services}
      initial={{
        title: p.title,
        category: p.category,
        description: p.description,
        serviceKey: p.serviceKey ?? "",
        image: p.image,
        imageAlt: p.imageAlt,
        illustrative: p.illustrative,
        order: p.order,
        status: p.status,
      }}
    />
  );
}
