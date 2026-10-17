import mongoose, { Schema, type Model } from "mongoose";

/**
 * Temporary chunk storage for uploads larger than the host's request-body limit
 * (Vercel functions accept about 4.5 MB per request). Abandoned chunks expire via TTL.
 */
export type UploadChunkDoc = {
  _id: mongoose.Types.ObjectId;
  uploadId: string;
  index: number;
  data: Buffer;
  owner: mongoose.Types.ObjectId;
  expiresAt: Date;
};

const UploadChunkSchema = new Schema<UploadChunkDoc>({
  uploadId: { type: String, required: true },
  index: { type: Number, required: true, min: 0 },
  data: { type: Buffer, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
  expiresAt: { type: Date, required: true },
});
UploadChunkSchema.index({ uploadId: 1, index: 1 }, { unique: true });
UploadChunkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const UploadChunk: Model<UploadChunkDoc> =
  (mongoose.models.UploadChunk as Model<UploadChunkDoc>) ||
  mongoose.model<UploadChunkDoc>("UploadChunk", UploadChunkSchema);
