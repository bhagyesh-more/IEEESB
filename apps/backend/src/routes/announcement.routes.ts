import { Router } from "express";
import { AnnouncementController } from "../controllers/announcement.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

router.get("/", AnnouncementController.getAnnouncements);
router.post(
  "/",
  authGuard,
  requirePermissions(PERMISSIONS.ANNOUNCEMENTS_MANAGE),
  AnnouncementController.createAnnouncement
);
router.patch(
  "/:id",
  authGuard,
  requirePermissions(PERMISSIONS.ANNOUNCEMENTS_MANAGE),
  AnnouncementController.updateAnnouncement
);
router.delete(
  "/:id",
  authGuard,
  requirePermissions(PERMISSIONS.ANNOUNCEMENTS_MANAGE),
  AnnouncementController.deleteAnnouncement
);

export default router;
