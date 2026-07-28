import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { AuditLog } from "../models/AuditLog.model";

export class AuditController {
  static getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [logs, totalDocs] = await Promise.all([
      AuditLog.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email"),
      AuditLog.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Audit logs retrieved successfully",
      data: logs,
      meta: {
        page,
        limit,
        totalDocs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  });
}
