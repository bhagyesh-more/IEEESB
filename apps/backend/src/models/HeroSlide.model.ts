import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide extends Document {
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  linkHref?: string;
  linkText?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    linkHref: { type: String, trim: true },
    linkText: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const HeroSlide = mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
