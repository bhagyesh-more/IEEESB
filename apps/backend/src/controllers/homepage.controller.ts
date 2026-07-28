import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { Event } from "../models/Event.model";
import { Announcement } from "../models/Announcement.model";
import { ExecutiveCommittee } from "../models/ExecutiveCommittee.model";

export class HomepageController {
  static getHomepageData = asyncHandler(async (req: Request, res: Response) => {
    const [eventsCount, committeeCount, latestEvents, announcements] = await Promise.all([
      Event.countDocuments({ status: "PUBLISHED" }),
      ExecutiveCommittee.countDocuments({ isActive: true }),
      Event.find({ status: "PUBLISHED" }).sort({ startDate: -1 }).limit(5),
      Announcement.find().sort({ isPinned: -1, createdAt: -1 }).limit(5),
    ]);

    const heroSlides = latestEvents.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      subtitle: event.description,
      tag: event.category,
      imageUrl: event.bannerUrl,
      linkHref: `/events/${event.slug}`,
      linkText: "Register / View Event",
    }));

    return sendResponse({
      res,
      statusCode: 200,
      message: "Homepage dynamic data fetched successfully",
      data: {
        stats: {
          activeMembers: 250 + committeeCount,
          totalEvents: eventsCount || 45,
          awards: 18,
          cmsPowered: 100,
        },
        heroSlides,
        announcements,
      },
    });
  });
}
