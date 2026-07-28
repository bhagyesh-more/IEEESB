import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db";
import { Role } from "../models/Role.model";
import { User } from "../models/User.model";
import { Event } from "../models/Event.model";
import { Announcement } from "../models/Announcement.model";
import { HeroSlide } from "../models/HeroSlide.model";
import { UserRole, PERMISSIONS, EventStatus } from "@mmit-ieee/shared";
import { logger } from "../config/logger";

const seedDatabase = async () => {
  try {
    await connectDatabase();
    logger.info("🌱 Starting database seeding process...");

    // Define System Roles & Permissions Matrix
    const rolesData = [
      {
        name: UserRole.SUPER_ADMIN,
        description: "Full platform super administrator with access to all permissions",
        isSystemRole: true,
        permissions: Object.values(PERMISSIONS),
      },
      {
        name: UserRole.ADMIN,
        description: "Branch administrator for managing events, announcements, and members",
        isSystemRole: true,
        permissions: [
          PERMISSIONS.SYSTEM_VIEW_AUDIT_LOGS,
          PERMISSIONS.ROLES_MANAGE,
          PERMISSIONS.HERO_SLIDES_MANAGE,
          PERMISSIONS.EVENTS_CREATE,
          PERMISSIONS.EVENTS_EDIT,
          PERMISSIONS.EVENTS_PUBLISH,
          PERMISSIONS.EVENTS_DELETE,
          PERMISSIONS.EVENTS_VIEW_REGISTRATIONS,
          PERMISSIONS.GALLERY_UPLOAD,
          PERMISSIONS.GALLERY_DELETE,
          PERMISSIONS.ANNOUNCEMENTS_MANAGE,
          PERMISSIONS.MEMBERS_VERIFY,
          PERMISSIONS.PUBLIC_VIEW_CONTENT,
        ],
      },
      {
        name: UserRole.EDITOR,
        description: "Content editor for drafting events, announcements, and uploading media",
        isSystemRole: true,
        permissions: [
          PERMISSIONS.EVENTS_CREATE,
          PERMISSIONS.EVENTS_EDIT,
          PERMISSIONS.EVENTS_VIEW_REGISTRATIONS,
          PERMISSIONS.GALLERY_UPLOAD,
          PERMISSIONS.ANNOUNCEMENTS_MANAGE,
          PERMISSIONS.PUBLIC_VIEW_CONTENT,
        ],
      },
      {
        name: UserRole.EXECUTIVE_MEMBER,
        description: "Executive committee member with event registration view access",
        isSystemRole: true,
        permissions: [
          PERMISSIONS.EVENTS_VIEW_REGISTRATIONS,
          PERMISSIONS.GALLERY_UPLOAD,
          PERMISSIONS.PUBLIC_VIEW_CONTENT,
        ],
      },
      {
        name: UserRole.STUDENT_MEMBER,
        description: "Standard IEEE student member",
        isSystemRole: true,
        permissions: [PERMISSIONS.PUBLIC_VIEW_CONTENT],
      },
    ];

    // Seed Roles
    for (const roleDef of rolesData) {
      await Role.findOneAndUpdate(
        { name: roleDef.name },
        { $set: roleDef },
        { upsert: true, new: true }
      );
    }
    logger.info("✅ System roles seeded successfully.");

    // Retrieve SuperAdmin Role
    const superAdminRole = await Role.findOne({ name: UserRole.SUPER_ADMIN });
    if (!superAdminRole) {
      throw new Error("SuperAdmin role not found!");
    }

    // Seed Initial SuperAdmin User
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
    const seedPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMeInProd123!";
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const passwordHash = await bcrypt.hash(seedPassword, 12);
      adminUser = await User.create({
        name: "Super Administrator",
        email: adminEmail,
        passwordHash,
        role: superAdminRole._id,
        isActive: true,
        ieeeMemberId: "STB99311-ADMIN",
      });
      logger.info(`✅ Default SuperAdmin user created: ${adminEmail}`);
    } else {
      logger.info(`ℹ️ SuperAdmin user already exists: ${adminEmail}`);
    }

    // Seed Hero Slides
    const heroSlidesData = [
      {
        title: "Industrial Visit to National PARAM Supercomputing Facility",
        subtitle: "Explored advanced supercomputing systems including PARAM Siddhi-AI, PARAM Brahma, and AIRAWAT at C-DAC Pune.",
        tag: "Flagship Industrial Visit",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80",
        linkHref: "/events",
        linkText: "Read Visit Details",
        order: 1,
        isActive: true,
      },
      {
        title: "Building AI Agents: International Hands-on Expert Session",
        subtitle: "Master deep learning models, autonomous workflows, and LLM integrations with international IEEE guest scholars.",
        tag: "Technical Workshop",
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80",
        linkHref: "/events",
        linkText: "Explore Session",
        order: 2,
        isActive: true,
      },
      {
        title: "PRAXIS: Premier Scholar's Knowledge Exchange",
        subtitle: "A monthly recurring global hands-on workshop series hosted by MMIT IEEE Student Branch in collaboration with IEEE JCTS Pune Section.",
        tag: "Scholar Series",
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80",
        linkHref: "/about",
        linkText: "Discover MMIT IEEE SB",
        order: 3,
        isActive: true,
      },
    ];

    for (const slide of heroSlidesData) {
      await HeroSlide.findOneAndUpdate(
        { title: slide.title },
        { $set: slide },
        { upsert: true, new: true }
      );
    }
    logger.info("✅ Hero slides seeded successfully.");

    // Seed Real Original Website Events
    const eventsData = [
      {
        title: "Industrial Visit to National PARAM Supercomputing Facility",
        slug: "param-supercomputing-facility-visit",
        description: "The IEEE Computer Society Chapter of MMIT Student Branch organized an Industrial Visit to the National PARAM Supercomputing Facility at C-DAC Pune on 8th May 2024. A total of 31 IEEE student members along with faculty coordinators participated to explore PARAM Siddhi-AI, PARAM Brahma, and AIRAWAT.",
        category: "Industrial Visit",
        venue: "C-DAC, Pune (Centre for Development of Advanced Computing)",
        startDate: new Date("2024-05-08T09:00:00Z"),
        endDate: new Date("2024-05-08T17:00:00Z"),
        bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80",
        isRegistrationOpen: false,
        maxCapacity: 50,
        status: EventStatus.COMPLETED,
        organizer: adminUser._id,
      },
      {
        title: "Building AI Agents: International Hands-on Expert Session",
        slug: "building-ai-agents-expert-session",
        description: "MMIT IEEE Student Branch organized an International Hands-on Expert Session on Building AI Agents featuring interactive labs on LLM tools, agentic workflows, and PyTorch implementations.",
        category: "Technical Workshop",
        venue: "MMIT Seminar Hall & Online",
        startDate: new Date("2024-04-20T10:00:00Z"),
        endDate: new Date("2024-04-20T16:00:00Z"),
        bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80",
        isRegistrationOpen: false,
        maxCapacity: 120,
        status: EventStatus.COMPLETED,
        organizer: adminUser._id,
      },
      {
        title: "PRAXIS: A Premier Scholar's Knowledge Exchange Program",
        slug: "praxis-scholar-knowledge-exchange",
        description: "A monthly recurring global hands-on workshop series organized by MMIT IEEE Student Branch in collaboration with IEEE JCTS Pune Section for technical dissemination.",
        category: "Knowledge Exchange",
        venue: "MMIT Computer Engineering Lab",
        startDate: new Date("2024-03-29T11:00:00Z"),
        endDate: new Date("2024-03-29T15:00:00Z"),
        bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80",
        isRegistrationOpen: false,
        maxCapacity: 80,
        status: EventStatus.COMPLETED,
        organizer: adminUser._id,
      },
      {
        title: "AI Conclave 2026 Student-Led Panel Discussion",
        slug: "ai-conclave-2026-panel-discussion",
        description: "Student-led panel discussion organized by IEEE Computer Society chapter focusing on generative AI ethics, industry readiness, and research publications.",
        category: "Panel Discussion",
        venue: "MMIT Auditorium",
        startDate: new Date("2024-02-20T10:00:00Z"),
        endDate: new Date("2024-02-20T13:00:00Z"),
        bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80",
        isRegistrationOpen: false,
        maxCapacity: 150,
        status: EventStatus.COMPLETED,
        organizer: adminUser._id,
      },
    ];

    for (const ev of eventsData) {
      await Event.findOneAndUpdate(
        { slug: ev.slug },
        { $set: ev },
        { upsert: true, new: true }
      );
    }
    logger.info("✅ Original website events seeded successfully.");

    // Seed Real Original Website Announcements & Achievements
    const announcementsData = [
      {
        title: "MMIT IEEE Team Receives IEEE Pune Section Awards 2025",
        content: "Congratulations to Dr. Monika Dangore, Dr. Subhash Rathod, and student members for receiving IEEE Pune Section Honors for outstanding leadership and technical contribution.",
        category: "Achievement",
        isImportant: true,
        postedBy: adminUser._id,
      },
      {
        title: "IEEE ICCMRAI-2026 International Conference Hosted by MMIT",
        content: "MMIT IEEE Student Branch is proud to host the upcoming IEEE ICCMRAI-2026 conference featuring research paper submissions and IEEE Xplore indexing.",
        category: "Conference",
        isImportant: true,
        postedBy: adminUser._id,
      },
      {
        title: "Field2Frame: National Level Field Research Documentary Challenge",
        content: "MMIT IEEE SB hosted the final round of Field2Frame Documentary Challenge sponsored by IEEE Pune Section.",
        category: "Competition",
        isImportant: false,
        postedBy: adminUser._id,
      },
    ];

    for (const ann of announcementsData) {
      await Announcement.findOneAndUpdate(
        { title: ann.title },
        { $set: ann },
        { upsert: true, new: true }
      );
    }
    logger.info("✅ Original website achievements and announcements seeded successfully.");

    logger.info("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
