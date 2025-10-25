# AdBoard - Quick Reference Cheat Sheet

## 🎨 Design Tokens

### Colors (Tailwind)
```css
Primary:      bg-blue-600    #2563eb
Success:      bg-green-600   #16a34a  
Warning:      bg-yellow-500  #eab308
Danger:       bg-red-600     #dc2626
Gray-Text:    text-gray-600  #4b5563
Light-BG:     bg-gray-50     #f9fafb
```

### Spacing
```
Container:    px-4
Cards:        p-2 (small) | p-6 (large)
Grid Gap:     gap-3 (12px)
Sections:     mb-6 | mb-8
```

### Typography
```
Nav:          text-sm (14px)
Card Title:   text-xs (12px) font-semibold
Card Desc:    text-[9px] (9px)
Card Meta:    text-[9px] (9px) text-gray-500
Page Title:   text-3xl (30px) font-bold
```

---

## 📐 Component Sizes

### Navigation Bar
- Height: `h-14` (56px)
- Search: `w-64` (256px)
- Dropdowns: `min-w-[110px]` to `min-w-[130px]`

### Ad Card
- Aspect: `aspect-square` (1:1)
- Padding: `p-2` (8px)
- Title: 1 line (`line-clamp-1`)
- Description: 2 lines (`line-clamp-2`)

### Grid Columns
- Mobile: `grid-cols-2`
- Tablet: `grid-cols-4` to `grid-cols-6`
- Desktop: `grid-cols-8` to `grid-cols-12`

---

## 🔧 Key Components

### AdCard Props
```typescript
interface AdCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: CategoryType;
  location: string;
  postedTime: string;
  price?: number;
  isFeatured?: boolean;
}
```

### Navbar Structure
```
Logo | Search | Filters (4x) | Spacer | Menu | Post Ad
```

### Hamburger Menu Items
```
1. Login / My Account (with icon)
2. Dashboard (with icon)
--- divider ---
3. About Us
4. Contact
5. Help / FAQ
--- divider ---
6. Terms of Service
7. Privacy Policy
--- divider ---
8. Blog
9. Careers
```

---

## 🚀 API Quick Reference

### Ads
```
GET    /api/ads?page=1&limit=24&category=Jobs&city=SF
GET    /api/ads/:id
POST   /api/ads
PUT    /api/ads/:id
DELETE /api/ads/:id
```

### Auth
```
POST   /api/auth/register  {name, email, password}
POST   /api/auth/login     {email, password}
GET    /api/auth/me
```

---

## 💾 State Management

### Auth Context
```typescript
{
  user: User | null,
  token: string | null,
  login: (email, password) => Promise<void>,
  logout: () => void,
  register: (data) => Promise<void>,
  isAuthenticated: boolean
}
```

### Ad Context
```typescript
{
  ads: Ad[],
  loading: boolean,
  hasMore: boolean,
  fetchAds: (filters) => Promise<void>,
  loadMore: () => Promise<void>,
  createAd: (data) => Promise<void>,
  updateAd: (id, data) => Promise<void>,
  deleteAd: (id) => Promise<void>
}
```

---

## 🎯 Infinite Scroll Logic

```typescript
// Trigger load when within 500px of bottom
const threshold = 500;
const shouldLoad = 
  (window.innerHeight + window.scrollY) > 
  (document.body.offsetHeight - threshold);

if (shouldLoad && !loading && hasMore) {
  loadMore();
}
```

---

## 📝 Form Validation Rules

### Post Ad Form
```typescript
title: {
  required: true,
  maxLength: 50
}

shortDescription: {
  required: true,
  maxLength: 150
}

fullDescription: {
  required: true,
  minLength: 20
}

images: {
  required: true,
  maxFiles: 5,
  maxSize: 5242880, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
}

email: {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

price: {
  min: 0,
  max: 999999999
}
```

---

## 🎨 Category Badge Colors

```typescript
const categoryColors = {
  Jobs: 'bg-blue-600',
  Products: 'bg-green-600',
  Services: 'bg-purple-600',
  'Real Estate': 'bg-orange-600',
  Events: 'bg-red-600',
  Notices: 'bg-teal-600'
};
```

---

## 🔒 Protected Routes

```typescript
// Wrap these routes with authentication check
- /post-ad
- /dashboard
- /my-ads
- /favorites
- /settings
```

---

## 📱 Responsive Breakpoints

```typescript
// Tailwind defaults
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large
2xl: '1536px' // 2X Extra large
```

---

## ⚡ Performance Tips

1. **Lazy Load Images**: Use `loading="lazy"`
2. **Code Splitting**: Use React.lazy() for routes
3. **Memoization**: Use useMemo/useCallback for heavy computations
4. **Debounce Search**: 500ms delay
5. **Virtual Scrolling**: Consider for 1000+ items
6. **Image Optimization**: Use WebP, resize on upload

---

## 🐛 Common Issues & Solutions

### Issue: Infinite scroll loads multiple times
```typescript
// Solution: Use a loading flag
const [isLoading, setIsLoading] = useState(false);

const loadMore = async () => {
  if (isLoading) return; // Prevent duplicate calls
  setIsLoading(true);
  await fetchAds();
  setIsLoading(false);
};
```

### Issue: Menu doesn't close when clicking outside
```typescript
// Solution: Add document click listener
useEffect(() => {
  const handleClick = (e) => {
    if (!menuRef.current?.contains(e.target)) {
      setIsOpen(false);
    }
  };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);
```

### Issue: Images not maintaining aspect ratio
```css
/* Solution: Use aspect-square and object-cover */
.image-container {
  @apply aspect-square overflow-hidden;
}
.image-container img {
  @apply w-full h-full object-cover;
}
```

---

## 🧪 Testing Checklist

- [ ] Navigation works on all pages
- [ ] Infinite scroll loads correctly
- [ ] Forms validate inputs
- [ ] Images upload successfully
- [ ] Authentication flow works
- [ ] Protected routes redirect to login
- [ ] Mobile responsive (test 320px width)
- [ ] Cards maintain 1:1 ratio on all screens
- [ ] No console errors
- [ ] Loading states show properly

---

## 📦 Essential NPM Packages

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-router-dom": "^5.3.0",
    "@types/lodash": "^4.14.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🔗 Quick Links

- Design Reference: `ads-platform-wireframes-v3-hamburger.html`
- Full Instructions: `COPILOT_INSTRUCTIONS.md`
- Tailwind Docs: https://tailwindcss.com
- React Router: https://reactrouter.com

---

## 🎯 MVP Features (Week 1)

1. ✅ Navigation bar with filters
2. ✅ Ad grid (12 columns)
3. ✅ Infinite scroll
4. ✅ Ad detail page
5. ✅ Basic routing

## Next Phase Features (Week 2)

6. 🔲 Authentication
7. 🔲 Post ad form
8. 🔲 Dashboard
9. 🔲 Edit/Delete ads
10. 🔲 Image upload

---

## 💡 Pro Tips

1. **Start with the static HTML** - Build UI first, add functionality later
2. **Use the reference wireframe** - Copy exact spacing and sizes
3. **Mobile-first approach** - Design for 375px width first
4. **Component library** - Extract reusable components early
5. **Type everything** - Use TypeScript interfaces for all data
6. **Git commits** - Commit after each feature
7. **Test frequently** - Check on real devices, not just browser DevTools

---

## 🚨 Critical Don'ts

- ❌ Don't use localStorage for sensitive data
- ❌ Don't skip input validation
- ❌ Don't forget error boundaries
- ❌ Don't load all images at once
- ❌ Don't skip loading states
- ❌ Don't forget mobile testing
- ❌ Don't commit .env files
- ❌ Don't use inline styles (use Tailwind)

---

Good luck! 🎉
