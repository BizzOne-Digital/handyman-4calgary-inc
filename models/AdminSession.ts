import mongoose, { Schema, type Model } from "mongoose";

export type AdminSessionDoc = {
  _id: mongoose.Types.ObjectId;
  /** SHA-256 of the session token. The raw token only exists in the HTTP-only cookie. */
  tokenHash: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
  userAgent?: string;
  createdAt: Date;
};

const AdminSessionSchema = new Schema<AdminSessionDoc>(
  {
    tokenHash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true, index: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String, maxlength: 300 },
  },
  { timestamps: true },
);
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminSession: Model<AdminSessionDoc> =
  (mongoose.models.AdminSession as Model<AdminSessionDoc>) ||
  mongoose.model<AdminSessionDoc>("AdminSession", AdminSessionSchema);
