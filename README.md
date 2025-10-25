# AdBoard - Classified Ads Platform

A modern, responsive classified ads platform built with React, TypeScript, and Tailwind CSS. Features infinite scroll, authentication, and a clean minimal UI.

## 🚀 Features

- **12-column ad grid** with 1:1 square cards
- **Infinite scroll** loading
- **Advanced filters** (Category, Location, Search)
- **Authentication** system (Login/Signup)
- **Responsive design** (Mobile-first approach)
- **Clean UI** with Tailwind CSS
- **TypeScript** for type safety

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Forms:** React Hook Form (ready to integrate)
- **Build Tool:** Vite

## 🛠️ Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup Steps

1. **Clone or navigate to the project directory**

```bash
cd adboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

4. **Start the development server**

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Menu, Spinner
│   ├── ads/             # AdCard, AdGrid
│   └── forms/           # Form components
├── pages/               # Page components
├── context/             # React Context (Auth, Ads)
├── hooks/               # Custom hooks
├── services/            # API services
├── types/               # TypeScript types
├── utils/               # Utilities & constants
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS with custom configuration in `tailwind.config.js`:

- Custom colors (primary blue)
- Square aspect ratio utility
- Custom breakpoints
- Line clamp utilities

### TypeScript

TypeScript is configured with strict mode enabled. See `tsconfig.json` for full configuration.

## 🌐 API Integration

The app is designed to work with a REST API. API endpoints are configured in `src/services/`:

- `auth.service.ts` - Authentication endpoints
- `ad.service.ts` - Ad CRUD operations
- `upload.service.ts` - Image upload

### Mock Data Mode

For development without a backend, you can add mock data in the services or use a tool like MSW (Mock Service Worker).

## 📱 Responsive Breakpoints

- Mobile: `< 640px` (2 columns)
- Tablet: `640px - 1024px` (4-6 columns)
- Desktop: `> 1024px` (8-12 columns)

## 🎯 Key Features Implemented

### ✅ Core Features
- Navigation bar with filters
- Ad grid with infinite scroll capability
- Ad detail page
- Login/Signup page
- Responsive design
- TypeScript types
- API service layer
- Custom hooks

### 🔲 To Be Implemented
- Post ad form
- Dashboard page
- Pricing page
- Image upload functionality
- Favorites system
- User profile
- Edit/Delete ads
- Backend API integration

## 🔐 Authentication

The app uses JWT token-based authentication:

1. User logs in → receives JWT token
2. Token stored in localStorage
3. Token sent with each authenticated request
4. AuthContext provides user state globally

## 🐛 Troubleshooting

### TypeScript Errors

The initial TypeScript errors are expected until dependencies are installed. Run:

```bash
npm install
```

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port, or you can specify one:

```bash
npm run dev -- --port 3000
```

### Build Errors

Clear the build cache and node_modules:

```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Documentation

Full project documentation is available in the `adboard_instructions/` folder:

- `COPILOT_INSTRUCTIONS.md` - Complete build guide
- `PROJECT_STRUCTURE.md` - Folder structure & templates
- `QUICK_REFERENCE.md` - Design cheat sheet
- `ads-platform-wireframes-v3-hamburger.html` - Interactive design reference

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Then drag & drop the dist/ folder to Netlify
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize it for your needs!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🎨 Design System

### Colors
- Primary: `#2563eb` (blue-600)
- Success: `#16a34a` (green-600)
- Warning: `#eab308` (yellow-500)
- Danger: `#dc2626` (red-600)

### Typography
- Base font: System font stack
- Heading: font-bold
- Body: Regular weight

### Spacing
- Container: `px-4`
- Card: `p-2` to `p-6`
- Grid gap: `gap-3` (12px)

## 📧 Contact

For questions or support, check the documentation files or open an issue.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

Happy coding! 🚀
