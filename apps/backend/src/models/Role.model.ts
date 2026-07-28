import mongoose, { Schema, Document } from "mongoose";
import { UserRole, PERMISSIONS } from "@mmit-ieee/shared";

export interface IRole extends Document {
  name: UserRole | string;
  permissions: string[];
  description?: string;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);
