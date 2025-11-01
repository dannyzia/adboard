# adboard — Architecture & File Reference

This document summarizes where key code pieces live in the repository so you (or a new developer) can quickly find models, routes, frontend components, and configuration.

---

## 1) Database / Schema files (Mongoose)

Location: `backend/models/`

- `backend/models/Ad.model.js` — Main Ad / Listing model. Stores title, description, price, currency, category, location, images, user reference, expiresAt, views, favoritedBy, and other listing metadata.
- `backend/models/User.model.js` — User model. Authentication fields, profile, subscription info, favorites, etc.
- `backend/models/PaymentTransaction.model.js` — Records payment transactions (payment gateway, amounts, status).
- `backend/models/SubscriptionPlan.model.js` — Subscription plans and features used to determine listing limits and features.

Auction-related schemas:
- There is no dedicated `Auction` model file in `backend/models/` (no `Auction.model.js` found).
- Auction-like fields (e.g., `auctionEnd`, `startingBid`, `reservePrice`) are included in the dynamic `form-config` and handled within the `Ad` model and routes when relevant. See `backend/config/form-config.json` for category fields and `backend/routes/ad.routes.js` for behavior around creating/updating ads.

---

## 2) Backend API files (routes & controllers)

Location: `backend/routes/`

Key route files and responsibilities:

- `backend/routes/ad.routes.js` — All ad/listing endpoints (GET list, GET single, POST create, PUT update, DELETE, favorites, similar ads, user ads). Many of the controller actions (DB queries / validation) are implemented inline in this file.
- `backend/routes/auth.routes.js` — Authentication endpoints (login, logout, callbacks, token handling).
- `backend/routes/user.routes.js` — User endpoints (profile, update, etc.).
- `backend/routes/upload.routes.js` — Handles file/image uploads (Cloudinary integration is configured in `backend/config/cloudinary.config.js`).
- `backend/routes/payment.routes.js` — Payment endpoints used to process transactions.
- `backend/routes/subscription.routes.js` — Manage subscriptions and plans.
- `backend/routes/category.routes.js`, `backend/routes/location.routes.js`, `backend/routes/admin.routes.js` — Other domain-specific routes.

Controller organization:
- Many route handlers currently contain their controller logic directly in the route files (for example `ad.routes.js`).
- There are also `services/` modules (e.g., `backend/services/location.service.js`) that contain reusable logic. If you prefer, you can refactor route handlers into a dedicated `controllers/` folder for clearer separation.

Entry point and server config:
- `backend/server.js` — Express server entry point. Loads configuration, mounts routes, and starts the HTTP server.

---

## 3) Frontend components (React + Vite)

Location: `src/` (React + TypeScript)

Key pages & components:

- `src/pages/PostAdPage.tsx` — Ad creation form (dynamic fields fetched from `GET /api/form-config`).
- `src/pages/AdDetailPage.tsx` — Page that shows a single ad/listing details.
- `src/pages/UserDashboardPage.tsx` — User dashboard / management area (user's ads, profile, etc.).
- `src/pages/AdminAdsPage.tsx` and other admin pages — Admin management views.

Reusable components & hooks:
- `src/components/forms/ImageUploadZone.tsx` — Image uploader UI used on the Post Ad form.
- `src/components/layout/Navbar.tsx` — Top navigation bar used across pages.
- `src/context/` and `src/hooks/` — React context and custom hooks (e.g., `useAuth`, `useAds`) used for app state and API interaction.
- `src/services/` — Frontend API wrapper services for interacting with backend endpoints (ads, auth, uploads, payments).

Notes:
- The Post Ad form renders category-specific fields dynamically using `backend/config/form-config.json`. Currency/Price/PriceType rendering is coordinated between the frontend and the config.

---

## 4) Config files

Backend config directory: `backend/config/`

- `backend/config/form-config.json` — Dynamic form configuration for categories and their fields (used by the Post Ad form).
- `backend/config/categories.config.js` — Category constants / seed data.
- `backend/config/locations.config.js` and `backend/config/locations.constants.js` (in instructions area) — Location constants and helper data.
- `backend/config/cloudinary.config.js` — Cloudinary upload configuration.
- `backend/config/passport.config.js` — Passport / OAuth configuration.

Environment variables and connection config
- Database connection is controlled by environment variables (e.g., `MONGODB_URI`). The backend uses these in `backend/server.js` (and possibly `backend/config/*` helpers).
- See `backend/SETUP_GUIDE.md`, `.env.example` (if present) and `BACKEND/README.md` for required env vars. From sessions we typically use:
  - `MONGODB_URI` — MongoDB connection string
  - `NODE_ENV` — environment (development/production)
  - Cloudinary and OAuth credentials (if using uploads / social login)

Frontend config
- `src/config/` and `vite.config.ts` (or `vite.config.js`)— frontend build and environment wiring. Vite uses `import.meta.env` for env variables; check `frontend` scripts in `package.json`.

---

## 5) Project structure (top-level overview)

Root layout (abridged):

- `backend/`
  - `server.js` — Express entry point
  - `package.json` — backend dependencies + scripts
  - `config/` — JSON and JS configuration files (form-config.json, cloudinary, locations, etc.)
  - `models/` — Mongoose models (Ad.model.js, User.model.js, SubscriptionPlan.model.js, PaymentTransaction.model.js)
  - `routes/` — Express route definitions (ad.routes.js, auth.routes.js, payment.routes.js, etc.)
  - `services/` — server-side helper/services
  - `utils/`, `middleware/` — utilities and middleware (auth middleware, etc.)
  - `scripts/` — seed scripts (seedAds.js, seedDatabase.js, seedLocations.js)

- `src/` (frontend)
  - `main.tsx`, `App.tsx` — React entry
  - `pages/` — major pages (PostAdPage.tsx, AdDetailPage.tsx, UserDashboardPage.tsx, admin pages)
  - `components/` — small reusable UI components (forms, layout)
  - `hooks/` — custom React hooks (`useAds`, `useAuth`, etc.)
  - `services/` — frontend API wrappers
  - `context/` — React context providers
  - `types/`, `utils/` — type definitions and utilities

- Top-level docs and configs
  - `package.json` — workspace-level scripts
  - `README.md`, `SETUP_COMPLETE.md`, `DEPLOYMENT_GUIDE.md`, `CLOUDINARY_SETUP.md` — project docs
  - `vite.config.ts`, `tsconfig.json`, `tailwind.config.js` — build and styling configs

---

## 6) Where to look for specific behaviors

- Ad creation / validation: `backend/routes/ad.routes.js` (server-side validation, subscription limits, expiration handling).
- Dynamic form schema: `backend/config/form-config.json` — controls which fields appear for each category.
- Currency, location lists: `backend/config/locations.config.js` and frontend calls to `/api/currencies`.
- Image upload: `backend/routes/upload.routes.js` + `backend/config/cloudinary.config.js` and `src/components/forms/ImageUploadZone.tsx`.

---

## 7) If you'd like, I can:
- Generate a JSON report of which categories include `price`, `priceType`, and `condition` (I already produced this in-session).
- Add a developer checklist for making a new category or adding/removing fields from the dynamic form.
- Create a small controller refactor plan (move route handlers into `backend/controllers/ad.controller.js`) to improve testability.

Tell me which follow-up you want and I will make the edits/outputs and add them to the repo.
