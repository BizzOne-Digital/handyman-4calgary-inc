"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEnquiry, updateEnquiry } from "@/app/admin/actions/enquiries";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/lib/constants";
import { ConfirmButton } from "./ConfirmButton";
import { Panel, SelectInput, SubmitButton, TextArea } from "./inputs";

export function EnquiryEditor({ id, status, notes, reference }: { id: string; status: EnquiryStatus; notes: string; reference: string }) {
  const router = useRouter();
  const [s, setS] = useState(status);
  const [n, setN] = useState(notes);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-6">
      <Panel title="Follow-up">
        <SelectInput label="Status" value={s} onChange={setS} options={ENQUIRY_STATUSES.map((v) => ({ value: v, label: ENQUIRY_STATUS_LABELS[v] }))} />
        <TextArea label="Internal notes" rows={6} value={n} onChange={setN} maxLength={3000} hint="Only visible to admins." />
        <SubmitButton
          pending={pending}
          onClick={() =>
            start(async () => {
              const r = await updateEnquiry(id, { status: s, internalNotes: n });
              if (r.ok) {
                toast.success(r.message);
                router.refresh();
              } else toast.error(r.message);
            })
          }
        >
          Save changes
        </SubmitButton>
      </Panel>
      <ConfirmButton
        title={`Delete enquiry ${reference}?`}
        description="This permanently removes the enquiry and its notes. This cannot be undone."
        onConfirm={async () => {
          const r = await deleteEnquiry(id);
          if (r.ok) {
            toast.success(r.message);
            router.replace("/admin/enquiries");
          } else toast.error(r.message);
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line bg-white px-3 text-sm font-medium text-danger hover:border-danger"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" /> Delete enquiry
      </ConfirmButton>
    </div>
  );
}
