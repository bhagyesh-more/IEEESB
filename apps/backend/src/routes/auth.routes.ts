import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/authGuard";
import rateLimit from "express-rate-limit";

const router = Router();

// Strict Rate Limiting on Auth Endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Limit to 15 attempts per 15 minutes
  message: {
    success: false,
    statusCode: 429,
    error: {
      code: "TOO_MANY_AUTH_ATTEMPTS",
      message: "Too many login attempts. Please try again after 15 minutes.",
    },
  },
});

router.post("/login", authLimiter, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", authGuard, AuthController.getMe);

export default router;
