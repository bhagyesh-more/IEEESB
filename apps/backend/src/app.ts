import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import apiRoutes from "./routes";
import docsRoutes from "./routes/docs.routes";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Tightened Helmet HTTP Security Headers with strict Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://images.unsplash.com"],
        connectSrc: ["'self'", "https://api.cloudinary.com", env.CLIENT_URL],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [env.CLIENT_URL, "http://localhost:3000", "https://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP, please try again after 15 minutes",
    },
  },
});
app.use("/api", globalLimiter);

// Body Parsing & Cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// HTTP Request Logger
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health Check & Root Route
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "MMIT IEEE Student Branch Backend API is online and healthy 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Swagger Visual API Documentation Explorer
app.use("/api-docs", docsRoutes);

// API Routes
app.use("/api/v1", apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
