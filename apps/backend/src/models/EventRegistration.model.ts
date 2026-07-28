import mongoose, { Schema, Document } from "mongoose";

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  participantName: string;
  email: string;
  phone: string;
  college: string;
  ieeeNumber?: string;
  status: "CONFIRMED" | "WAITLISTED" | "CANCELLED";
  registeredAt: Date;
}

const EventRegistrationSchema: Schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    participantName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    ieeeNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "WAITLISTED", "CANCELLED"],
      default: "CONFIRMED",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

EventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export const EventRegistration = mongoose.model<IEventRegistration>(
  "EventRegistration",
  EventRegistrationSchema
);
