"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteService, saveService } from "@/app/admin/actions/services";
import { DIVISIONS, DIVISION_LABELS, groupsFor, serviceHref } from "@/lib/constants";
import type { ServiceInput } from "@/lib/validation/admin";
import { AdminImageField } from "./AdminImageField";
import { ConfirmButton } from "./ConfirmButton";
import { Panel, SelectInput, SubmitButton, TextArea, TextInput } from "./inputs";

export function ServiceForm({ id, initial }: { id: string | null; initial: ServiceInput }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [highlights, setHighlights] = useState(initial.highlights.join("\n"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof ServiceInput>(k: K, val: ServiceInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const payload = { ...v, highlights: highlights.split("\n").map((h) => h.trim()).filter(Boolean) };
      const res = await saveService(id, payload);
      if (res.ok) {
        toast.success(res.message);
        setErrors({});
        if (!id && res.data) router.replace(`/admin/services/${res.data.id}`);
        else router.refresh();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.message);
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Link href="/admin/services" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All services
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">{id ? `Edit: ${initial.title}` : "New service"}</h1>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Panel title="Content">
            <TextInput label="Title" required value={v.title} onChange={(x) => set("title", x)} maxLength={120} error={errors.title} />
            <TextArea label="Summary" rows={2} value={v.summary} onChange={(x) => set("summary", x)} maxLength={300} error={errors.summary}
              hint="Short line used on cards." />
            <TextArea label="Description" rows={5} value={v.description} onChange={(x) => set("description", x)} maxLength={2000} error={errors.description}
              hint="Used on the Residential and Commercial & Industrial pages." />
            <TextArea label="Highlights" rows={5} value={highlights} onChange={setHighlights} error={errors.highlights}
              hint="One per line, up to 10. Shown as a checklist." />
          </Panel>
          <Panel title="Image">
            <AdminImageField label="Service image" folder="pages" value={v.image} onChange={(x) => set("image", x)} error={errors.image} />
            <TextInput label="Image alt text" value={v.imageAlt} onChange={(x) => set("imageAlt", x)} maxLength={200} error={errors.imageAlt}
              hint="Describe what the image shows." />
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Settings">
            <SelectInput label="Status" value={v.status} onChange={(x) => set("status", x)}
              options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft (hidden)" }]} />
            <SelectInput label="Division" value={v.division}
              onChange={(x) => setV((p) => ({ ...p, division: x, group: groupsFor(x)[0].key }))}
              options={DIVISIONS.map((d) => ({ value: d, label: DIVISION_LABELS[d] }))} />
            <SelectInput label="Group" value={v.group} onChange={(x) => set("group", x)} error={errors.group}
              hint="Which page or section this service appears under."
              options={groupsFor(v.division).map((g) => ({ value: g.key, label: g.title }))} />
            <TextInput label="Key" required value={v.key} onChange={(x) => set("key", x.toLowerCase())} maxLength={80} error={errors.key}
              hint="Unique id used in links, e.g. commercial-flooring. Changing it changes the public link." />
            <p className="text-xs text-muted">
              Public link: <span className="break-all font-medium text-ink">{v.key ? serviceHref(v.group, v.key) : "set a key"}</span>
            </p>
            <TextInput label="Display order" type="number" value={String(v.order)} onChange={(x) => set("order", Number(x) || 0)} error={errors.order} />
          </Panel>
          {id && (
            <ConfirmButton
              title="Delete this service?"
              description="It will be removed from the website. Its image is deleted only if nothing else uses it."
              onConfirm={async () => {
                const r = await deleteService(id);
                if (r.ok) {
                  toast.success(r.message);
                  router.replace("/admin/services");
                } else toast.error(r.message);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line bg-white px-3 text-sm font-medium text-danger hover:border-danger"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" /> Delete service
            </ConfirmButton>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <SubmitButton type="submit" pending={pending}>
          {id ? "Save service" : "Create service"}
        </SubmitButton>
      </div>
    </form>
  );
}
