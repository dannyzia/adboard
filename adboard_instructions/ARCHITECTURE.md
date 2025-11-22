# AdBoard - Architecture & System Design

> Complete architecture overview, file structure, and system design documentation

**Version:** 1.0  
**Last Updated:** January 2025

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [File Organization](#file-organization)
7. [Configuration Files](#configuration-files)
8. [Data Flow](#data-flow)
9. [Security Architecture](#security-architecture)

---

## System Architecture

### High-Level Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend API   │         │   Database      │
│   (React/Vite)  │◄───────►│   (Express)     │◄───────►│   (MongoDB)     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │                           │
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Cloudinary    │         │   Stripe API    │         │   AWS S3/       │
│   (Images)      │         │   (Payments)    │         │   Glacier      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router v6 (routing)
- Axios (HTTP client)
- React Hook Form (forms)
- Context API (state management)

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT (authentication)
- Multer (file uploads)
- Stripe SDK (payments)

**External Services:**
- Cloudinary (image storage)
- Stripe (payment processing)
- AWS S3/Glacier (archive storage)

---

## Project Structure

### Complete Folder Structure

```
adboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/                          # Frontend (React + TypeScript)
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── ads/
│   │   │   ├── AdCard.tsx
│   │   │   ├── AdGrid.tsx
│   │   │   ├── AdFilters.tsx
│   │   │   ├── AdDetail.tsx
│   │   │   └── InfiniteScrollContainer.tsx
│   │   ├── forms/
│   │   │   ├── PostAdForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   └── LocationSelector.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── MyAdsList.tsx
│   │   │   └── AdRow.tsx
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminStatsCard.tsx
│   │       └── AdManagementTable.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AdDetailPage.tsx
│   │   ├── PostAdPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PricingPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminAdsPage.tsx
│   │       ├── AdminUsersPage.tsx
│   │       └── AdminArchivePage.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AdContext.tsx
│   ├── hooks/
│   │   ├── useInfiniteScroll.ts
│   │   ├── useAuth.ts
│   │   ├── useAds.ts
│   │   └── useDebounce.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── ad.service.ts
│   │   ├── upload.service.ts
│   │   └── payment.service.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── ad.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   ├── config/
│   │   └── api.config.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── backend/                      # Backend (Node.js + Express)
│   ├── models/
│   │   ├── Ad.model.js
│   │   ├── User.model.js
│   │   ├── SubscriptionPlan.model.js
│   │   ├── PaymentTransaction.model.js
│   │   ├── AuditLog.model.js
│   │   └── ArchiveMetadata.model.js
│   ├── routes/
│   │   ├── ad.routes.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── upload.routes.js
│   │   ├── payment.routes.js
│   │   ├── subscription.routes.js
│   │   ├── category.routes.js
│   │   ├── location.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── ad.controller.js
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   ├── location.service.js
│   │   ├── archive.service.js
│   │   └── stripe.service.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── config/
│   │   ├── form-config.json
│   │   ├── categories.config.js
│   │   ├── locations.config.js
│   │   ├── cloudinary.config.js
│   │   └── passport.config.js
│   ├── jobs/
│   │   └── auction.job.js
│   ├── scripts/
│   │   ├── seedAds.js
│   │   ├── seedDatabase.js
│   │   └── seedLocations.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Database Schema

### MongoDB Collections

#### 1. Users Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  avatar: String (URL),
  phone: String,
  role: String ('user' | 'admin'),
  memberSince: Date,
  subscription: {
    tier: String ('free' | 'basic' | 'pro'),
    adsRemaining: Number,
    renewsAt: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: Boolean
  },
  favorites: [ObjectId], // Ad IDs
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `role`
- `subscription.tier`

#### 2. Ads Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String (max 50),
  shortDescription: String (max 150),
  fullDescription: String,
  category: String ('Jobs' | 'Products' | 'Services' | 'Real Estate' | 'Events' | 'Notices'),
  price: Number,
  images: [String], // URLs
  location: {
    country: String,
    state: String,
    city: String
  },
  links: {
    link1: String,
    link2: String
  },
  contact: {
    email: String,
    phone: String
  },
  userId: ObjectId (ref: 'User'),
  views: Number,
  isFeatured: Boolean,
  status: String ('active' | 'expired' | 'draft' | 'archived' | 'deleted'),
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date,
  // Archive fields
  archivedAt: Date,
  archivedBy: ObjectId,
  archivedReason: String,
  deletedAt: Date,
  deletedBy: ObjectId,
  deletionReason: String,
  legalHold: Boolean,
  retentionUntil: Date
}
```

**Indexes:**
- `userId`
- `category`
- `status`
- `location.city`
- `createdAt`
- `expiresAt`
- `status + archivedAt` (compound)
- `status + legalHold` (compound)

#### 3. SubscriptionPlans Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  tier: String ('free' | 'basic' | 'pro' | 'enterprise'),
  price: Number, // in cents
  currency: String,
  interval: String ('month' | 'year'),
  features: {
    adsPerMonth: Number | 'unlimited',
    listingDuration: Number,
    imagesPerAd: Number,
    maxImageSize: Number,
    isFeatured: Boolean,
    hasAnalytics: Boolean,
    hasPrioritySupport: Boolean,
    hasPriorityPlacement: Boolean,
    hasApiAccess: Boolean,
    hasCustomBranding: Boolean
  },
  stripePriceId: String,
  stripeProductId: String,
  isActive: Boolean,
  isVisible: Boolean,
  displayOrder: Number,
  metadata: {
    description: String,
    badge: String,
    color: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `tier`
- `isActive`
- `isVisible`

#### 4. PaymentTransactions Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  planId: ObjectId (ref: 'SubscriptionPlan'),
  amount: Number, // in cents
  currency: String,
  type: String ('purchase' | 'upgrade' | 'downgrade' | 'renewal' | 'refund'),
  status: String ('pending' | 'succeeded' | 'failed' | 'refunded'),
  stripePaymentIntentId: String,
  stripeInvoiceId: String,
  metadata: {
    oldPlan: String,
    newPlan: String,
    prorated: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `status`
- `createdAt`

#### 5. AuditLogs Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  entityType: String ('ad' | 'user' | 'report'),
  entityId: ObjectId,
  action: String ('created' | 'updated' | 'deleted' | 'archived' | 'restored'),
  performedBy: ObjectId (ref: 'User'),
  performedByRole: String ('user' | 'admin' | 'system'),
  performedAt: Date,
  reason: String,
  changes: {
    field: String,
    oldValue: Mixed,
    newValue: Mixed
  },
  ipAddress: String,
  userAgent: String
}
```

**Indexes:**
- `entityId + performedAt` (compound)
- `performedBy`
- `action`
- `performedAt`

#### 6. ArchiveMetadata Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  originalId: ObjectId,
  entityType: String ('ad' | 'user'),
  archivedAt: Date,
  storageType: String ('mongodb' | 's3' | 'glacier'),
  storageLocation: String,
  checksum: String,
  canRestore: Boolean,
  legalHold: Boolean,
  retentionUntil: Date
}
```

**Indexes:**
- `originalId` (unique)
- `entityType`
- `archivedAt`

---

## Backend Architecture

### Route Organization

**Location:** `backend/routes/`

**Key Route Files:**

1. **ad.routes.js**
   - GET `/api/ads` - List ads with filters
   - GET `/api/ads/:id` - Get single ad
   - POST `/api/ads` - Create ad (auth required)
   - PUT `/api/ads/:id` - Update ad (auth required)
   - DELETE `/api/ads/:id` - Delete ad (auth required)
   - GET `/api/ads/my-ads` - Get user's ads
   - POST `/api/ads/:id/favorite` - Toggle favorite

2. **auth.routes.js**
   - POST `/api/auth/register` - Register user
   - POST `/api/auth/login` - Login user
   - POST `/api/auth/logout` - Logout user
   - GET `/api/auth/me` - Get current user
   - POST `/api/auth/refresh-token` - Refresh JWT

3. **user.routes.js**
   - GET `/api/users/:id` - Get user profile
   - PUT `/api/users/:id` - Update user (auth required)
   - GET `/api/users/:id/ads` - Get user's ads

4. **admin.routes.js**
   - GET `/api/admin/dashboard/stats` - Admin stats
   - GET `/api/admin/ads` - List all ads
   - POST `/api/admin/ads/:id/archive` - Archive ad
   - POST `/api/admin/ads/:id/restore` - Restore ad
   - GET `/api/admin/users` - List all users
   - PUT `/api/admin/users/:id` - Update user

5. **payment.routes.js**
   - POST `/api/payments/create-checkout-session` - Create Stripe checkout
   - POST `/api/payments/webhook` - Stripe webhook handler
   - GET `/api/payments/subscription-status` - Get subscription status
   - POST `/api/payments/cancel-subscription` - Cancel subscription

### Middleware Stack

**Authentication Middleware:**
```javascript
// backend/middleware/auth.middleware.js
const authenticate = async (req, res, next) => {
  // Verify JWT token
  // Attach user to req.user
  // Handle token expiration
};
```

**Admin Middleware:**
```javascript
// backend/middleware/admin.middleware.js
const requireAdmin = (req, res, next) => {
  // Check if user.role === 'admin'
  // Return 403 if not admin
};
```

**Error Middleware:**
```javascript
// backend/middleware/error.middleware.js
const errorHandler = (err, req, res, next) => {
  // Log error
  // Return appropriate error response
};
```

### Service Layer

**Location:** `backend/services/`

**Key Services:**

1. **location.service.js**
   - Fetch countries
   - Fetch states by country
   - Fetch cities by state

2. **archive.service.js**
   - Automatic archival
   - Manual archive
   - Restore from archive
   - Move to cold storage

3. **stripe.service.js**
   - Create checkout session
   - Handle webhooks
   - Update subscription
   - Process payments

---

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider
│   └── Router
│       ├── Navbar (always visible)
│       ├── Routes
│       │   ├── HomePage
│       │   │   ├── AdFilters
│       │   │   └── AdGrid
│       │   │       └── AdCard (multiple)
│       │   ├── AdDetailPage
│       │   │   ├── ImageGallery
│       │   │   ├── AdDetailsSection
│       │   │   └── ContactCard
│       │   ├── PostAdPage
│       │   │   └── PostAdForm
│       │   │       ├── ImageUpload
│       │   │       └── LocationSelector
│       │   ├── DashboardPage
│       │   │   ├── DashboardStats
│       │   │   └── MyAdsList
│       │   └── AdminDashboard
│       │       ├── AdminSidebar
│       │       └── AdminStatsGrid
│       └── HamburgerMenu
```

### State Management

**Context Providers:**

1. **AuthContext**
   - User state
   - Authentication methods
   - Token management

2. **AdContext**
   - Ads list
   - Filters
   - Pagination state

### Custom Hooks

**Location:** `src/hooks/`

1. **useInfiniteScroll.ts**
   - Detects scroll position
   - Triggers load more
   - Prevents duplicate loads

2. **useAuth.ts**
   - Wrapper for AuthContext
   - Provides auth methods

3. **useAds.ts**
   - Fetches ads
   - Manages filters
   - Handles pagination

4. **useDebounce.ts**
   - Debounces search input
   - Prevents excessive API calls

### Service Layer

**Location:** `src/services/`

**API Service:**
```typescript
// src/services/api.ts
- Axios instance configuration
- Request interceptors (add auth token)
- Response interceptors (handle errors)
```

**Service Files:**
- `auth.service.ts` - Authentication API calls
- `ad.service.ts` - Ad-related API calls
- `upload.service.ts` - Image upload API calls
- `payment.service.ts` - Payment API calls

---

## File Organization

### Where to Find Specific Code

**Ad Creation/Validation:**
- Backend: `backend/routes/ad.routes.js`
- Frontend: `src/pages/PostAdPage.tsx`
- Form Config: `backend/config/form-config.json`

**Dynamic Form Schema:**
- Config: `backend/config/form-config.json`
- Frontend: `src/pages/PostAdPage.tsx` (reads from API)

**Image Upload:**
- Backend: `backend/routes/upload.routes.js` + `backend/config/cloudinary.config.js`
- Frontend: `src/components/forms/ImageUpload.tsx`

**Location Data:**
- Backend: `backend/config/locations.config.js`
- API: `/api/locations/countries`, `/api/locations/states/:countryId`, `/api/locations/cities/:stateId`

**Authentication:**
- Backend: `backend/routes/auth.routes.js`
- Frontend: `src/context/AuthContext.tsx` + `src/pages/LoginPage.tsx`

**Admin Features:**
- Backend: `backend/routes/admin.routes.js`
- Frontend: `src/pages/admin/AdminDashboard.tsx`

---

## Configuration Files

### Backend Config

**Location:** `backend/config/`

1. **form-config.json**
   - Dynamic form configuration
   - Category-specific fields
   - Field validation rules
   - Supports 35 categories

2. **categories.config.js**
   - Category constants
   - Category metadata
   - 35 categories total:
     - Electronics, Cars & Trucks, Motorcycles, Boats & Marine, RVs & Campers
     - Houses for Sale, Apartments for Rent, Commercial Property, Vacation Rentals
     - Jobs, Services, Fashion, Home & Garden, Sports, Books, Pets
     - Food & Dining, Travel & Resorts, Deals & Offers, Tickets
     - Events & Shows, Auction, Buy & Sell, Notices
     - Health & Beauty, Baby & Kids, Arts & Crafts, Musical Instruments
     - Office Supplies, Digital Products, Software & Apps
     - Tutoring & Lessons, Home Repair, Free, Other

3. **locations.config.js**
   - Country/state/city data
   - Location helpers
   - Supports 50 countries
   - Cascading location selection (Country → State → City)

4. **cloudinary.config.js**
   - Cloudinary credentials
   - Upload configuration

5. **passport.config.js**
   - OAuth configuration
   - Social login setup

### Frontend Config

**Location:** `src/config/`

1. **api.config.ts**
   - API base URL
   - API endpoints constants

**Root Config Files:**

1. **tailwind.config.js**
   - Tailwind CSS configuration
   - Custom colors, spacing

2. **tsconfig.json**
   - TypeScript configuration
   - Compiler options

3. **vite.config.ts**
   - Vite build configuration
   - Plugin setup

---

## Data Flow

### Ad Creation Flow

```
User fills form
    ↓
PostAdPage.tsx
    ↓
PostAdForm component
    ↓
Image upload → Cloudinary → Get URLs
    ↓
Form submission → POST /api/ads
    ↓
Backend validation
    ↓
Check subscription limits
    ↓
Create Ad document
    ↓
Return created ad
    ↓
Redirect to AdDetailPage
```

### Authentication Flow

```
User enters credentials
    ↓
LoginForm component
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Generate JWT token
    ↓
Return user + token
    ↓
Store token in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Dashboard
```

### Infinite Scroll Flow

```
HomePage loads
    ↓
Fetch initial 24 ads
    ↓
User scrolls down
    ↓
useInfiniteScroll detects near bottom
    ↓
Fetch next page
    ↓
Append to existing ads
    ↓
Update hasMore flag
```

---

## Security Architecture

### Authentication

- JWT tokens stored in localStorage
- Tokens expire after 7 days
- Refresh token mechanism
- Protected routes check authentication

### Authorization

- Role-based access control (RBAC)
- Admin routes protected by middleware
- User can only edit/delete own ads
- Admin can manage all content

### Data Protection

- Passwords hashed with bcrypt
- Input validation on frontend and backend
- XSS protection
- CSRF protection
- Rate limiting on API endpoints

### Archive Security

- Legal hold prevents deletion
- Audit logs for all actions
- Secure archive operations
- Compliance with GDPR

---

## Performance Considerations

### Database Indexes

Critical indexes for performance:
- `Ad.status + archivedAt` (compound)
- `Ad.status + legalHold` (compound)
- `AuditLog.entityId + performedAt` (compound)
- `User.email` (unique)

### Caching Strategy

- Cache location data (countries, states, cities)
- Cache subscription plans
- Cache category configuration

### Image Optimization

- Lazy loading for ad images
- WebP format support
- Responsive image sizes
- CDN delivery via Cloudinary

---

## Deployment Architecture

### Production Setup

**Frontend:**
- Vercel/Netlify
- CDN distribution
- Environment variables configured

**Backend:**
- Railway/Render/AWS
- MongoDB Atlas
- Environment variables configured
- CORS configured for frontend domain

**External Services:**
- Cloudinary (production account)
- Stripe (production keys)
- AWS S3/Glacier (archive storage)

---

**For detailed implementation checklists, see [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)**

