# AdBoard - Complete Project Instructions

> A modern, responsive classified ads platform (like Craigslist/Facebook Marketplace) with infinite scroll, authentication, and clean UI.

**Version:** 3.0  
**Last Updated:** January 2025  
**Status:** Ready to Build 🎯

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [UI/UX Design Requirements](#uiux-design-requirements)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Component Structure](#component-structure)
8. [Implementation Guidelines](#implementation-guidelines)
9. [Admin System](#admin-system)
10. [Subscription System](#subscription-system)
11. [Archive System](#archive-system)
12. [Deployment](#deployment)
13. [Quick Reference](#quick-reference)

---

## Project Overview

AdBoard is a classified ads platform that allows users to post, browse, and manage advertisements. The platform includes:

### Core Functionality
- ✅ **12-column ad grid** with square (1:1) cards
- ✅ **Infinite scroll** - loads 24 ads at a time
- ✅ **Advanced filters** - Category, Country, State, City, Search
- ✅ **Hamburger menu** with Login, Dashboard, and info links
- ✅ **No footer** - clean infinite scroll experience
- ✅ **Compact navigation** - all filters in one row

### User Features
- 🔲 Authentication (JWT)
- 🔲 Post/Edit/Delete ads
- 🔲 Image upload (drag & drop, max 5 images)
- 🔲 User dashboard with stats
- 🔲 Favorites system
- 🔲 Subscription tiers (Free, Basic, Pro)

### Admin Features
- 🔲 Admin dashboard with analytics
- 🔲 Ad management interface
- 🔲 User management
- 🔲 Reports management
- 🔲 Archive system
- 🔲 Subscription plan management

---

## Quick Start

### 1. View the Design Reference
```bash
# Open in browser to see the final design
open ads-platform-wireframes-v3-hamburger.html
```

### 2. Create React Project
```bash
# Using Vite (recommended)
npm create vite@latest adboard -- --template react-ts
cd adboard

# Install dependencies
npm install react-router-dom axios react-hook-form tailwindcss @headlessui/react date-fns lodash

# Install dev dependencies
npm install -D @types/react @types/react-dom @types/lodash typescript tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### 3. Backend Setup
```bash
# Create backend directory
mkdir backend && cd backend
npm init -y

# Install dependencies
npm install express mongoose dotenv bcryptjs jsonwebtoken cors multer
npm install -D typescript @types/node @types/express nodemon ts-node
```

### 4. Follow Development Phases
See [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) for detailed phase-by-phase implementation.

---

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form
- Date-fns
- Lodash

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Stripe (payments)

**Dev Tools:**
- Vite (build tool)
- TypeScript
- ESLint
- GitHub Copilot (recommended)

---

## UI/UX Design Requirements

### Navigation Bar (Sticky, Always Visible)

**Layout:**
```
[Logo] [Search Box] [Category▼] [Country▼] [State▼] [City▼] [Spacer] [☰ Menu] [Post Ad {Avatar}]
```

**Specifications:**
- Height: 56px (py-2 in Tailwind)
- Background: White with subtle shadow
- Position: Sticky top-0
- Logo: "AdBoard" - clickable, routes to home
- Search Box: 256px width (w-64), rounded-lg
- All dropdowns: min-width 110-130px
- Spacer: flex-1 to push menu right
- Hamburger Menu (☰): Dropdown with 12 items
- Post Ad Button: Blue (bg-blue-600), includes small avatar circle

**Hamburger Menu Items:**
1. Login / My Account (conditional)
2. Dashboard (auth required)
3. --- (divider)
4. About Us
5. Contact
6. Help / FAQ
7. --- (divider)
8. Terms of Service
9. Privacy Policy
10. --- (divider)
11. Blog
12. Careers

### Homepage Layout

**Ad Cards Grid:**
- Default: 12 columns (grid-cols-12)
- Responsive: 
  - Mobile: 2 columns
  - Tablet: 4-6 columns
  - Desktop: 8-12 columns
- Gap: 12px (gap-3)
- Full width container with px-4 padding

**Ad Card Design** (1:1 Square Aspect Ratio):
```
┌─────────────────┐
│     IMAGE       │ ← aspect-square (1:1)
│  [Category]  ⋮  │ ← Category badge (top-left), 3-dot menu (top-right)
│      [★]        │ ← Featured badge (if featured)
│─────────────────│
│ Title (12px)    │ ← font-semibold, line-clamp-1
│ Desc (9px)      │ ← 2 lines max, line-clamp-2
│ Location | Time │ ← 9px, gray text
└─────────────────┘
```

**Category Badge Colors:**
The platform supports 35 categories with color coding:
- Electronics (blue)
- Cars & Trucks, Motorcycles, Boats & Marine, RVs & Campers (indigo)
- Houses for Sale, Apartments for Rent, Commercial Property, Vacation Rentals (orange)
- Jobs (cyan)
- Services (purple)
- Fashion, Health & Beauty (pink)
- Home & Garden, Free (green)
- Sports (red)
- Books (yellow)
- Pets, Home Repair (amber)
- Food & Dining (lime)
- Travel & Resorts (sky)
- Deals & Offers, Tutoring & Lessons (emerald)
- Tickets, Musical Instruments (violet)
- Events & Shows, Baby & Kids (rose)
- Auction (fuchsia)
- Buy & Sell, Office Supplies (slate)
- Notices (teal)
- Arts & Crafts (purple)
- Digital Products, Software & Apps (cyan/blue)
- Other (gray)

*Note: Full category list available in CONFIGURATION_REFERENCE.md*

### Infinite Scroll

**Requirements:**
- Load 24 ads initially
- Load 24 more when user scrolls within 500px of bottom
- Show loading spinner while fetching
- Use Intersection Observer API
- Prevent multiple simultaneous requests
- Update URL params for pagination state

---

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh-token
```

### Ads
```
GET    /api/ads?page=1&limit=24&category=&location=&search=
GET    /api/ads/:id
POST   /api/ads (auth required)
PUT    /api/ads/:id (auth required)
DELETE /api/ads/:id (auth required)
GET    /api/ads/my-ads (auth required)
POST   /api/ads/:id/favorite (auth required)
```

### Users
```
GET    /api/users/:id
PUT    /api/users/:id (auth required)
GET    /api/users/:id/ads
```

### Categories & Locations
```
GET    /api/categories
GET    /api/locations/countries
GET    /api/locations/states/:countryId
GET    /api/locations/cities/:stateId
```

### Images
```
POST   /api/upload/images (auth required)
DELETE /api/upload/images/:id (auth required)
```

### Admin Endpoints
```
GET    /api/admin/dashboard/stats
GET    /api/admin/ads
PUT    /api/admin/ads/:id
DELETE /api/admin/ads/:id
POST   /api/admin/ads/bulk-action
GET    /api/admin/users
PUT    /api/admin/users/:id
POST   /api/admin/ads/:id/archive
POST   /api/admin/ads/:id/restore
```

### Subscription Endpoints
```
GET    /api/subscriptions/plans
POST   /api/payments/create-checkout-session
POST   /api/payments/webhook
GET    /api/payments/subscription-status
POST   /api/payments/cancel-subscription
```

---

## Data Models

### Ad Schema
```typescript
interface Ad {
  _id: string;
  title: string; // max 50 chars
  shortDescription: string; // max 150 chars
  fullDescription: string;
  category: 'Jobs' | 'Products' | 'Services' | 'Real Estate' | 'Events' | 'Notices';
  price?: number;
  images: string[]; // Array of URLs
  location: {
    country: string;
    state: string;
    city: string;
  };
  links: {
    link1?: string;
    link2?: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  userId: string; // Reference to User
  views: number;
  isFeatured: boolean;
  status: 'active' | 'expired' | 'draft' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  // Archive fields
  archivedAt?: Date;
  archivedBy?: string;
  archivedReason?: string;
  deletedAt?: Date;
  deletedBy?: string;
  deletionReason?: string;
  legalHold: boolean;
  retentionUntil?: Date;
}
```

### User Schema
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  avatar?: string;
  phone?: string;
  role: 'user' | 'admin';
  memberSince: Date;
  subscription: {
    tier: 'free' | 'basic' | 'pro';
    adsRemaining: number;
    renewsAt?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };
  favorites: string[]; // Array of Ad IDs
  createdAt: Date;
  updatedAt: Date;
}
```

### SubscriptionPlan Schema
```typescript
interface SubscriptionPlan {
  _id: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  price: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  features: {
    adsPerMonth: number | 'unlimited';
    listingDuration: number; // days
    imagesPerAd: number;
    maxImageSize: number; // in MB
    isFeatured: boolean;
    hasAnalytics: boolean;
    hasPrioritySupport: boolean;
    hasPriorityPlacement: boolean;
    hasApiAccess: boolean;
    hasCustomBranding: boolean;
  };
  stripePriceId?: string;
  stripeProductId?: string;
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
  metadata: {
    description: string;
    badge?: string;
    color?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── HamburgerMenu.tsx
│   │   └── LoadingSpinner.tsx
│   ├── ads/
│   │   ├── AdCard.tsx
│   │   ├── AdGrid.tsx
│   │   ├── AdFilters.tsx
│   │   ├── AdDetail.tsx
│   │   └── InfiniteScrollContainer.tsx
│   ├── forms/
│   │   ├── PostAdForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ImageUpload.tsx
│   │   └── LocationSelector.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       ├── MyAdsList.tsx
│       └── AdRow.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── AdDetailPage.tsx
│   ├── PostAdPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── PricingPage.tsx
│   └── AdminDashboard.tsx
├── context/
│   ├── AuthContext.tsx
│   └── AdContext.tsx
├── hooks/
│   ├── useInfiniteScroll.ts
│   ├── useAuth.ts
│   └── useAds.ts
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   └── ad.service.ts
├── utils/
│   ├── constants.ts
│   └── helpers.ts
└── types/
    ├── ad.types.ts
    └── user.types.ts
```

---

## Implementation Guidelines

### Key React Hooks

**useInfiniteScroll Hook:**
```typescript
import { useEffect, useRef, useState } from 'react';

export const useInfiniteScroll = (callback: () => void) => {
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight;
      
      if (scrollPosition > bottomPosition - 500 && !isFetching) {
        setIsFetching(true);
        callback();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, callback]);
  
  return [isFetching, setIsFetching] as const;
};
```

### Styling Guidelines

**Colors:**
- Primary: Blue-600 (#2563eb)
- Success: Green-600 (#16a34a)
- Warning: Yellow-500 (#eab308)
- Danger: Red-600 (#dc2626)
- Gray text: Gray-600 (#4b5563)
- Light gray: Gray-100 (#f3f4f6)

**Typography:**
- Base font: System font stack (sans-serif)
- Titles: font-semibold or font-bold
- Body: Regular weight
- Small text: text-xs or text-sm

**Spacing:**
- Container padding: px-4
- Card padding: p-2 to p-6
- Gap between elements: gap-3 (12px)
- Section spacing: mb-6 to mb-8

### Form Validation

Use react-hook-form for all forms:
```typescript
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm();

// Field validation example
<input
  {...register('title', {
    required: 'Title is required',
    maxLength: { value: 50, message: 'Max 50 characters' }
  })}
/>
{errors.title && <span className="text-red-600">{errors.title.message}</span>}
```

---

## Admin System

### Admin Routes
```
/admin/dashboard    → Overview & Stats
/admin/ads          → Manage Ads
/admin/users        → Manage Users  
/admin/reports      → Handle Reports
/admin/archive      → View Archives
/admin/analytics    → View Analytics
/admin/settings     → System Config
```

### Admin Features
- Dashboard with statistics (total ads, users, revenue, subscriptions)
- Ad management (view, edit, archive, delete, bulk actions)
- User management (view, suspend, ban, edit subscriptions)
- Reports management (review and resolve reported content)
- Archive system (automatic and manual archival)
- Analytics dashboard (revenue, user growth, ad performance)
- Settings management (system configuration)

See [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) for detailed admin implementation checklists.

---

## Subscription System

### Subscription Tiers

**Free:**
- $0/month
- 5 ads per month
- 30-day duration
- Basic support
- 3 images per ad

**Basic (Popular):**
- $15/month
- 20 ads per month
- 60-day duration
- Featured badge
- Priority support
- 5 images per ad
- Basic analytics

**Pro:**
- $49/month
- Unlimited ads
- 90-day duration
- Priority placement
- Dedicated support
- 10 images per ad
- Advanced analytics
- API access
- Custom branding

### Stripe Integration

**Setup:**
1. Create Stripe account
2. Get API keys (publishable and secret)
3. Set up webhook endpoint
4. Configure environment variables

**Webhook Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

See [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) for detailed subscription implementation.

---

## Archive System

### Archive Status Flow
```
active → expired → archived → deleted
   ↓        ↓         ↓          ↓
  30d      90d      2yrs      never
                               (soft)
```

### Archive Features
- Automatic archival (90+ days expired)
- Manual archive with reason
- Restore from archive
- Permanent deletion with safeguards
- Legal hold functionality
- Audit log for all actions
- Cold storage integration (S3/Glacier)

### Retention Policies
- Active Ads: Until expired
- Expired Ads: 90 days
- Archived Ads: 7 years
- Deleted Ads: 30 days (soft)
- Audit Logs: Indefinite

See [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) for detailed archive implementation.

---

## Deployment

### Frontend (Vercel)

**Steps:**
1. Build production bundle: `npm run build`
2. Connect GitHub repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Backend API URL
   - `VITE_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
   - `VITE_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset
   - `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
4. Deploy (automatic on git push)

**Vercel Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Backend (Render)

**Steps:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
4. Set environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT secret key
   - `CLOUDINARY_API_KEY` - Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Cloudinary API secret
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
   - `CORS_ORIGIN` - Frontend URL (e.g., https://your-app.vercel.app)
5. Deploy

**Render Configuration:**
- Auto-deploy: Yes (on git push)
- Health Check Path: `/health` (if implemented)

### MongoDB Atlas Setup

1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get connection string
6. Add to environment variables as `MONGODB_URI`

### Cloudinary Setup

1. Create Cloudinary account
2. Get API credentials from dashboard
3. Create upload preset:
   - Signing Mode: Unsigned (for frontend uploads)
   - Folder: `adboard/`
   - Allowed formats: jpg, png, webp
   - Max file size: 5MB
4. Add credentials to environment variables

### Stripe Setup

1. Create Stripe account
2. Get API keys (Test and Live)
3. Set up webhook endpoint:
   - URL: `https://your-backend.onrender.com/api/payments/webhook`
   - Events: checkout.session.completed, customer.subscription.updated, etc.
4. Get webhook secret
5. Add to environment variables

### Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify environment variables are set
- [ ] Check CORS configuration
- [ ] Test image uploads
- [ ] Test payment flow
- [ ] Verify webhook endpoints
- [ ] Set up monitoring and alerts
- [ ] Configure backups

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adboard
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_EMAIL=admin@adboard.com
ADMIN_JWT_SECRET=separate_admin_secret
```

---

## Quick Reference

### Design Tokens

**Colors:**
- Primary: `bg-blue-600` (#2563eb)
- Success: `bg-green-600` (#16a34a)
- Warning: `bg-yellow-500` (#eab308)
- Danger: `bg-red-600` (#dc2626)

**Spacing:**
- Container: `px-4`
- Cards: `p-2` (small) | `p-6` (large)
- Grid Gap: `gap-3` (12px)

**Typography:**
- Nav: `text-sm` (14px)
- Card Title: `text-xs` (12px) `font-semibold`
- Card Desc: `text-[9px]` (9px)
- Page Title: `text-3xl` (30px) `font-bold`

### Component Sizes

**Navigation Bar:**
- Height: `h-14` (56px)
- Search: `w-64` (256px)
- Dropdowns: `min-w-[110px]` to `min-w-[130px]`

**Ad Card:**
- Aspect: `aspect-square` (1:1)
- Padding: `p-2` (8px)
- Title: 1 line (`line-clamp-1`)
- Description: 2 lines (`line-clamp-2`)

### Common Issues & Solutions

**Infinite scroll loads multiple times:**
```typescript
const [isLoading, setIsLoading] = useState(false);

const loadMore = async () => {
  if (isLoading) return; // Prevent duplicate calls
  setIsLoading(true);
  await fetchAds();
  setIsLoading(false);
};
```

**Images not maintaining aspect ratio:**
```css
.image-container {
  @apply aspect-square overflow-hidden;
}
.image-container img {
  @apply w-full h-full object-cover;
}
```

---

## GitHub Copilot Prompts

### Navigation Bar
```
// Create a sticky navigation bar component with:
// - Logo that links to home
// - Search input (256px width)
// - Category, Country, State, City dropdowns
// - Hamburger menu with dropdown
// - Post Ad button with avatar circle
// Use Tailwind CSS, make it responsive
```

### Ad Card Component
```
// Create an AdCard component with:
// - 1:1 square aspect ratio image
// - Category badge (top-left)
// - Featured star badge (conditional)
// - 3-dot menu (top-right)
// - Title (12px, bold, 1 line)
// - Description (9px, 2 lines max)
// - Location and time (9px, gray)
// Use TypeScript and Tailwind
```

### Infinite Scroll Hook
```
// Create a custom React hook for infinite scroll:
// - Detect when user scrolls within 500px of bottom
// - Prevent multiple simultaneous loads
// - Return loading state
// - Use Intersection Observer API
```

---

## Cloudinary Image Upload Setup

### Backend Configuration

**File:** `backend/config/cloudinary.config.js`

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Upload Endpoints

- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload up to 5 images
- `DELETE /api/upload/:publicId` - Delete image

### Image Validation

- Allowed types: jpeg, jpg, png, webp
- Max size: 5MB per image
- Max images per ad: 5

### Automatic Optimization

- Format: Auto (WebP when supported)
- Quality: Auto
- Responsive: Yes
- Lazy loading: Yes

## OAuth Setup

### Current Status

✅ **Frontend OAuth UI is complete**  
⚠️ **Backend OAuth requires implementation for production**

### Supported Providers

- Google OAuth
- GitHub OAuth (optional)

### Frontend Implementation

OAuth buttons are implemented in `LoginPage.tsx` and `SignupForm.tsx`.

### Backend Implementation Required

1. Set up OAuth providers (Google, GitHub)
2. Configure Passport.js strategies
3. Create OAuth callback routes
4. Handle OAuth tokens
5. Create/update user accounts

**Note:** For development, mock authentication is available. For production, implement full OAuth flow.

## Production Information

### Current Deployment Status

✅ **Project is deployed and working**

**Live URLs:**
- Frontend: https://adboard-red.vercel.app
- Backend: https://adboard-backend.onrender.com
- Admin Panel: https://adboard-red.vercel.app/admin/login

**Features Working:**
- ✅ Google OAuth
- ✅ Basic functionality
- ✅ Image uploads
- ✅ Ad creation and browsing

### Missing Features (To Implement)

See [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) for complete feature checklist.

Priority features:
- Advanced search and filters
- User dashboard enhancements
- Admin panel features
- Subscription system
- Archive system

## Support & Resources

- **Design Reference:** `ads-platform-wireframes-v3-hamburger.html`
- **Architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Development Checklist:** See [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)
- **Configuration Reference:** See `removed_for_run/CONFIGURATION_REFERENCE.md` for full category and location lists
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/
- **React Hook Form:** https://react-hook-form.com/
- **Stripe Docs:** https://stripe.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

## Next Steps

1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Follow [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) for implementation
3. Start with Phase 1: Core UI
4. Progress through phases systematically
5. Test thoroughly at each phase

---

**Good luck building AdBoard! 🚀**

