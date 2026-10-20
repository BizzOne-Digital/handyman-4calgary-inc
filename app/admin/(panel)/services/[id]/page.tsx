import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { connectDb } from "@/lib/db/connect";
import type { ServiceInput } from "@/lib/validation/admin";
import { Service } from "@/models/Service";

const EMPTY: ServiceInput = {
  key: "",
  division: "residential",
  group: "res-renovations",
  title: "",
  summary: "",
  description: "",
  highlights: [],
  image: "",
  imageAlt: "",
  order: 10,
  status: "draft",
};

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <ServiceForm id={null} initial={EMPTY} />;
  if (!isValidObjectId(id)) notFound();
  await connectDb();
  const s = await Service.findById(id).lean();
  if (!s) notFound();
  return (
    <ServiceForm
      id={id}
      initial={{
        key: s.key,
        division: s.division,
        group: s.group ?? "res-renovations",
        title: s.title,
        summary: s.summary,
        description: s.description,
        highlights: s.highlights ?? [],
        image: s.image,
        imageAlt: s.imageAlt,
        order: s.order,
        status: s.status,
      }}
    />
  );
}
