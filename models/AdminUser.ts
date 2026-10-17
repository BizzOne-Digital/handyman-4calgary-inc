import mongoose, { Schema, type Model } from "mongoose";

export type AdminUserDoc = {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  active: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const AdminUserSchema = new Schema<AdminUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 200 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    passwordHash: { type: String, required: true },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const AdminUser: Model<AdminUserDoc> =
  (mongoose.models.AdminUser as Model<AdminUserDoc>) || mongoose.model<AdminUserDoc>("AdminUser", AdminUserSchema);
