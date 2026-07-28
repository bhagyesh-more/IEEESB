import { Router } from "express";
import { MediaController } from "../controllers/media.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

router.post(
  "/upload-signature",
  authGuard,
  requirePermissions(PERMISSIONS.GALLERY_UPLOAD),
  MediaController.generateUploadSignature
);

export default router;
