import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

// Public Routes
router.get("/", EventController.getEvents);
router.get("/:slug", EventController.getEventBySlug);

// Protected CMS Routes
router.post(
  "/",
  authGuard,
  requirePermissions(PERMISSIONS.EVENTS_CREATE),
  EventController.createEvent
);

router.patch(
  "/:id",
  authGuard,
  requirePermissions(PERMISSIONS.EVENTS_EDIT),
  EventController.updateEvent
);

router.delete(
  "/:id",
  authGuard,
  requirePermissions(PERMISSIONS.EVENTS_DELETE),
  EventController.deleteEvent
);

// Public Event Registration
router.post("/:id/register", EventController.registerParticipant);

// Protected CMS Registrations View
router.get(
  "/:id/registrations",
  authGuard,
  requirePermissions(PERMISSIONS.EVENTS_VIEW_REGISTRATIONS),
  EventController.getRegistrations
);

export default router;
