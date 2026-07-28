import { Announcement } from "../models/Announcement.model";
import { NotFoundError } from "../errors/AppError";
import { AuditLog } from "../models/AuditLog.model";

export class AnnouncementService {
  static async getAllAnnouncements() {
    return Announcement.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .populate("createdBy", "name email");
  }

  static async createAnnouncement(input: any, userId: string, userName?: string) {
    const announcement = await Announcement.create({
      ...input,
      createdBy: userId,
    });

    await AuditLog.create({
      userId,
      userName,
      action: "ANNOUNCEMENT_CREATED",
      entity: "Announcement",
      entityId: announcement._id.toString(),
      changes: input,
    });

    return announcement;
  }

  static async updateAnnouncement(id: string, updates: any, userId: string, userName?: string) {
    const announcement = await Announcement.findByIdAndUpdate(id, updates, { new: true });
    if (!announcement) {
      throw new NotFoundError(`Announcement '${id}' not found`);
    }

    await AuditLog.create({
      userId,
      userName,
      action: "ANNOUNCEMENT_UPDATED",
      entity: "Announcement",
      entityId: id,
      changes: updates,
    });

    return announcement;
  }

  static async deleteAnnouncement(id: string, userId: string, userName?: string) {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      throw new NotFoundError(`Announcement '${id}' not found`);
    }

    await AuditLog.create({
      userId,
      userName,
      action: "ANNOUNCEMENT_DELETED",
      entity: "Announcement",
      entityId: id,
    });

    return announcement;
  }
}
