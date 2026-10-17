import mongoose, { Schema, type Model } from "mongoose";

export type RateLimitDoc = { _id: string; count: number; expiresAt: Date };

const RateLimitSchema = new Schema<RateLimitDoc>({
  _id: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
});
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit: Model<RateLimitDoc> =
  (mongoose.models.RateLimit as Model<RateLimitDoc>) || mongoose.model<RateLimitDoc>("RateLimit", RateLimitSchema);
