# AdBoard - Complete Development Package

> A modern, responsive classified ads platform (like Craigslist/Facebook Marketplace) with infinite scroll, authentication, and clean UI.

---

## 📦 What's Included

This package contains everything you need to build AdBoard from scratch using GitHub Copilot and modern web technologies.

### 1. **Design Reference** 
   - `ads-platform-wireframes-v3-hamburger.html` - Interactive HTML wireframe
   - Shows exact design, spacing, colors, and interactions
   - Open in browser to see the final product

### 2. **Complete Instructions**
   - `COPILOT_INSTRUCTIONS.md` - Comprehensive build guide for GitHub Copilot
   - Includes API specs, data models, component structure
   - Phase-by-phase development roadmap

### 3. **Quick Reference**
   - `QUICK_REFERENCE.md` - Cheat sheet for developers
   - Design tokens, color codes, sizes
   - Common code patterns and solutions

### 4. **Project Structure**
   - `PROJECT_STRUCTURE.md` - Complete folder structure + starter code
   - Ready-to-use TypeScript templates
   - Component boilerplate code

---

## 🎯 Key Features

### Core Functionality
- ✅ **12-column ad grid** with square (1:1) cards
- ✅ **Infinite scroll** - loads 24 ads at a time
- ✅ **Advanced filters** - Category, Country, State, City, Search
- ✅ **Hamburger menu** with Login, Dashboard, and info links
- ✅ **No footer** - clean infinite scroll experience
- ✅ **Compact navigation** - all filters in one row

### User Features (To Build)
- 🔲 Authentication (JWT)
- 🔲 Post/Edit/Delete ads
- 🔲 Image upload (drag & drop, max 5 images)
- 🔲 User dashboard with stats
- 🔲 Favorites system
- 🔲 Subscription tiers (Free, Basic, Pro)

---

## 🚀 Quick Start

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
npm install react-router-dom axios react-hook-form tailwindcss
```

### 3. Follow the Instructions
Open `COPILOT_INSTRUCTIONS.md` and follow the step-by-step guide with GitHub Copilot.

---

## 📚 Documentation Guide

### For **Quick Setup** (30 minutes)
1. Read: `QUICK_REFERENCE.md` (design tokens, sizes)
2. Copy: Code from `PROJECT_STRUCTURE.md`
3. Reference: HTML wireframe for exact styling

### For **Complete Build** (1-2 weeks)
1. Read: `COPILOT_INSTRUCTIONS.md` (full guide)
2. Follow: Phase-by-phase development plan
3. Use: GitHub Copilot prompts provided

### For **Specific Questions**
- **"What color is the Jobs badge?"** → `QUICK_REFERENCE.md`
- **"How does infinite scroll work?"** → `COPILOT_INSTRUCTIONS.md`
- **"What's the folder structure?"** → `PROJECT_STRUCTURE.md`
- **"How does it look?"** → Open `ads-platform-wireframes-v3-hamburger.html`

---

## 🎨 Design System

### Navigation Bar
```
[Logo] [Search] [Category▼] [Country▼] [State▼] [City▼] [Spacer] [☰] [Post Ad]
```

### Ad Card (1:1 Square)
```
┌─────────────────┐
│     IMAGE       │ ← aspect-square
│  [Category]  ⋮  │
│─────────────────│
│ Title (12px)    │
│ Desc (9px)      │
│ Location | Time │
└─────────────────┘
```

### Hamburger Menu Items
1. Login / My Account
2. Dashboard
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

### Colors (Tailwind)
- Primary: `bg-blue-600` (#2563eb)
- Jobs: `bg-blue-600`
- Products: `bg-green-600`
- Services: `bg-purple-600`
- Real Estate: `bg-orange-600`
- Events: `bg-red-600`
- Notices: `bg-teal-600`

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form

**Backend (Recommended):**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Stripe (payments)

---

## 📁 Project Structure Preview

```
src/
├── components/
│   ├── layout/          # Navbar, Menu, Spinner
│   ├── ads/             # AdCard, AdGrid, Filters
│   ├── forms/           # PostAd, Login, Signup
│   └── dashboard/       # Stats, MyAds, Favorites
├── pages/               # All page components
├── hooks/               # useInfiniteScroll, useAuth
├── services/            # API calls
└── types/               # TypeScript interfaces
```

---

## 🎯 Development Phases

### Phase 1: Static UI (Week 1)
- Navigation bar
- Ad cards with dummy data
- Basic routing
- Responsive design

### Phase 2: API Integration (Week 2)
- Connect to backend
- Infinite scroll
- Search & filters
- Ad detail page

### Phase 3: User Features (Week 3)
- Authentication flow
- Post ad form
- Dashboard
- Image upload

### Phase 4: Polish (Week 4)
- Error handling
- Loading states
- Performance optimization
- Deploy to production

---

## 💡 Using GitHub Copilot

### Example Prompts

**For Navigation Bar:**
```
// Create a sticky navigation bar with logo, search, 4 dropdowns,
// hamburger menu, and Post Ad button. Use Tailwind CSS.
```

**For Ad Card:**
```
// Create an AdCard component with 1:1 square image, category badge,
// title (12px), description (9px, 2 lines), location and time.
// Props: ad object. Use TypeScript.
```

**For Infinite Scroll:**
```
// Create useInfiniteScroll hook that detects when user scrolls
// within 500px of bottom. Prevent duplicate loads. Use Intersection Observer.
```

More prompts available in `COPILOT_INSTRUCTIONS.md`

---

## 📊 API Endpoints

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

Ads:
GET    /api/ads?page=1&limit=24&category=&search=
GET    /api/ads/:id
POST   /api/ads
PUT    /api/ads/:id
DELETE /api/ads/:id

Users:
GET    /api/users/:id
PUT    /api/users/:id
```

Full API spec in `COPILOT_INSTRUCTIONS.md`

---

## ✅ Checklist Before Starting

- [ ] Reviewed the HTML wireframe
- [ ] Understand the design system
- [ ] Set up development environment
- [ ] Installed GitHub Copilot
- [ ] Read the Quick Reference
- [ ] Ready to code!

---

## 🚨 Important Notes

1. **No Footer** - Design uses infinite scroll, no footer needed
2. **1:1 Cards** - All ad cards must be perfect squares
3. **12 Columns** - Default desktop layout is 12 cards per row
4. **Hamburger Menu** - Includes Login and Dashboard links
5. **Mobile First** - Build for 375px width first, scale up

---

## 📞 Support

For questions or issues:
1. Check `QUICK_REFERENCE.md` for quick answers
2. Review `COPILOT_INSTRUCTIONS.md` for detailed info
3. Look at HTML wireframe for visual reference
4. Use GitHub Copilot chat for code help

---

## 📄 License

This is a personal project template. Feel free to use, modify, and build upon it.

---

## 🎉 Let's Build!

You have everything you need:
- ✅ Complete design reference
- ✅ Comprehensive instructions
- ✅ Code templates
- ✅ Development roadmap

**Start with:** Open the HTML wireframe → Read COPILOT_INSTRUCTIONS.md → Begin coding!

Good luck building AdBoard! 🚀

---

## File Index

| File | Purpose | When to Use |
|------|---------|-------------|
| `ads-platform-wireframes-v3-hamburger.html` | Visual reference | First thing to open |
| `COPILOT_INSTRUCTIONS.md` | Complete build guide | Main reference doc |
| `QUICK_REFERENCE.md` | Design cheat sheet | Quick lookups |
| `PROJECT_STRUCTURE.md` | Folder setup + templates | Starting new project |
| `README.md` (this file) | Overview & guide | Getting oriented |

---

**Version:** 3.0  
**Last Updated:** October 2025  
**Status:** Ready to Build 🎯
