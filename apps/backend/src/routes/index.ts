import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import eventRoutes from "./event.routes";
import announcementRoutes from "./announcement.routes";
import committeeRoutes from "./committee.routes";
import auditRoutes from "./audit.routes";
import mediaRoutes from "./media.routes";
import homepageRoutes from "./homepage.routes";
import roleRoutes from "./Role.routes";
import heroSlideRoutes from "./HeroSlide.routes";

const router = Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/announcements", announcementRoutes);
router.use("/committee", committeeRoutes);
router.use("/audit-logs", auditRoutes);
router.use("/media", mediaRoutes);
router.use("/homepage", homepageRoutes);
router.use("/roles", roleRoutes);
router.use("/hero-slides", heroSlideRoutes);

export default router;
