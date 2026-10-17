import mongoose, { Schema, type Model } from "mongoose";
import { DIVISIONS, type Division } from "@/lib/constants";

export type ProjectDoc = {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: Division;
  description: string;
  image: string;
  imageAlt: string;
  /** True for stock/illustrative imagery. Only set false for genuine completed client work. */
  illustrative: boolean;
  order: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
};

const ProjectSchema = new Schema<ProjectDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: DIVISIONS, required: true, index: true },
    description: { type: String, default: "", trim: true, maxlength: 600 },
    image: { type: String, required: true, trim: true, maxlength: 500 },
    imageAlt: { type: String, required: true, trim: true, maxlength: 200 },
    illustrative: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
  },
  { timestamps: true },
);
ProjectSchema.index({ status: 1, order: 1 });

export const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) || mongoose.model<ProjectDoc>("Project", ProjectSchema);
