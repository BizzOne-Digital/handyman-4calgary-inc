import mongoose, { Schema, type Model } from "mongoose";
import { DIVISIONS, SERVICE_GROUP_KEYS, type Division, type ServiceGroupKey } from "@/lib/constants";

export type ServiceDoc = {
  _id: mongoose.Types.ObjectId;
  key: string;
  division: Division;
  /** Which group (page or section) the service appears under. */
  group: ServiceGroupKey;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  order: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
};

const ServiceSchema = new Schema<ServiceDoc>(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 80, match: /^[a-z0-9-]+$/ },
    division: { type: String, enum: DIVISIONS, required: true, index: true },
    group: { type: String, enum: SERVICE_GROUP_KEYS, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    summary: { type: String, default: "", trim: true, maxlength: 300 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    highlights: { type: [{ type: String, trim: true, maxlength: 160 }], default: [] },
    image: { type: String, default: "", trim: true, maxlength: 500 },
    imageAlt: { type: String, default: "", trim: true, maxlength: 200 },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },
  },
  { timestamps: true },
);
ServiceSchema.index({ group: 1, order: 1 });

export const Service: Model<ServiceDoc> =
  (mongoose.models.Service as Model<ServiceDoc>) || mongoose.model<ServiceDoc>("Service", ServiceSchema);
