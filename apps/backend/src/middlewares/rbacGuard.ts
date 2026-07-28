import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authGuard";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";

export const requirePermissions = (...requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("User is not authenticated."));
    }

    const userPermissions = req.user.role.permissions || [];
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return next(
        new ForbiddenError("Access denied. Insufficient permissions for this resource.")
      );
    }

    next();
  };
};
