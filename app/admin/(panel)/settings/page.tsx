import { SettingsForm } from "@/components/admin/SettingsForm";
import { DEFAULT_SETTINGS } from "@/lib/content/defaults";
import { connectDb } from "@/lib/db/connect";
import type { SettingsInput } from "@/lib/validation/admin";
import { SiteSettings } from "@/models/SiteSettings";

export default async function SettingsPage() {
  await connectDb();
  const doc = await SiteSettings.findOne({ key: "site" }).lean();
  const d = { ...DEFAULT_SETTINGS, ...(doc ? JSON.parse(JSON.stringify(doc)) : {}) };
  const initial: SettingsInput = {
    businessName: d.businessName,
    tagline: d.tagline,
    phone: d.phone,
    phoneHref: d.phoneHref,
    email: d.email,
    serviceArea: d.serviceArea,
    logoUrl: d.logoUrl,
    logoAlt: d.logoAlt,
    footerText: d.footerText,
    social: { ...DEFAULT_SETTINGS.social, ...(d.social ?? {}) },
    defaultSeoTitle: d.defaultSeoTitle,
    defaultSeoDescription: d.defaultSeoDescription,
    ogImage: d.ogImage,
  };
  return <SettingsForm initial={initial} saved={Boolean(doc)} />;
}
