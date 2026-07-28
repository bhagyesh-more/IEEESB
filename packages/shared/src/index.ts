import { z } from "zod";

// --- API Standard Response Types ---
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    totalDocs?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp?: string;
}

// --- Roles & Permissions Constants ---
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  EXECUTIVE_MEMBER = "EXECUTIVE_MEMBER",
  STUDENT_MEMBER = "STUDENT_MEMBER",
}

export const PERMISSIONS = {
  SYSTEM_MANAGE_USERS: "system:manage_users",
  SYSTEM_VIEW_AUDIT_LOGS: "system:view_audit_logs",
  ROLES_MANAGE: "roles:manage",
  HERO_SLIDES_MANAGE: "hero_slides:manage",
  EVENTS_CREATE: "events:create",
  EVENTS_EDIT: "events:edit",
  EVENTS_PUBLISH: "events:publish",
  EVENTS_DELETE: "events:delete",
  EVENTS_VIEW_REGISTRATIONS: "events:view_registrations",
  GALLERY_UPLOAD: "gallery:upload",
  GALLERY_DELETE: "gallery:delete",
  ANNOUNCEMENTS_MANAGE: "announcements:manage",
  MEMBERS_VERIFY: "members:verify",
  PUBLIC_VIEW_CONTENT: "public:view_content",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// --- Zod Auth Schemas ---
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  ieeeMemberId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// --- Role Management Schemas ---
export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

// --- Hero Slide Management Schemas ---
export const heroSlideSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
  tag: z.string().min(2, "Tag is required"),
  imageUrl: z.string().url("Invalid image URL"),
  linkHref: z.string().optional(),
  linkText: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

// --- Event Status Enum & Schema ---
export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  venue: z.string().min(2, "Venue is required"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  bannerUrl: z.string().url("Invalid image URL"),
  isRegistrationOpen: z.boolean().default(true),
  maxCapacity: z.number().int().positive().optional(),
  status: z.nativeEnum(EventStatus).default(EventStatus.DRAFT),
});

export type EventInput = z.infer<typeof eventSchema>;
