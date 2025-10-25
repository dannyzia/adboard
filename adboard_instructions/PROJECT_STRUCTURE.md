# AdBoard - Project Structure & Starter Templates

## 📁 Complete Folder Structure

```
adboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   ├── Footer.tsx (if needed later)
│   │   │   └── LoadingSpinner.tsx
│   │   ├── ads/
│   │   │   ├── AdCard.tsx
│   │   │   ├── AdGrid.tsx
│   │   │   ├── AdFilters.tsx
│   │   │   ├── AdDetail.tsx
│   │   │   ├── CategoryBadge.tsx
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
│   │   │   ├── AdRow.tsx
│   │   │   └── FavoritesList.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Dropdown.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AdDetailPage.tsx
│   │   ├── PostAdPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PricingPage.tsx
│   │   └── NotFoundPage.tsx
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
│   │   └── upload.service.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── ad.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🔧 Starter Code Templates

### 1. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
      },
      aspectRatio: {
        'square': '1 / 1',
      },
    },
  },
  plugins: [],
}
```

### 2. src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer utilities {
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### 3. src/types/ad.types.ts
```typescript
export type CategoryType = 
  | 'Jobs' 
  | 'Products' 
  | 'Services' 
  | 'Real Estate' 
  | 'Events' 
  | 'Notices';

export interface Location {
  country: string;
  state: string;
  city: string;
}

export interface Ad {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: CategoryType;
  price?: number;
  images: string[];
  location: Location;
  links?: {
    link1?: string;
    link2?: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  userId: string;
  views: number;
  isFeatured: boolean;
  status: 'active' | 'expired' | 'draft';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface AdFilters {
  category?: CategoryType;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  search?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface PaginatedAdsResponse {
  ads: Ad[];
  page: number;
  totalPages: number;
  totalAds: number;
  hasMore: boolean;
}
```

### 4. src/types/user.types.ts
```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  memberSince: string;
  subscription: {
    tier: 'free' | 'basic' | 'pro';
    adsRemaining: number;
    renewsAt?: string;
  };
  favorites: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### 5. src/utils/constants.ts
```typescript
export const CATEGORY_COLORS: Record<string, string> = {
  Jobs: 'bg-blue-600',
  Products: 'bg-green-600',
  Services: 'bg-purple-600',
  'Real Estate': 'bg-orange-600',
  Events: 'bg-red-600',
  Notices: 'bg-teal-600',
};

export const CATEGORIES = [
  'Jobs',
  'Products',
  'Services',
  'Real Estate',
  'Events',
  'Notices',
] as const;

export const ADS_PER_PAGE = 24;

export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const ROUTES = {
  HOME: '/',
  AD_DETAIL: '/ad/:id',
  POST_AD: '/post-ad',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  PRICING: '/pricing',
} as const;
```

### 6. src/services/api.ts
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getApi() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();
```

### 7. src/hooks/useInfiniteScroll.ts
```typescript
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 500,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  // Alternative: scroll event (less efficient but simpler)
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight;

      if (scrollPosition > bottomPosition - threshold) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, onLoadMore, threshold]);

  return { lastElementRef };
};
```

### 8. src/components/ads/AdCard.tsx
```typescript
import React from 'react';
import { Ad } from '../../types/ad.types';
import { CATEGORY_COLORS } from '../../utils/constants';

interface AdCardProps {
  ad: Ad;
  onClick: (id: string) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  const categoryColor = CATEGORY_COLORS[ad.category] || 'bg-gray-600';

  return (
    <div
      className="ad-card bg-white rounded shadow-sm overflow-hidden relative cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
      onClick={() => onClick(ad._id)}
    >
      {/* Image Container - 1:1 Aspect Ratio */}
      <div className="relative aspect-square">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className={`absolute top-1 left-1 ${categoryColor} text-white text-xs px-1.5 py-0.5 rounded text-[10px]`}>
          {ad.category}
        </span>

        {/* Featured Badge */}
        {ad.isFeatured && (
          <span className="absolute top-1 left-16 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded text-[10px] font-semibold">
            ★
          </span>
        )}

        {/* 3-Dot Menu */}
        <div
          className="dot-menu absolute top-1 right-1 bg-white/90 rounded-full p-1 hover:bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="12" cy="19" r="2"></circle>
          </svg>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2">
        <h4 className="font-semibold text-xs text-gray-800 mb-1 line-clamp-1">
          {ad.title}
        </h4>
        <p className="text-gray-600 text-[9px] mb-1.5 line-clamp-2">
          {ad.shortDescription}
        </p>
        <div className="flex items-center justify-between text-[9px] text-gray-500">
          <span className="truncate">{ad.location.city}</span>
          <span className="whitespace-nowrap">
            {formatTimeAgo(ad.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function
function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

### 9. src/components/layout/Navbar.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    navigate(`/?search=${searchQuery}`);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <h1
            className="text-xl font-bold text-blue-600 cursor-pointer whitespace-nowrap"
            onClick={() => navigate('/')}
          >
            AdBoard
          </h1>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* Category Dropdown */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]">
            <option>All Categories</option>
            <option>Jobs</option>
            <option>Products</option>
            <option>Services</option>
            <option>Real Estate</option>
            <option>Events</option>
            <option>Notices</option>
          </select>

          {/* Country Dropdown */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]">
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>

          {/* State Dropdown */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[110px]">
            <option>Select State</option>
            <option>California</option>
            <option>New York</option>
            <option>Texas</option>
          </select>

          {/* City Dropdown */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[110px]">
            <option>Select City</option>
            <option>Los Angeles</option>
            <option>San Francisco</option>
          </select>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Hamburger Menu */}
          <HamburgerMenu />

          {/* Post Ad Button */}
          <button
            onClick={() => navigate('/post-ad')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm whitespace-nowrap"
          >
            Post Ad
            <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-xs">
              A
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};
```

### 10. src/App.tsx
```typescript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { AdDetailPage } from './pages/AdDetailPage';
import { PostAdPage } from './pages/PostAdPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ad/:id" element={<AdDetailPage />} />
            <Route path="/post-ad" element={<PostAdPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### 11. package.json
```json
{
  "name": "adboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/lodash": "^4.14.202",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

### 12. .env.example
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# Optional: Google Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### 13. .gitignore
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

---

## 🚀 Quick Setup Commands

```bash
# Create project with Vite
npm create vite@latest adboard -- --template react-ts
cd adboard

# Install dependencies
npm install react-router-dom axios react-hook-form date-fns lodash

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer @types/lodash

# Initialize Tailwind
npx tailwindcss init -p

# Start development server
npm run dev
```

---

## 📝 First Steps After Setup

1. **Update tailwind.config.js** with the config above
2. **Replace src/index.css** with the CSS above
3. **Create folder structure** as shown
4. **Copy paste starter templates** into respective files
5. **Start building components** one by one
6. **Test on localhost:5173** (Vite default port)

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Tailwind classes work (test with `bg-blue-600`)
- [ ] React Router works (test navigation)
- [ ] TypeScript compiles without errors
- [ ] Dev server runs without errors
- [ ] Can import components
- [ ] Environment variables load

---

## 🎯 Development Order (Recommended)

**Week 1: UI Components**
1. ✅ Navbar component
2. ✅ AdCard component
3. ✅ AdGrid with dummy data
4. ✅ Basic routing
5. ✅ HomePage layout

**Week 2: Core Features**
6. 🔲 API integration
7. 🔲 Infinite scroll
8. 🔲 Ad detail page
9. 🔲 Search & filters

**Week 3: User Features**
10. 🔲 Authentication
11. 🔲 Post ad form
12. 🔲 Dashboard
13. 🔲 Image upload

**Week 4: Polish & Deploy**
14. 🔲 Error handling
15. 🔲 Loading states
16. 🔲 Responsive testing
17. 🔲 Deploy to Vercel

---

Happy coding! 🚀
