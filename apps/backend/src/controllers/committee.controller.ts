import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { CommitteeService } from "../services/committee.service";
import { AuthenticatedRequest } from "../middlewares/authGuard";

export class CommitteeController {
  static getMembers = asyncHandler(async (req: Request, res: Response) => {
    const year = req.query.year as string;
    const members = await CommitteeService.getAllMembers(year);
    return sendResponse({
      res,
      statusCode: 200,
      message: "Committee members fetched successfully",
      data: members,
    });
  });

  static createMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const member = await CommitteeService.createMember(
      req.body,
      req.user!.id,
      req.user!.name
    );
    return sendResponse({
      res,
      statusCode: 201,
      message: "Committee member created successfully",
      data: member,
    });
  });

  static updateMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const member = await CommitteeService.updateMember(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.name
    );
    return sendResponse({
      res,
      statusCode: 200,
      message: "Committee member updated successfully",
      data: member,
    });
  });

  static deleteMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await CommitteeService.deleteMember(
      req.params.id,
      req.user!.id,
      req.user!.name
    );
    return sendResponse({
      res,
      statusCode: 200,
      message: "Committee member deleted successfully",
    });
  });
}
