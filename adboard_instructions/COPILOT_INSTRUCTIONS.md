# GitHub Copilot Instructions: Classified Ads Platform (AdBoard)

## Project Overview
Build a modern, responsive classified ads platform similar to Craigslist/Facebook Marketplace with a clean, minimal UI and infinite scroll functionality.

---

## Tech Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + Hooks
- **Routing**: React Router v6
- **API Calls**: Axios
- **Authentication**: JWT tokens
- **Backend**: Node.js + Express + MongoDB (or your preferred stack)
- **Image Upload**: Cloudinary or AWS S3
- **Infinite Scroll**: Intersection Observer API

---

## UI/UX Design Requirements

### 1. Navigation Bar (Sticky, Always Visible)
**Layout**: Single compact row with all elements

```
[Logo] [Search Box] [Category▼] [Country▼] [State▼] [City▼] [Spacer] [☰ Menu] [Post Ad {Avatar}]
```

**Specifications**:
- Height: 56px (py-2 in Tailwind)
- Background: White with subtle shadow
- Position: Sticky top-0
- Logo: "AdBoard" - clickable, routes to home
- Search Box: 256px width (w-64), rounded-lg
- All dropdowns: min-width 110-130px
- Spacer: flex-1 to push menu right
- Hamburger Menu (☰): Dropdown with 9 items
- Post Ad Button: Blue (bg-blue-600), includes small avatar circle

**Hamburger Menu Items**:
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

### 2. Homepage Layout

**Ad Cards Grid**:
- Default: 12 columns (grid-cols-12)
- Responsive: 
  - Mobile: 2 columns
  - Tablet: 4-6 columns
  - Desktop: 8-12 columns (user can toggle)
- Gap: 12px (gap-3)
- Full width container with px-4 padding

**Ad Card Design** (1:1 Square Aspect Ratio):
```
┌─────────────────┐
│                 │
│     IMAGE       │ ← aspect-square (1:1)
│  [Category]  ⋮  │ ← Category badge (top-left), 3-dot menu (top-right)
│      [★]        │ ← Featured badge (if featured)
│─────────────────│
│ Title (12px)    │ ← font-semibold, line-clamp-1
│ Desc (9px)      │ ← 2 lines max, line-clamp-2
│ Location | Time │ ← 9px, gray text
└─────────────────┘
```

**Card Styling**:
- Background: White
- Border radius: rounded (6px)
- Shadow: shadow-sm, hover: shadow-md
- Padding: p-2 (8px)
- Hover: Transform up 2px
- Cursor: pointer
- Font sizes: Title 12px, Description 9px, Meta 9px

**Category Badge Colors**:
- Jobs: Blue (bg-blue-600)
- Products: Green (bg-green-600)
- Services: Purple (bg-purple-600)
- Real Estate: Orange (bg-orange-600)
- Events: Red (bg-red-600)
- Notices: Teal (bg-teal-600)

### 3. Infinite Scroll Implementation

**Requirements**:
- Load 24 ads initially
- Load 24 more when user scrolls within 500px of bottom
- Show loading spinner while fetching
- Use Intersection Observer or scroll event
- Prevent multiple simultaneous requests
- Update URL params for pagination state

**Loading Indicator**:
```jsx
<div className="flex justify-center items-center py-8">
  <svg className="animate-spin h-8 w-8 text-blue-600">...</svg>
  <span className="ml-2 text-gray-600">Loading more ads...</span>
</div>
```

### 4. Ad Detail Page

**Layout**: 2-column (70% / 30% on desktop)

**Left Column**:
- Image gallery with thumbnails
- Category badge
- Title (text-3xl)
- Location + Posted time
- Full description with formatting
- Additional resource links

**Right Column (Sticky)**:
- Seller info card
- Contact buttons: "Send Message", "Call Now", "Share"
- Ad metadata: ID, Views
- Safety tips (yellow box)
- Similar ads (3 items)

### 5. Post Ad Page

**Form Fields** (in order):
1. Category* (dropdown)
2. Ad Title* (max 50 chars, counter)
3. Short Description* (max 150 chars, shows on card)
4. Full Description* (textarea, 8 rows)
5. Images* (drag & drop, max 5 images, 5MB each)
6. Location: Country*, State*, City* (3 dropdowns)
7. Link 1 (optional URL)
8. Link 2 (optional URL)
9. Price (optional, number input with $ prefix)
10. Contact Email*
11. Phone Number (optional)
12. Terms checkbox*

**Info Box**: Show free tier status (e.g., "3 out of 5 free ads remaining")

**Buttons**: 
- Primary: "Publish Ad" (full width, blue)
- Secondary: "Save Draft" (gray border)

### 6. Dashboard Page

**Stats Cards** (4 across):
- Active Ads (with icon)
- Total Views
- Free Ads Left (X/5)
- Subscription Tier (with "Upgrade" link)

**Tabs**: My Ads | Favorites | Settings

**My Ads List**:
- Each ad shows: Image, Title, Location, Views, Status, Actions
- Actions: Edit, Delete buttons
- Shows expiry countdown
- "Renew" button when near expiration

### 7. Login/Signup Page

**Layout**: Centered card, max-width 448px

**Features**:
- Tabs: Sign In | Sign Up
- Email + Password fields
- "Remember me" checkbox
- "Forgot password?" link
- Social login buttons: Google, GitHub
- Toggle between Sign In/Sign Up

### 8. Pricing Page

**3 Tiers** (side-by-side cards):

**Free**:
- $0/month
- 5 ads per month
- 30-day duration
- Basic support
- 3 images per ad

**Basic** (Popular):
- $15/month
- 20 ads per month
- 60-day duration
- Featured badge
- Priority support
- 5 images per ad
- Basic analytics

**Pro**:
- $49/month
- Unlimited ads
- 90-day duration
- Priority placement
- Dedicated support
- 10 images per ad
- Advanced analytics
- API access
- Custom branding

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

### Categories
```
GET    /api/categories
```

### Locations
```
GET    /api/locations/countries
GET    /api/locations/states/:countryId
GET    /api/locations/cities/:stateId
```

### Images
```
POST   /api/upload/images (auth required)
DELETE /api/upload/images/:id (auth required)
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
  status: 'active' | 'expired' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
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
  memberSince: Date;
  subscription: {
    tier: 'free' | 'basic' | 'pro';
    adsRemaining: number;
    renewsAt?: Date;
  };
  favorites: string[]; // Array of Ad IDs
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
│   │   └── SignupForm.tsx
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
│   └── PricingPage.tsx
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
└── App.tsx
```

---

## Key React Hooks to Implement

### useInfiniteScroll Hook
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

### useAuth Hook
```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## Styling Guidelines

### Colors
- Primary: Blue-600 (#2563eb)
- Success: Green-600 (#16a34a)
- Warning: Yellow-500 (#eab308)
- Danger: Red-600 (#dc2626)
- Gray text: Gray-600 (#4b5563)
- Light gray: Gray-100 (#f3f4f6)

### Typography
- Base font: System font stack (sans-serif)
- Titles: font-semibold or font-bold
- Body: Regular weight
- Small text: text-xs or text-sm

### Spacing
- Container padding: px-4
- Card padding: p-2 to p-6 (depending on size)
- Gap between elements: gap-3 (12px)
- Section spacing: mb-6 to mb-8

### Responsive Breakpoints (Tailwind)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

---

## Features to Implement

### Phase 1: Core Features
- [x] Navigation bar with filters
- [x] Ad grid with 12 columns
- [x] Infinite scroll
- [x] Ad card component
- [x] Ad detail page
- [x] Basic routing

### Phase 2: User Features
- [ ] Authentication (JWT)
- [ ] Post ad form with validation
- [ ] Image upload (drag & drop)
- [ ] User dashboard
- [ ] Edit/Delete ads
- [ ] Favorites system

### Phase 3: Advanced Features
- [ ] Real-time search with debouncing
- [ ] Advanced filters (price range, date posted)
- [ ] Featured ads (paid)
- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Admin panel
- [ ] Analytics dashboard

### Phase 4: Optimization
- [ ] Image optimization (lazy loading, WebP)
- [ ] SEO optimization
- [ ] PWA support
- [ ] Performance monitoring
- [ ] Caching strategy
- [ ] CDN integration

---

## Important Implementation Notes

### 1. Image Handling
```typescript
// Use aspect-square class for 1:1 ratio
<div className="aspect-square">
  <img 
    src={imageUrl} 
    alt={title}
    className="w-full h-full object-cover"
    loading="lazy" // Lazy load images
  />
</div>
```

### 2. Infinite Scroll Logic
```typescript
// Detect when user is near bottom
const loadMore = useCallback(() => {
  if (hasMore && !loading) {
    setPage(prev => prev + 1);
  }
}, [hasMore, loading]);

// Use Intersection Observer (preferred) or scroll event
const observerRef = useRef<IntersectionObserver>();
const lastAdRef = useCallback((node: HTMLDivElement) => {
  if (loading) return;
  if (observerRef.current) observerRef.current.disconnect();
  
  observerRef.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      loadMore();
    }
  });
  
  if (node) observerRef.current.observe(node);
}, [loading, hasMore, loadMore]);
```

### 3. Form Validation
```typescript
// Use react-hook-form or formik
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm();

// Field validation example
<input
  {...register('title', {
    required: 'Title is required',
    maxLength: { value: 50, message: 'Max 50 characters' }
  })}
  className="..."
/>
{errors.title && <span className="text-red-600">{errors.title.message}</span>}
```

### 4. Authentication Flow
```typescript
// Store JWT in httpOnly cookie (secure) or localStorage (simple)
// Include token in all authenticated requests

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      await refreshToken();
    }
    return Promise.reject(error);
  }
);
```

### 5. Search Implementation
```typescript
// Debounce search input
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    // API call
    fetchAds({ search: query, page: 1 });
  }, 500),
  []
);

useEffect(() => {
  return () => debouncedSearch.cancel();
}, [debouncedSearch]);
```

---

## Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adboard
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_key
```

---

## Testing Checklist

### UI/UX Testing
- [ ] Navigation bar is sticky and responsive
- [ ] All dropdowns work correctly
- [ ] Hamburger menu opens/closes properly
- [ ] Ad cards maintain 1:1 aspect ratio on all screens
- [ ] Infinite scroll loads smoothly without duplicates
- [ ] Loading indicators appear during async operations
- [ ] Forms validate inputs correctly
- [ ] Error messages are clear and helpful
- [ ] Images load properly with fallbacks

### Functionality Testing
- [ ] User can register and login
- [ ] User can post an ad with images
- [ ] Filters work correctly (category, location, search)
- [ ] User can edit/delete their own ads
- [ ] Favorites system works
- [ ] Dashboard shows correct statistics
- [ ] Pagination/infinite scroll works
- [ ] Ad detail page displays all information

### Performance Testing
- [ ] Initial page load < 3 seconds
- [ ] Images are optimized and lazy-loaded
- [ ] No memory leaks in infinite scroll
- [ ] API calls are debounced appropriately
- [ ] Bundle size is optimized

---

## Deployment Instructions

### Frontend (Vercel/Netlify)
1. Build production bundle: `npm run build`
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Backend (Railway/Render/AWS)
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy API server
4. Set up CORS for frontend domain

### Database
1. Create indexes on frequently queried fields:
   - `category`, `location.city`, `createdAt`
2. Set up MongoDB Atlas or self-hosted MongoDB
3. Configure backups

---

## Accessibility Requirements

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader friendly
- [ ] ARIA labels where needed

---

## Security Considerations

- [ ] Input validation on frontend and backend
- [ ] XSS protection
- [ ] CSRF protection
- [ ] SQL injection prevention (use parameterized queries)
- [ ] Rate limiting on API endpoints
- [ ] Password hashing (bcrypt)
- [ ] JWT token validation
- [ ] Secure file upload (validate file types, size limits)
- [ ] HTTPS only in production
- [ ] Environment variables for sensitive data

---

## GitHub Copilot Prompts

Use these prompts in your code editor with GitHub Copilot:

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

### Post Ad Form
```
// Create a PostAdForm component with react-hook-form:
// - All fields from the spec (category, title, description, images, location, price, contact)
// - Image upload with drag & drop (max 5 images)
// - Field validation
// - Character counters
// - Submit handler
```

---

## Quick Start Commands

```bash
# Create React app with TypeScript
npx create-react-app adboard --template typescript

# Or use Vite (recommended)
npm create vite@latest adboard -- --template react-ts

# Install dependencies
cd adboard
npm install react-router-dom axios tailwindcss @headlessui/react react-hook-form

# Initialize Tailwind
npx tailwindcss init -p

# Start development server
npm run dev

# Backend setup (if using Node.js)
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install -D typescript @types/node @types/express nodemon ts-node
```

---

## Reference Files Included

The reference HTML wireframe is available at:
`ads-platform-wireframes-v3-hamburger.html`

This shows the exact design, spacing, colors, and interactions to replicate.

---

## Support & Resources

- Tailwind CSS: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/
- React Hook Form: https://react-hook-form.com/
- Axios: https://axios-http.com/docs/intro
- MongoDB: https://www.mongodb.com/docs/

---

## Final Notes

- **Focus on mobile-first responsive design**
- **Keep the UI minimal and clean**
- **Prioritize performance (lazy loading, code splitting)**
- **Use TypeScript for type safety**
- **Write clean, maintainable code**
- **Add comments for complex logic**
- **Follow React best practices (hooks, composition)**
- **Test on multiple devices and browsers**

Good luck building AdBoard! 🚀
