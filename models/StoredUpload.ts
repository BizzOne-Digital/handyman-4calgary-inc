import mongoose, { Schema, type Model } from "mongoose";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/constants";

export type StoredUploadDoc = {
  _id: mongoose.Types.ObjectId;
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const StoredUploadSchema = new Schema<StoredUploadDoc>(
  {
    folder: { type: String, enum: UPLOAD_FOLDERS, required: true },
    filename: { type: String, required: true, maxlength: 80 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    data: { type: Buffer, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true },
);
StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });
StoredUploadSchema.index({ createdAt: -1 });

export const StoredUpload: Model<StoredUploadDoc> =
  (mongoose.models.StoredUpload as Model<StoredUploadDoc>) ||
  mongoose.model<StoredUploadDoc>("StoredUpload", StoredUploadSchema);
