import mongoose, { Schema, type Model } from "mongoose";
import { PAGE_SLUGS, type PageSlug } from "@/lib/constants";

export type PageMedia = { key: string; label: string; url: string; alt: string };
export type PageFaq = { question: string; answer: string };
export type PageData = {
  seoTitle: string;
  seoDescription: string;
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };
  intro: { heading: string; body: string };
  media: PageMedia[];
  faqs: PageFaq[];
};

export type PageContentDoc = {
  _id: mongoose.Types.ObjectId;
  slug: PageSlug;
  /** Working copy edited in the admin panel. */
  draft: PageData;
  /** Live copy read by the public site. Null until first publish. */
  published: PageData | null;
  hasUnpublishedChanges: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const str = (max: number) => ({ type: String, default: "", trim: true, maxlength: max });

const PageDataSchema = new Schema<PageData>(
  {
    seoTitle: str(70),
    seoDescription: str(170),
    hero: {
      eyebrow: str(120),
      heading: str(160),
      description: str(400),
      ctaLabel: str(40),
      ctaHref: str(200),
      image: str(500),
      imageAlt: str(200),
    },
    intro: { heading: str(160), body: str(2000) },
    media: [
      new Schema<PageMedia>(
        { key: { type: String, required: true, maxlength: 60 }, label: str(80), url: str(500), alt: str(200) },
        { _id: false },
      ),
    ],
    faqs: [new Schema<PageFaq>({ question: str(200), answer: str(1200) }, { _id: false })],
  },
  { _id: false },
);

const PageContentSchema = new Schema<PageContentDoc>(
  {
    slug: { type: String, enum: PAGE_SLUGS, required: true, unique: true },
    draft: { type: PageDataSchema, required: true },
    published: { type: PageDataSchema, default: null },
    hasUnpublishedChanges: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

export const PageContent: Model<PageContentDoc> =
  (mongoose.models.PageContent as Model<PageContentDoc>) ||
  mongoose.model<PageContentDoc>("PageContent", PageContentSchema);
