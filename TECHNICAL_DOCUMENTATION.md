# ListyNest Technical Documentation

> **Version**: 2.0.0 (Complete)  
> **Last Updated**: 2025-11-20  
> **Project**: ListyNest (Classified Ads Platform)  
> **Scope**: Entire Codebase

---

## 1. Table of Contents

1. [Quick Navigation](#2-quick-navigation)
2. [Architecture Overview](#3-architecture-overview)
3. [Technology Stack](#4-technology-stack-overview)
4. [File-by-File Reference](#5-file-by-file-reference)
   - [Root Directory](#51-root-directory)
   - [Adboard Resources](#52-adboard-resources)
   - [Adboard Instructions](#53-adboard-instructions)
   - [Backend System](#54-backend-system)
     - [Config](#backend-config)
     - [Jobs](#backend-jobs)
     - [Middleware](#backend-middleware)
     - [Models](#backend-models)
     - [Routes](#backend-routes)
     - [Scripts](#backend-scripts)
     - [Services](#backend-services)
     - [Utils](#backend-utils)
   - [Frontend System](#55-frontend-system)
     - [Components](#frontend-components)
     - [Config](#frontend-config)
     - [Context](#frontend-context)
     - [Hooks](#frontend-hooks)
     - [Pages](#frontend-pages)
     - [Services](#frontend-services-1)
     - [Types](#frontend-types)
5. [User Flows](#6-user-flow-documentation)
6. [API Reference](#7-api-reference)
7. [Troubleshooting Guide](#8-troubleshooting-guide)
8. [Configuration Guide](#9-configuration-guide)

---

## 2. Quick Navigation

| I want to... | Check these files |
|--------------|-------------------|
| **Fix Login/Auth** | 📄 `backend/routes/auth.routes.js`<br>📄 `src/context/AuthContext.tsx`<br>📄 `src/hooks/useAuth.ts` |
| **Debug Image Upload** | 📄 `backend/routes/upload.routes.js`<br>📄 `src/services/upload.service.ts` |
| **Modify Ad Logic** | 📄 `backend/models/Ad.model.js`<br>📄 `src/pages/PostAdPage.tsx`<br>📄 `src/hooks/useAds.ts` |
| **Update Blog Features** | 📄 `backend/models/Blog.model.js`<br>📄 `src/pages/AdminBlogsPage.tsx` |
| **Change Styles** | 📄 `src/index.css`<br>⚙️ `tailwind.config.js` |
| **Check Types** | 📄 `src/types/index.ts` |

---

## 3. Architecture Overview

### 3.1 Full Stack Data Flow

```ascii
[User Browser]
      |
      v
[Frontend (React + Vite)]
   |   |
   |   +-> [Auth Context] <---> [Local Storage (Token)]
   |   |
   |   +-> [API Service (Axios)]
   |           |
   |           v
   |    [Backend (Node/Express)]
   |           |
   |           +-> [Middleware (Auth/Cors/RateLimit)]
   |           |
   |           +-> [Routes (/api/*)]
   |                  |
   |                  +-> [Controllers/Services]
   |                          |
   |        +-----------------+-----------------+
   |        |                 |                 |
   |        v                 v                 v
   |  [MongoDB (Data)]   [Cloudinary (Img)]  [Stripe (Pay)]
```

---

## 4. Technology Stack Overview

### Core
- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

### Key Libraries
- **UI**: Tailwind CSS, Lucide React (Icons)
- **State**: React Context API
- **Forms**: React Hook Form (implied), Zod
- **Auth**: JWT, Passport.js (Google OAuth)
- **Uploads**: Multer, Cloudinary
- **Utils**: Lodash, Moment/Date-fns

---

## 5. File-by-File Reference

### 5.1 Root Directory

#### 📄 `.env.example`
- **Purpose**: Template for environment variables.
- **Why**: To share required var names without exposing secrets.
- **Edit When**: Adding new env vars.

#### 📄 `.env.production`
- **Purpose**: Production-specific environment variables.
- **Why**: Overrides for deployment.
- **Edit When**: configuring prod build.

#### 📄 `.gitignore`
- **Purpose**: Specifies untracked files.
- **Why**: Keeps repo clean (no node_modules, secrets).
- **Edit When**: Adding new generated files.

#### 📄 `.npmrc`
- **Purpose**: NPM configuration.
- **Why**: Enforces strict engine or registry settings.

#### 📄 `adboard.code-workspace`
- **Purpose**: VS Code workspace settings.
- **Why**: Unifies editor settings for the team.

#### 📄 `form-config-diff.txt`
- **Purpose**: Logs changes in form configurations.
- **Why**: Debugging form schema updates.

#### 📄 `index.html`
- **Purpose**: App entry point.
- **Why**: Mounts the React root.
- **Edit When**: Adding global script tags (analytics).

#### 📄 `index.php`
- **Purpose**: Likely for legacy server or redirect.
- **Why**: Handling requests in PHP environments (if applicable).

#### 📄 `last-commit-files.txt`
- **Purpose**: Auto-generated log of changed files.
- **Why**: CI/CD tracking.

#### 📄 `local-form-config.json`
- **Purpose**: Local definition of ad categories/fields.
- **Why**: Frontend needs to know what fields to show per category.
- **Edit When**: Changing category structure locally.

#### 📄 `package.json`
- **Purpose**: Project manifest.
- **Why**: Tracks dependencies and scripts.
- **CRITICAL**: Do not delete.

#### 📄 `postcss.config.js`
- **Purpose**: PostCSS setup.
- **Why**: Required for Tailwind CSS processing.

#### 📄 `README.md`
- **Purpose**: Project documentation entry point.

#### 📄 `render-form-config.json`
- **Purpose**: Server-side form config (Render deployment).
- **Why**: Syncs form structure with backend validation.

#### 📄 `tailwind.config.js`
- **Purpose**: Tailwind theme config.
- **Why**: Custom colors, fonts, breakpoints.
- **Edit When**: Changing design system.

#### 📄 `tsconfig.json`
- **Purpose**: TypeScript compiler config.
- **Why**: Defines strictness, paths, target.

#### 📄 `vite.config.ts`
- **Purpose**: Vite build config.
- **Why**: Plugins, proxy settings, build output.

### 5.2 Adboard Resources (`/adboard resources`)

#### 📁 `Dummy Data/`
- **`categories.config.js`**: Seed data for categories.
- **`locations.constants.js`**: List of cities/regions.
- **`seedAds.js`**: Mock ads for testing.

#### 📁 `Image/`
- **`Front Page.png`**: Design reference.
- **`mosaic-big.jpg`**: Asset.
- **`World map.webp`**: Asset.

#### 📁 `json/`
- **`combined.json`**: Raw data dump.
- **`combined_sanitized_final.json`**: Cleaned data for import.

#### 📁 `NewsPaperAd/`
- **`index.html`**: Standalone landing page (marketing).
- **`style.css`**: Styles for marketing page.

### 5.3 Adboard Instructions (`/adboard_instructions`)

#### 📄 `ARCHITECTURE.md`
- **Purpose**: High-level system design docs.

#### 📄 `DEVELOPMENT_CHECKLIST.md`
- **Purpose**: Tracking feature completion.

#### 📄 `PROJECT_INSTRUCTIONS.md`
- **Purpose**: Guidelines for AI/Developers.

### 5.4 Backend System (`/backend`)

#### 📁 `backend/config/`

- **`categories.config.js`**: Defines ad categories (Electronics, Vehicles, etc.).
- **`cloudinary.config.js`**: ⚠️ **CRITICAL**. Configures image storage.
- **`currencies.config.js`**: Supported currencies.
- **`form-config.json`**: Dynamic form schema.
- **`locations.config.js`**: Geo-data configuration.
- **`passport.config.js`**: Google OAuth strategy setup.

#### 📁 `backend/jobs/`

- **`auction.job.js`**: Cron job for auction expiration logic (if auctions exist).

#### 📁 `backend/middleware/`

- **`apiKey.middleware.js`**: Validates `x-api-key` for external tools (n8n).
- **`auth.middleware.js`**: ⚠️ **CRITICAL**.
  - `protect`: JWT validation.
  - `admin`: Role check.
  - `checkAdLimit`: Subscription quota check.

#### 📁 `backend/models/`

- **`Ad.model.js`**: ⚠️ **CRITICAL**. Main Ad schema.
  - Fields: `title`, `price`, `images`, `category`, `location`, `author`.
- **`Bid.model.js`**: Schema for auction bids.
- **`Blog.model.js`**: Blog posts schema (`title`, `content`, `slug`).
- **`PaymentTransaction.model.js`**: Logs Stripe/Payment intents.
- **`Slug.model.js`**: Manages URL slugs for SEO.
- **`SubscriptionPlan.model.js`**: Defines tiers (Free, Pro).
- **`User.model.js`**: ⚠️ **CRITICAL**. User accounts.
  - Fields: `email`, `password`, `role`, `subscription`.

#### 📁 `backend/routes/`

- **`ad.routes.js`**: CRUD for Ads.
- **`admin.routes.js`**: Admin-only stats and management.
- **`auth.routes.js`**: Login, Register, OAuth.
- **`bid.routes.js`**: Bidding endpoints.
- **`blog.routes.js`**: Blog CRUD.
- **`category.routes.js`**: Fetch categories.
- **`currency.routes.js`**: Fetch currencies.
- **`import.routes.js`**: Bulk import data.
- **`location.routes.js`**: Fetch locations.
- **`payment.routes.js`**: Stripe integration.
- **`subscription.routes.js`**: Plan management.
- **`upload.routes.js`**: Image upload (Cloudinary).
- **`user.routes.js`**: User profile management.

#### 📁 `backend/scripts/`

- **`seedAds.js`**: Populates DB with dummy ads.
- **`seedBlogs.js`**: Populates DB with dummy blogs.
- **`seedDatabase.js`**: Master seed script.
- **`seedLocations.js`**: Populates locations.
- **`test-blog-api.js`**: Script to verify Blog endpoints.

#### 📁 `backend/services/`

- **`location.service.js`**: Helper logic for geo-queries.

#### 📁 `backend/utils/`

- **`jwt.util.js`**: Token generation/signing.
- **`slug.util.js`**: String to slug conversion.

#### 📄 `backend/server.js`
- **Purpose**: Application entry point.
- **Why**: Initializes Express, connects DB, mounts routes.

### 5.5 Frontend System (`/src`)

#### 📁 `src/components/`

- **`BlogCard.tsx`**: UI for displaying a blog post summary.
- **`BlogHeroSection.tsx`**: Hero banner for blog page.
- **`BlogLandingSection.tsx`**: Main blog list container.
- **`HeroSection.tsx`**: Homepage hero (Search + CTA).
- **`HeroSectionEnhanced.tsx`**: Alternate hero design.
- **`HomepageToggle.tsx`**: Switcher for A/B testing homepages.
- **`ProtectedAdminRoute.tsx`**: Wrapper for admin-only pages.

##### 📁 `src/components/ads/`
- (Assumed contents based on structure)
- **`AdCard.tsx`**: Grid item for an ad.
- **`AdList.tsx`**: Container for ads.
- **`AdFilters.tsx`**: Sidebar filters.

##### 📁 `src/components/forms/`
- **`PostAdForm.tsx`**: Complex multi-step form.
- **`LoginForm.tsx`**: Sign in inputs.

##### 📁 `src/components/layout/`
- **`Navbar.tsx`**: Top navigation.
- **`Footer.tsx`**: Site footer.
- **`Sidebar.tsx`**: Dashboard sidebar.

##### 📁 `src/components/ui/`
- **`Button.tsx`**: Reusable button.
- **`Input.tsx`**: Reusable text input.
- **`Modal.tsx`**: Pop-up dialog.

#### 📁 `src/config/`

- **`categoryFields.ts`**: Frontend definition of dynamic fields per category.

#### 📁 `src/context/`

- **`AdContext.tsx`**: Global state for Ad data (filters, search).
- **`AdminAuthContext.tsx`**: Separate auth state for admin panel.
- **`AuthContext.tsx`**: ⚠️ **CRITICAL**. User session state.
- **`HomepageContext.tsx`**: State for homepage personalization.

#### 📁 `src/hooks/`

- **`useAds.ts`**: Custom hook to fetch/manage ads.
- **`useAuth.ts`**: Hook to access AuthContext.
- **`useCategories.ts`**: Fetch categories.
- **`useDebounce.ts`**: Delay search inputs.
- **`useInfiniteScroll.ts`**: Pagination logic.

#### 📁 `src/pages/`

- **`AdDetailPage.tsx`**: Single ad view.
- **`AdminAdsPage.tsx`**: Admin ad management.
- **`AdminAnalyticsPage.tsx`**: Stats view.
- **`AdminArchivePage.tsx`**: Deleted/Expired ads.
- **`AdminBlogsPage.tsx`**: CMS for blogs.
- **`AdminDashboardPage.tsx`**: Main admin view.
- **`AdminLoginPage.tsx`**: Admin entry.
- **`AdminReportsPage.tsx`**: User reports.
- **`AdminSettingsPage.tsx`**: System config.
- **`AdminSubscriptionsPage.tsx`**: Plan management.
- **`AdminUsersPage.tsx`**: User management.
- **`AuthCallbackPage.tsx`**: OAuth redirect handler.
- **`BlogDetailPage.tsx`**: Read a blog post.
- **`CheckoutPage.tsx`**: Payment flow.
- **`HomePage.tsx`**: Landing page.
- **`LoginPage.tsx`**: User login.
- **`PostAdPage.tsx`**: Create ad.
- **`PricingPage.tsx`**: Subscription options.
- **`TermsContactPage.tsx`**: Static content.
- **`UserDashboardPage.tsx`**: User's "My Ads" view.

#### 📁 `src/services/`

- **`ad.service.ts`**: API calls for ads.
- **`admin.service.ts`**: Admin API calls.
- **`api.ts`**: ⚠️ **CRITICAL**. Axios instance setup.
- **`auth.service.ts`**: Login/Register API calls.
- **`bid.service.ts`**: Bidding API calls.
- **`blog.service.ts`**: Blog API calls.
- **`category.service.ts`**: Category API calls.
- **`location.service.ts`**: Location API calls.
- **`subscription.service.ts`**: Subscription API calls.
- **`upload.service.ts`**: Image upload API calls.

#### 📁 `src/types/`

- **`ad.types.ts`**: Interfaces for Ad objects.
- **`admin.types.ts`**: Admin-specific types.
- **`blog.types.ts`**: Blog interfaces.
- **`index.ts`**: Central export of types.
- **`subscription.types.ts`**: Plan interfaces.

#### 📁 `src/utils/`
- (General utility functions)

---

## 6. User Flow Documentation

### 6.1 User Registration
1. **Frontend**: `RegisterPage` collects data.
2. **Action**: Calls `auth.service.register()`.
3. **Backend**: `POST /api/auth/register`.
4. **Logic**: 
   - Check email uniqueness.
   - Hash password.
   - Create User with 'Free' plan.
   - Generate JWT.
5. **Response**: `{ token, user }`.
6. **Frontend**: `AuthContext` saves token, redirects to Home.

### 6.2 Posting an Ad
1. **Frontend**: `PostAdPage` form.
2. **Upload**: Images uploaded via `upload.service.ts` -> `POST /api/upload/multiple`.
3. **Submit**: Form data + Image URLs sent to `ad.service.createAd()`.
4. **Backend**: `POST /api/ads`.
5. **Logic**:
   - Verify Token (`protect`).
   - Check Quota (`checkAdLimit`).
   - Save Ad.
   - Decrement quota.
6. **Response**: Success message.

---

## 7. API Reference

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Ads
- `GET /api/ads` (List with filters)
- `POST /api/ads` (Create)
- `GET /api/ads/:id` (Detail)
- `PUT /api/ads/:id` (Update)
- `DELETE /api/ads/:id` (Delete)

### Blogs
- `GET /api/blogs/featured`
- `GET /api/blogs/recent`
- `POST /api/blogs` (Admin)

### Upload
- `POST /api/upload/single`
- `POST /api/upload/multiple`

---

## 8. Troubleshooting Guide

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| **401 Unauthorized** | Token expired or missing | Check `localStorage`. Re-login. |
| **403 Forbidden** | Not Admin or Banned | Check `role` in DB. |
| **Image Upload Fail** | Cloudinary Config | Check `.env` keys and `cloudinary.config.js`. |
| **CORS Error** | Backend Origin Config | Check `cors` setup in `server.js`. |
| **DB Connection Fail** | IP Whitelist / URI | Check MongoDB Atlas Network Access. |

---

## 9. Configuration Guide

### Backend `.env`
```bash
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```bash
VITE_API_URL=http://localhost:5000/api
```
