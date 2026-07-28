import mongoose, { Schema, Document } from "mongoose";
import { EventStatus } from "@mmit-ieee/shared";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  bannerUrl: string;
  isRegistrationOpen: boolean;
  maxCapacity?: number;
  registeredCount: number;
  status: EventStatus;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    bannerUrl: {
      type: String,
      required: true,
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    maxCapacity: {
      type: Number,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ status: 1, startDate: -1 });

export const Event = mongoose.model<IEvent>("Event", EventSchema);
