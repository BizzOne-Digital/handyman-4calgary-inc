"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveSettings } from "@/app/admin/actions/settings";
import type { SettingsInput } from "@/lib/validation/admin";
import { AdminHeader } from "./AdminShell";
import { AdminImageField } from "./AdminImageField";
import { Panel, SubmitButton, TextArea, TextInput } from "./inputs";

const SOCIAL: { key: keyof SettingsInput["social"]; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "youtube", label: "YouTube" },
  { key: "google", label: "Google Business Profile" },
];

export function SettingsForm({ initial, saved }: { initial: SettingsInput; saved: boolean }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof SettingsInput>(k: K, val: SettingsInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await saveSettings(v);
      if (r.ok) {
        toast.success(r.message);
        setErrors({});
        router.refresh();
      } else {
        setErrors(r.fieldErrors ?? {});
        toast.error(r.message);
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <AdminHeader
        title="Settings"
        description={saved ? "Business details, logo, footer and default SEO." : "Showing defaults. Save once to store these settings in the database."}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Business contact">
          <TextInput label="Business name" required value={v.businessName} onChange={(x) => set("businessName", x)} maxLength={100} error={errors.businessName} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Phone (display)" required value={v.phone} onChange={(x) => set("phone", x)} maxLength={30} error={errors.phone} />
            <TextInput label="Phone link" required value={v.phoneHref} onChange={(x) => set("phoneHref", x)} error={errors.phoneHref} hint="Format: tel:+14033837013" />
          </div>
          <TextInput label="Public email" required type="email" value={v.email} onChange={(x) => set("email", x)} maxLength={200} error={errors.email} />
          <TextInput label="Service area" required value={v.serviceArea} onChange={(x) => set("serviceArea", x)} maxLength={120} error={errors.serviceArea}
            hint="Shown publicly. Do not enter a private street address." />
          <TextInput label="Tagline" value={v.tagline} onChange={(x) => set("tagline", x)} maxLength={160} error={errors.tagline} />
        </Panel>

        <Panel title="Logo & footer">
          <AdminImageField label="Logo" folder="misc" value={v.logoUrl} onChange={(x) => set("logoUrl", x)} error={errors.logoUrl} aspect="aspect-[900/564]"
            hint="Use the original logo file (PNG with a white or transparent background works best). Removing it falls back to the bundled logo." />
          <TextInput label="Logo alt text" required value={v.logoAlt} onChange={(x) => set("logoAlt", x)} maxLength={200} error={errors.logoAlt} />
          <TextArea label="Footer text" rows={3} value={v.footerText} onChange={(x) => set("footerText", x)} maxLength={300} error={errors.footerText} />
        </Panel>

        <Panel title="Social links" description="Only links you enter are shown in the footer. Leave blank to hide.">
          {SOCIAL.map((s) => (
            <TextInput key={s.key} label={s.label} value={v.social[s.key]} placeholder="https://"
              onChange={(x) => set("social", { ...v.social, [s.key]: x })} error={errors[`social.${s.key}`]} />
          ))}
        </Panel>

        <Panel title="Default SEO" description="Used when a page has no SEO title or description of its own.">
          <TextInput label="Default SEO title" value={v.defaultSeoTitle} onChange={(x) => set("defaultSeoTitle", x)} maxLength={70} error={errors.defaultSeoTitle} />
          <TextArea label="Default meta description" rows={3} value={v.defaultSeoDescription} onChange={(x) => set("defaultSeoDescription", x)} maxLength={170}
            error={errors.defaultSeoDescription} />
          <AdminImageField label="Default social sharing image" folder="misc" value={v.ogImage} onChange={(x) => set("ogImage", x)} error={errors.ogImage}
            hint="Shown when pages are shared on social media. 1200×630 works best." />
        </Panel>
      </div>
      <div className="mt-6 flex justify-end">
        <SubmitButton type="submit" pending={pending}>Save settings</SubmitButton>
      </div>
    </form>
  );
}
