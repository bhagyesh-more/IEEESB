import { Router, Request, Response } from "express";

const router = Router();

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "MMIT IEEE Student Branch Platform Backend API",
    version: "2.0.0",
    description:
      "Enterprise RESTful API documentation for MMIT IEEE Student Branch (STB99311, Pune Section). Features Dual-Token JWT Auth, Granular RBAC, Events, Announcements, Hero Slideshow, Media Uploads, and Audit Logging.",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "API Health Check",
        tags: ["System"],
        responses: {
          "200": { description: "API operational and database connected" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "User Login & JWT Token Generation",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                  password: { type: "string", example: "your_password" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Returns Access Token & httpOnly Refresh Cookie" },
        },
      },
    },
    "/hero-slides/public": {
      get: {
        summary: "Get Public Landing Page Hero Slides",
        tags: ["Public Website"],
        responses: {
          "200": { description: "Array of active hero slides" },
        },
      },
    },
    "/hero-slides": {
      get: {
        summary: "List All Hero Slides (Admin)",
        tags: ["CMS Hero Slides"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "All hero slides" } },
      },
      post: {
        summary: "Create Landing Page Hero Slide",
        tags: ["CMS Hero Slides"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  subtitle: { type: "string" },
                  tag: { type: "string" },
                  imageUrl: { type: "string" },
                  linkHref: { type: "string" },
                  linkText: { type: "string" },
                  order: { type: "integer" },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created slide" } },
      },
    },
    "/roles": {
      get: {
        summary: "List All RBAC Roles (Admin)",
        tags: ["CMS Role Governance"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Roles and permissions" } },
      },
      post: {
        summary: "Create Custom Role",
        tags: ["CMS Role Governance"],
        security: [{ BearerAuth: [] }],
        responses: { "201": { description: "Created role" } },
      },
    },
    "/events": {
      get: {
        summary: "Get Events Catalog",
        tags: ["Events"],
        responses: { "200": { description: "List of published events" } },
      },
      post: {
        summary: "Create Event (Admin)",
        tags: ["Events"],
        security: [{ BearerAuth: [] }],
        responses: { "201": { description: "Created event" } },
      },
    },
    "/announcements": {
      get: {
        summary: "Get Announcements",
        tags: ["Announcements"],
        responses: { "200": { description: "List of announcements" } },
      },
    },
    "/audit-logs": {
      get: {
        summary: "View Security Audit Trail (Admin)",
        tags: ["Security Audit"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Audit log entries" } },
      },
    },
  },
};

router.get("/docs.json", (req: Request, res: Response) => {
  res.json(openApiSpec);
});

router.get("/docs", (req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MMIT IEEE SB API Visual Explorer</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0f172a; }
    .swagger-ui { background: #0f172a; color: #f8fafc; }
    .swagger-ui .topbar { background-color: #00629b; }
    .swagger-ui .info .title { color: #38bdf8; }
    .swagger-ui .scheme-container { background: #1e293b; color: #f8fafc; }
    .swagger-ui .opblock .opblock-summary-method { font-weight: bold; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
      });
    };
  </script>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
