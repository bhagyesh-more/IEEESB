import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { EventService } from "../services/event.service";
import { eventSchema } from "@mmit-ieee/shared";
import { BadRequestError } from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/authGuard";

export class EventController {
  static getEvents = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const category = req.query.category as string;

    const { events, meta } = await EventService.getAllEvents({ status, category, page, limit });

    return sendResponse({
      res,
      statusCode: 200,
      message: "Events retrieved successfully",
      data: events,
      meta,
    });
  });

  static getEventBySlug = asyncHandler(async (req: Request, res: Response) => {
    const event = await EventService.getEventBySlug(req.params.slug);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Event fetched successfully",
      data: event,
    });
  });

  static createEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const parseResult = eventSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestError("Invalid event payload", parseResult.error.errors);
    }

    const event = await EventService.createEvent(
      parseResult.data,
      req.user!.id,
      req.user!.name
    );

    return sendResponse({
      res,
      statusCode: 201,
      message: "Event created successfully",
      data: event,
    });
  });

  static updateEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const event = await EventService.updateEvent(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.name
    );

    return sendResponse({
      res,
      statusCode: 200,
      message: "Event updated successfully",
      data: event,
    });
  });

  static deleteEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await EventService.deleteEvent(req.params.id, req.user!.id, req.user!.name);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Event deleted successfully",
    });
  });

  static registerParticipant = asyncHandler(async (req: Request, res: Response) => {
    const registration = await EventService.registerParticipant(req.params.id, req.body);

    return sendResponse({
      res,
      statusCode: 201,
      message: "Event registration successful!",
      data: registration,
    });
  });

  static getRegistrations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const registrations = await EventService.getEventRegistrations(req.params.id);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Event registrations retrieved successfully",
      data: registrations,
    });
  });
}
