import { Request, Response } from "express";
import { HeroSlide } from "../models/HeroSlide.model";
import { heroSlideSchema } from "@mmit-ieee/shared";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export class HeroSlideController {
  static getPublicSlides = asyncHandler(async (req: Request, res: Response) => {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return sendResponse({
      res,
      statusCode: 200,
      message: "Public hero slides fetched successfully",
      data: slides,
    });
  });

  static getAllSlides = asyncHandler(async (req: Request, res: Response) => {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
    return sendResponse({
      res,
      statusCode: 200,
      message: "All hero slides fetched successfully",
      data: slides,
    });
  });

  static createSlide = asyncHandler(async (req: Request, res: Response) => {
    const parseResult = heroSlideSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestError("Invalid hero slide payload", parseResult.error.errors);
    }
    const slide = await HeroSlide.create(parseResult.data);
    return sendResponse({
      res,
      statusCode: 201,
      message: "Hero slide created successfully",
      data: slide,
    });
  });

  static updateSlide = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const slide = await HeroSlide.findByIdAndUpdate(id, req.body, { new: true });
    if (!slide) {
      throw new NotFoundError("Hero slide not found");
    }
    return sendResponse({
      res,
      statusCode: 200,
      message: "Hero slide updated successfully",
      data: slide,
    });
  });

  static deleteSlide = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) {
      throw new NotFoundError("Hero slide not found");
    }
    return sendResponse({
      res,
      statusCode: 200,
      message: "Hero slide deleted successfully",
    });
  });
}
