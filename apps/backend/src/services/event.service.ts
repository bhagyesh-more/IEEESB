import { Event } from "../models/Event.model";
import { EventInput, EventStatus } from "@mmit-ieee/shared";
import { NotFoundError, ConflictError } from "../errors/AppError";
import { AuditLog } from "../models/AuditLog.model";

export class EventService {
  static async getAllEvents(query: { status?: string; category?: string; page?: number; limit?: number }) {
    const { status, category, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const [events, totalDocs] = await Promise.all([
      Event.find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email"),
      Event.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      events,
      meta: {
        page,
        limit,
        totalDocs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getEventBySlug(slug: string) {
    const event = await Event.findOne({ slug }).populate("createdBy", "name email");
    if (!event) {
      throw new NotFoundError(`Event with slug '${slug}' not found`);
    }
    return event;
  }

  static async createEvent(input: EventInput, userId: string, userName?: string) {
    const existingSlug = await Event.findOne({ slug: input.slug });
    if (existingSlug) {
      throw new ConflictError(`An event with slug '${input.slug}' already exists`);
    }

    const event = await Event.create({
      ...input,
      createdBy: userId,
    });

    await AuditLog.create({
      userId,
      userName,
      action: "EVENT_CREATED",
      entity: "Event",
      entityId: event._id.toString(),
      changes: input,
    });

    return event;
  }

  static async updateEvent(id: string, updates: Partial<EventInput>, userId: string, userName?: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw new NotFoundError(`Event with ID '${id}' not found`);
    }

    Object.assign(event, updates);
    await event.save();

    await AuditLog.create({
      userId,
      userName,
      action: "EVENT_UPDATED",
      entity: "Event",
      entityId: event._id.toString(),
      changes: updates,
    });

    return event;
  }

  static async deleteEvent(id: string, userId: string, userName?: string) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundError(`Event with ID '${id}' not found`);
    }

    await AuditLog.create({
      userId,
      userName,
      action: "EVENT_DELETED",
      entity: "Event",
      entityId: id,
    });

    return event;
  }

  static async registerParticipant(eventId: string, input: any) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new NotFoundError(`Event '${eventId}' not found`);
    }

    if (!event.isRegistrationOpen || event.status !== EventStatus.PUBLISHED) {
      throw new ConflictError("Registration for this event is currently closed");
    }

    if (event.maxCapacity && event.registeredCount >= event.maxCapacity) {
      throw new ConflictError("Event has reached maximum participant capacity");
    }

    const { EventRegistration } = await import("../models/EventRegistration.model");

    const existingReg = await EventRegistration.findOne({
      eventId,
      email: input.email.toLowerCase(),
    });

    if (existingReg) {
      throw new ConflictError("You have already registered for this event with this email");
    }

    const registration = await EventRegistration.create({
      eventId,
      participantName: input.participantName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      college: input.college,
      ieeeNumber: input.ieeeNumber,
      status: "CONFIRMED",
    });

    event.registeredCount += 1;
    await event.save();

    return registration;
  }

  static async getEventRegistrations(eventId: string) {
    const { EventRegistration } = await import("../models/EventRegistration.model");
    return EventRegistration.find({ eventId }).sort({ registeredAt: -1 });
  }
}
