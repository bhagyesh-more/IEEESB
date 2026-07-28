import { Router } from "express";
import { HeroSlideController } from "../controllers/HeroSlide.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

// Public route for landing page carousel
router.get("/public", HeroSlideController.getPublicSlides);

// Protected routes for CMS management
router.get("/", authGuard, requirePermissions(PERMISSIONS.HERO_SLIDES_MANAGE), HeroSlideController.getAllSlides);
router.post("/", authGuard, requirePermissions(PERMISSIONS.HERO_SLIDES_MANAGE), HeroSlideController.createSlide);
router.put("/:id", authGuard, requirePermissions(PERMISSIONS.HERO_SLIDES_MANAGE), HeroSlideController.updateSlide);
router.delete("/:id", authGuard, requirePermissions(PERMISSIONS.HERO_SLIDES_MANAGE), HeroSlideController.deleteSlide);

export default router;
