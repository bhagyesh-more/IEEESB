import { Router } from "express";
import { CommitteeController } from "../controllers/committee.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

router.get("/", CommitteeController.getMembers);
router.post(
  "/",
  authGuard,
  requirePermissions(PERMISSIONS.MEMBERS_VERIFY),
  CommitteeController.createMember
);
router.patch(
  "/:id",
  authGuard,
  requirePermissions(PERMISSIONS.MEMBERS_VERIFY),
  CommitteeController.updateMember
);
router.delete(
  "/:id",
  authGuard,
  requirePermissions(PERMISSIONS.MEMBERS_VERIFY),
  CommitteeController.deleteMember
);

export default router;
