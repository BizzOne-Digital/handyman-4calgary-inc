"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProject, saveProject } from "@/app/admin/actions/projects";
import { DIVISIONS, DIVISION_LABELS } from "@/lib/constants";
import type { ProjectInput } from "@/lib/validation/admin";
import { AdminImageField } from "./AdminImageField";
import { ConfirmButton } from "./ConfirmButton";
import { Checkbox, Panel, SelectInput, SubmitButton, TextArea, TextInput } from "./inputs";

export function ProjectForm({ id, initial }: { id: string | null; initial: ProjectInput }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await saveProject(id, v);
      if (res.ok) {
        toast.success(res.message);
        setErrors({});
        if (!id && res.data) router.replace(`/admin/projects/${res.data.id}`);
        else router.refresh();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.message);
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Link href="/admin/projects" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All projects
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">{id ? `Edit: ${initial.title}` : "New project"}</h1>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Panel title="Project">
            <TextInput label="Title" required value={v.title} onChange={(x) => set("title", x)} maxLength={120} error={errors.title} />
            <TextArea label="Description" rows={4} value={v.description} onChange={(x) => set("description", x)} maxLength={600} error={errors.description} />
          </Panel>
          <Panel title="Image">
            <AdminImageField label="Project image" required folder="gallery" value={v.image} onChange={(x) => set("image", x)} error={errors.image} aspect="aspect-[4/3]" />
            <TextInput label="Alt text" required value={v.imageAlt} onChange={(x) => set("imageAlt", x)} maxLength={200} error={errors.imageAlt}
              hint="Describe the image, e.g. “Finished basement family room with recessed lighting”." />
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Settings">
            <SelectInput label="Status" value={v.status} onChange={(x) => set("status", x)}
              options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft (hidden)" }]} />
            <SelectInput label="Category" value={v.category} onChange={(x) => set("category", x)}
              options={DIVISIONS.map((d) => ({ value: d, label: DIVISION_LABELS[d] }))} />
            <TextInput label="Display order" type="number" value={String(v.order)} onChange={(x) => set("order", Number(x) || 0)} error={errors.order} />
            <Checkbox
              label="Illustrative example"
              checked={v.illustrative}
              onChange={(x) => set("illustrative", x)}
              hint="Keep ticked for stock photos. Untick only for genuine completed client projects."
            />
          </Panel>
          {id && (
            <ConfirmButton
              title="Delete this project?"
              description="It will be removed from the gallery. Its image is deleted only if nothing else uses it."
              onConfirm={async () => {
                const r = await deleteProject(id);
                if (r.ok) {
                  toast.success(r.message);
                  router.replace("/admin/projects");
                } else toast.error(r.message);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line bg-white px-3 text-sm font-medium text-danger hover:border-danger"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" /> Delete project
            </ConfirmButton>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <SubmitButton type="submit" pending={pending}>
          {id ? "Save project" : "Create project"}
        </SubmitButton>
      </div>
    </form>
  );
}
