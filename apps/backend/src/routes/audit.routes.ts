import { Router } from "express";
import { AuditController } from "../controllers/audit.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

router.get(
  "/",
  authGuard,
  requirePermissions(PERMISSIONS.SYSTEM_VIEW_AUDIT_LOGS),
  AuditController.getAuditLogs
);

export default router;
