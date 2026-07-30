import mongoose, { Schema, Document } from "mongoose";

export interface IExecutiveCommittee extends Document {
  name: string;
  designation: string;
  category: "MEMBER" | "FACULTY" | "LEAD" | "MENTOR";
  isExecutive: boolean;
  bio?: string;
  avatarUrl: string;
  displayOrder: number;
  ieeeMemberId?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
  isActive: boolean;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExecutiveCommitteeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["MEMBER", "FACULTY", "LEAD", "MENTOR"],
      default: "MEMBER",
    },
    isExecutive: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    ieeeMemberId: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      email: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: "2025-2026",
    },
  },
  {
    timestamps: true,
  }
);

ExecutiveCommitteeSchema.index({ academicYear: -1, isExecutive: -1, displayOrder: 1 });

export const ExecutiveCommittee = mongoose.model<IExecutiveCommittee>(
  "ExecutiveCommittee",
  ExecutiveCommitteeSchema
);
