import mongoose, { Schema, Document } from "mongoose";

export interface IGalleryImage {
  url: string;
  publicId: string;
  caption?: string;
  uploadedAt: Date;
}

export interface IGalleryAlbum extends Document {
  title: string;
  slug: string;
  description?: string;
  coverImageUrl: string;
  images: IGalleryImage[];
  category: string;
  eventDate?: Date;
  isFeatured: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema: Schema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const GalleryAlbumSchema: Schema = new Schema(
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
    },
    coverImageUrl: {
      type: String,
      required: true,
    },
    images: [GalleryImageSchema],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

export const GalleryAlbum = mongoose.model<IGalleryAlbum>("GalleryAlbum", GalleryAlbumSchema);
