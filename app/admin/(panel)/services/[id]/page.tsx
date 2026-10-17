import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { connectDb } from "@/lib/db/connect";
import type { ServiceInput } from "@/lib/validation/admin";
import { Service } from "@/models/Service";

const EMPTY: ServiceInput = {
  key: "",
  division: "residential",
  title: "",
  summary: "",
  description: "",
  highlights: [],
  href: "",
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
        title: s.title,
        summary: s.summary,
        description: s.description,
        highlights: s.highlights ?? [],
        href: s.href,
        image: s.image,
        imageAlt: s.imageAlt,
        order: s.order,
        status: s.status,
      }}
    />
  );
}
