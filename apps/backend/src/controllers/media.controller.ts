import { Request, Response } from "express";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { BadRequestError } from "../errors/AppError";

export class MediaController {
  static generateUploadSignature = asyncHandler(async (req: Request, res: Response) => {
    const folder = (req.body.folder as string) || "mmit-ieee/events";
    const timestamp = Math.round(new Date().getTime() / 1000);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (
      !cloudName ||
      !apiKey ||
      !apiSecret ||
      apiKey.includes("your_") ||
      cloudName.includes("your_") ||
      apiSecret.includes("your_")
    ) {
      throw new BadRequestError(
        "Cloudinary CDN credentials in backend .env are unconfigured or placeholders (e.g. 'your_cloudinary_api_key'). Please provide valid Cloudinary credentials in apps/backend/.env or use direct Image URLs."
      );
    }

    // SHA-1 Signature String
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

    return sendResponse({
      res,
      statusCode: 200,
      message: "Media upload signature generated successfully",
      data: {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
      },
    });
  });
}
