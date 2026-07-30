import { Request, Response } from "express";
import { Role } from "../models/Role.model";
import { User } from "../models/User.model";
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

  static getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find().select("-passwordHash").populate("role").sort({ createdAt: -1 });
    return sendResponse({
      res,
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
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
        userName: req.user.name,
        action: "ROLE_CREATED",
        entity: "Role",
        entityId: role._id.toString(),
        ipAddress: req.ip || "127.0.0.1",
        changes: { roleName: role.name, permissions: role.permissions },
      });
    }

    return sendResponse({
      res,
      statusCode: 201,
      message: `Role '${role.name}' created successfully`,
      data: role,
    });
  });

  static assignUserRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { email, roleId } = req.body;
    if (!email || !roleId) {
      throw new BadRequestError("Email and roleId are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new NotFoundError(`No user account found matching email '${email}'`);
    }

    const role = await Role.findById(roleId);
    if (!role) {
      throw new NotFoundError("Selected target role was not found");
    }

    user.role = role._id;
    await user.save();

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        userName: req.user.name,
        action: "ROLE_ASSIGNED_TO_USER",
        entity: "User",
        entityId: user._id.toString(),
        ipAddress: req.ip || "127.0.0.1",
        changes: { userEmail: user.email, assignedRole: role.name },
      });
    }

    const updatedUser = await User.findById(user._id).select("-passwordHash").populate("role");

    return sendResponse({
      res,
      statusCode: 200,
      message: `Role '${role.name}' assigned to '${user.email}' successfully`,
      data: updatedUser,
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
        userName: req.user.name,
        action: "ROLE_DELETED",
        entity: "Role",
        entityId: id,
        ipAddress: req.ip || "127.0.0.1",
        changes: { roleName: role.name },
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      message: `Role '${role.name}' deleted successfully`,
    });
  });
}
