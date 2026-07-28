import { Request, Response } from "express";
import { Role } from "../models/Role.model";
import { createRoleSchema, UserRole } from "@mmit-ieee/shared";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/authGuard";
import { AuditLog } from "../models/AuditLog.model";
import { BadRequestError, NotFoundError } from "../errors/AppError";

const SYSTEM_ROLES = Object.values(UserRole);

export class RoleController {
  static getRoles = asyncHandler(async (req: Request, res: Response) => {
    const roles = await Role.find().sort({ createdAt: -1 });
    return sendResponse({
      res,
      statusCode: 200,
      message: "Roles fetched successfully",
      data: roles,
    });
  });

  static createRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const parseResult = createRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestError("Invalid role payload", parseResult.error.errors);
    }
    const validatedData = parseResult.data;

    const existingRole = await Role.findOne({ name: validatedData.name.toUpperCase() });
    if (existingRole) {
      throw new BadRequestError(`Role '${validatedData.name}' already exists`);
    }

    const role = await Role.create({
      name: validatedData.name.toUpperCase(),
      description: validatedData.description,
      permissions: validatedData.permissions,
    });

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: "ROLE_CREATED",
        targetResource: `Role:${role._id}`,
        ipAddress: req.ip || "127.0.0.1",
        details: { roleName: role.name },
      });
    }

    return sendResponse({
      res,
      statusCode: 201,
      message: `Role '${role.name}' created successfully`,
      data: role,
    });
  });

  static deleteRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    if (SYSTEM_ROLES.includes(role.name as UserRole)) {
      throw new BadRequestError(`System protected role '${role.name}' cannot be deleted.`);
    }

    await Role.findByIdAndDelete(id);

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: "ROLE_DELETED",
        targetResource: `Role:${id}`,
        ipAddress: req.ip || "127.0.0.1",
        details: { roleName: role.name },
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      message: `Role '${role.name}' deleted successfully`,
    });
  });
}
