# 🌐 MMIT IEEE Student Branch Platform

> Enterprise-Grade Digital Platform & Integrated CMS Governance System for MMIT IEEE Student Branch (STB99311, Pune Section).

---

## 🗺 Quick Table of Contents

- [⚙️ Section 1: Developer & Local Technical Operations](#️-section-1-developer--local-technical-operations)
  - [1.1 Monorepo Architecture](#11-monorepo-architecture)
  - [1.2 Technology Stack](#12-technology-stack)
  - [1.3 Directory Layout](#13-directory-layout)
  - [1.4 Local Environment & Server Setup](#14-local-environment--server-setup)
  - [1.5 Database Seeding](#15-database-seeding)
  - [1.6 Swagger Visual API Documentation](#16-swagger-visual-api-documentation)
- [🔑 Section 2: Site Manager CMS Operating Manual](#-section-2-site-manager-cms-operating-manual)
  - [2.1 Accessing the CMS Governance Portal](#21-accessing-the-cms-governance-portal)
  - [2.2 Managing Landing Page Hero Slideshow](#22-managing-landing-page-hero-slideshow)
  - [2.3 Managing Executive Committee Members & Roles](#23-managing-executive-committee-members--roles)
  - [2.4 Role-Based Access Control (RBAC) & Permissions](#24-role-based-access-control-rbac--permissions)
  - [2.5 Managing Technical Events & Workshops](#25-managing-technical-events--workshops)
  - [2.6 Announcements & Urgent Ticker Alerts](#26-announcements--urgent-ticker-alerts)
  - [2.7 Audit Security Logs](#27-audit-security-logs)
- [🚀 Section 3: Production Deployment & Maintenance](#-section-3-production-deployment--maintenance)

---

# ⚙️ Section 1: Developer & Local Technical Operations

### 1.1 Monorepo Architecture

The platform uses an **npm Workspaces Monorepo Architecture** separating the Next.js frontend, Express backend, and shared TypeScript schemas.

```
mmit-ieee-platform/
├── apps/
│   ├── frontend/            # Next.js 14 App Router Application (Port 3000)
│   └── backend/             # Node.js + Express TypeScript API (Port 5000)
├── packages/
│   └── shared/              # Shared Zod Schemas & DTO Interfaces
├── package.json             # Root monorepo configuration
└── README.md
```

---

### 1.2 Technology Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS (`#00629B` IEEE Blue), Framer Motion, Vanta 3D WebGL, TanStack Query, Axios.
- **Backend**: Node.js, Express.js (Layered Architecture: Routes → Middlewares → Controllers → Services → Models), Mongoose ODM, Winston Logger.
- **Database & CDN**: MongoDB Atlas Cloud, Cloudinary CDN.
- **Authentication & Security**: Dual JWT Tokens (`accessToken` 15m + `refreshToken` 7d in `httpOnly` cookies), Helmet CSP headers, CORS, Rate Limiter (`express-rate-limit`).

---

### 1.3 Directory Layout

```
apps/backend/src/
├── config/        # Env Zod validation, Logger, MongoDB connection
├── controllers/   # Auth, Events, Roles, HeroSlide, Committee controllers
├── errors/        # AppError classes
├── middlewares/   # AuthGuard, RBACGuard, RateLimiter, ErrorHandler
├── models/        # User, Role, Event, HeroSlide, ExecutiveCommittee models
├── routes/        # Express API endpoints & Swagger docs route
├── scripts/       # Database seeder (`seed.ts`)
└── services/      # Core business logic layer

apps/frontend/src/
├── app/           # Public pages & Protected CMS management pages
├── components/    # GlassCard, HeroCarousel, ImageUploader, VantaNet
└── lib/           # Axios API instance with Bearer token & refresh interceptors
```

---

### 1.4 Local Environment & Server Setup

#### Prerequisites
- Node.js v18.x or higher
- npm v9.x or higher

#### Environment File Configuration

1. **Backend Configuration (`apps/backend/.env`)**:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/mmit_ieee_db?retryWrites=true&w=majority

   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   SEED_ADMIN_EMAIL=admin@example.com
   SEED_ADMIN_PASSWORD=your_secure_password
   ```

2. **Frontend Configuration (`apps/frontend/.env.local`)**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

#### Launching Servers
```bash
# Terminal 1: Run Backend API Server (Port 5000)
npm run dev:backend

# Terminal 2: Run Frontend Next.js App (Port 3000)
npm run dev:frontend
```

---

### 1.5 Database Seeding

To initialize standard system roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `EXECUTIVE_MEMBER`, `STUDENT_MEMBER`), default SuperAdmin credentials, and sample site events/slides, run:

```bash
npm run seed --workspace=apps/backend
```

---

### 1.6 Swagger Visual API Documentation

Access the visual interactive Swagger UI documentation at:
- **URL**: [http://localhost:5000/api-docs/docs](http://localhost:5000/api-docs/docs)

---

# 🔑 Section 2: Site Manager CMS Operating Manual

---

### 2.1 Accessing the CMS Governance Portal

1. Go to **[http://localhost:3000/cms/login](http://localhost:3000/cms/login)**.
2. Sign in with your administrator email and password.
3. Upon authentication, you will access the **CMS Dashboard** (`/cms/dashboard`).

---

### 2.2 Managing Landing Page Hero Slideshow

Location: **CMS Dashboard → Hero Slides (`/cms/slideshow`)**

The landing page slideshow uses a **50/50 Split Layout** (Headline description on the left 50%, interactive banner on the right 50%).

#### To Add a Slide:
1. Navigate to `/cms/slideshow`.
2. Fill in:
   - **Headline Title**: e.g., *Industrial Visit to PARAM Supercomputer*
   - **Category Tag**: e.g., *Flagship Industrial Visit*
   - **Subtitle Summary**: Brief 2-3 sentence overview.
   - **Action Button Link**: e.g., `/events` or external registration URL.
   - **Banner Image**: Upload an image file via Cloudinary CDN or paste a direct image URL under the `Image URL / Link` tab.
3. Click **Add Hero Slide**.

#### To Delete a Slide:
* Click the trash icon on any slide card to remove it from the homepage.

---

### 2.3 Managing Executive Committee Members & Roles

Location: **CMS Dashboard → Committee (`/cms/committee`)**

Manage student branch leadership displayed on the public **Executive Committee Roster** (`/committee`) and landing page leadership section.

#### To Add a Member:
1. Navigate to `/cms/committee`.
2. Fill in:
   - **Full Name**: e.g., *Student Leader Name*
   - **Designation / Role**: e.g., *Student Branch Chair*, *Vice Chair*, *Secretary*, *Treasurer*, *Webmaster*
   - **Category**: Select `MEMBER`, `FACULTY`, `LEAD`, or `MENTOR`
   - **Profile Photo**: Upload an image file or paste an image URL.
   - **Short Bio**: Brief introduction.
3. Click **Add Member**.

#### To Delete a Member:
* Click the trash icon next to the member record.

---

### 2.4 Role-Based Access Control (RBAC) & Permissions

Location: **CMS Dashboard → Roles Governance (`/cms/roles`)**

- **Built-in System Roles**: `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `EXECUTIVE_MEMBER`, `STUDENT_MEMBER` (Protected from deletion).
- **Custom Admin Roles**: Site managers can create custom roles and toggle specific permission checkboxes (`EVENTS_CREATE`, `HERO_SLIDES_MANAGE`, `ROLES_MANAGE`, etc.).

---

### 2.5 Managing Technical Events & Workshops

Location: **CMS Dashboard → Events (`/cms/events`)**

Publish new workshops, hackathons, and guest lectures:
- **Title, Slug, and Description**
- **Event Date, Time, Venue, and Capacity**
- **Registration Status**: `UPCOMING`, `ONGOING`, `COMPLETED`
- **Cover Image & Registration Link**

---

### 2.6 Announcements & Urgent Ticker Alerts

Location: **CMS Dashboard → Announcements (`/cms/announcements`)**

Publish banner notices across the top of the website (e.g., *"IEEE Paper Submissions Open until Aug 15"*).

---

### 2.7 Audit Security Logs

Location: **CMS Dashboard → Audit Security Logs (`/cms/audit-logs`)**

View an immutable real-time activity log of all mutations (content creations, deletions, role updates) with user timestamps and IP addresses.

---

# 🚀 Section 3: Production Deployment & Maintenance

| Service Component | Infrastructure Target | Configuration Notes |
| :--- | :--- | :--- |
| **Frontend** | Vercel Edge Network | Set `NEXT_PUBLIC_API_URL` to production backend API URL |
| **Backend API** | Render Web Services | Build Command: `npm run build:shared && npm run build:backend` |
| **Database** | MongoDB Atlas Cloud | M0 Shared Cluster with IP Whitelisting (`0.0.0.0/0`) |
| **CDN Storage** | Cloudinary CDN | Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
