import mongoose, { Schema, type Model } from "mongoose";
import { CONTACT_METHODS, DIVISIONS, ENQUIRY_STATUSES, type Division, type EnquiryStatus } from "@/lib/constants";

export type EnquiryDoc = {
  _id: mongoose.Types.ObjectId;
  reference: string;
  kind: "quote" | "contact";
  name: string;
  email: string;
  phone: string;
  division?: Division;
  service?: string;
  address?: string;
  message: string;
  preferredContact?: (typeof CONTACT_METHODS)[number];
  /** A preference only (YYYY-MM-DD). Not a confirmed appointment. */
  preferredDate?: string;
  sourcePage?: string;
  status: EnquiryStatus;
  internalNotes: string;
  emailNotified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const EnquirySchema = new Schema<EnquiryDoc>(
  {
    reference: { type: String, required: true, unique: true },
    kind: { type: String, enum: ["quote", "contact"], required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    division: { type: String, enum: DIVISIONS },
    service: { type: String, trim: true, maxlength: 80 },
    address: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    preferredContact: { type: String, enum: CONTACT_METHODS },
    preferredDate: { type: String, maxlength: 10 },
    sourcePage: { type: String, maxlength: 200 },
    status: { type: String, enum: ENQUIRY_STATUSES, default: "new", index: true },
    internalNotes: { type: String, default: "", maxlength: 3000 },
    emailNotified: { type: Boolean, default: false },
  },
  { timestamps: true },
);
EnquirySchema.index({ createdAt: -1 });

export const Enquiry: Model<EnquiryDoc> =
  (mongoose.models.Enquiry as Model<EnquiryDoc>) || mongoose.model<EnquiryDoc>("Enquiry", EnquirySchema);
