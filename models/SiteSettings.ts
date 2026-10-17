import mongoose, { Schema, type Model } from "mongoose";

export type SocialLinks = { facebook: string; instagram: string; linkedin: string; youtube: string; google: string };
export type SiteSettingsData = {
  businessName: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  serviceArea: string;
  logoUrl: string;
  logoAlt: string;
  footerText: string;
  social: SocialLinks;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  ogImage: string;
};
export type SiteSettingsDoc = SiteSettingsData & { _id: mongoose.Types.ObjectId; key: "site"; updatedAt: Date };

const str = (max: number) => ({ type: String, default: "", trim: true, maxlength: max });

const SiteSettingsSchema = new Schema<SiteSettingsDoc>(
  {
    key: { type: String, default: "site", unique: true, enum: ["site"] },
    businessName: str(100),
    tagline: str(160),
    phone: str(30),
    phoneHref: str(40),
    email: str(200),
    serviceArea: str(120),
    logoUrl: str(500),
    logoAlt: str(200),
    footerText: str(300),
    social: { facebook: str(300), instagram: str(300), linkedin: str(300), youtube: str(300), google: str(300) },
    defaultSeoTitle: str(70),
    defaultSeoDescription: str(170),
    ogImage: str(500),
  },
  { timestamps: true },
);

export const SiteSettings: Model<SiteSettingsDoc> =
  (mongoose.models.SiteSettings as Model<SiteSettingsDoc>) ||
  mongoose.model<SiteSettingsDoc>("SiteSettings", SiteSettingsSchema);
