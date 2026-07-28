import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { AnnouncementService } from "../services/announcement.service";
import { AuthenticatedRequest } from "../middlewares/authGuard";

export class AnnouncementController {
  static getAnnouncements = asyncHandler(async (req: Request, res: Response) => {
    const announcements = await AnnouncementService.getAllAnnouncements();
    return sendResponse({
      res,
      statusCode: 200,
      message: "Announcements retrieved successfully",
      data: announcements,
    });
  });

  static createAnnouncement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const announcement = await AnnouncementService.createAnnouncement(
      req.body,
      req.user!.id,
      req.user!.name
    );
    return sendResponse({
      res,
      statusCode: 201,
      message: "Announcement created successfully",
      data: announcement,
    });
  });

  static updateAnnouncement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const announcement = await AnnouncementService.updateAnnouncement(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.name
    );
    return sendResponse({
      res,
      statusCode: 200,
      message: "Announcement updated successfully",
      data: announcement,
    });
  });

  static deleteAnnouncement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await AnnouncementService.deleteAnnouncement(
      req.params.id,
      req.user!.id,
      req.user!.name
    );
    return sendResponse({
      res,
      statusCode: 200,
      message: "Announcement deleted successfully",
    });
  });
}
