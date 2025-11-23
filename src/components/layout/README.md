# Animated Navigation Menu

A sophisticated animated navigation component with smooth transitions, staggered animations, and responsive design.

## Features

- **Initial Hidden State**: Menu items start with `opacity: 0` and `translateY(10px)`
- **Smooth Animations**: Fade in and slide up effects with hardware acceleration
- **Staggered Timing**: Each item animates with a 50ms delay for a cascading effect
- **Active Indicator**: Sliding bar that moves to indicate the current active section
- **Mobile Responsive**: Hamburger menu with overlay for mobile devices
- **Hardware Acceleration**: Uses `translateZ(0px)` for optimal GPU performance

## Components

### AnimatedNavMenu
The core animated navigation component.

```tsx
interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface AnimatedNavMenuProps {
  items: NavItem[];
  className?: string;
}
```

### MainNavigation
Pre-configured navigation with common menu items.

```tsx
<MainNavigation className="ml-auto" />
```

## Usage

### Basic Usage

```tsx
import { MainNavigation } from '../components/layout/AnimatedNavMenu';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl font-bold">Your Brand</span>
          </div>
          <MainNavigation className="ml-auto" />
        </div>
      </div>
    </header>
  );
}
```

### Custom Navigation Items

```tsx
import { AnimatedNavMenu } from '../components/layout/AnimatedNavMenu';

const customItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: <AnalyticsIcon />
  }
];

function CustomHeader() {
  return (
    <AnimatedNavMenu items={customItems} className="custom-nav" />
  );
}
```

## Animation Behavior

### Initial State
- Items are hidden with `opacity: 0`
- Positioned 10px below final position with `translateY(10px)`
- Hardware acceleration with `translateZ(0px)`

### Animation on Open
- **Fade in**: `opacity: 0 → opacity: 1`
- **Slide up**: `translateY(10px) → translateY(0px)`
- **Stagger**: Each item animates 50ms after the previous one
- **Duration**: 0.4s with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Active Indicator
- 4px height bar with gradient background
- Smoothly moves using `translateX()` to indicate active section
- Only visible on desktop (hidden on mobile)

## CSS Classes

### Main Classes
- `.animated-nav` - Main navigation container
- `.animated-nav-items` - Navigation items container
- `.animated-nav-item` - Individual navigation item
- `.animated-nav-indicator` - Active indicator bar
- `.animated-nav-overlay` - Mobile overlay

### Animation Classes
- `.nav-item-hidden` - Hidden state animation
- `.nav-item-visible` - Visible state animation
- `.stagger-delay-1` to `.stagger-delay-8` - Staggered delays

### Responsive Classes
- Mobile: Hidden hamburger menu with overlay
- Desktop: Always visible with horizontal layout

## Customization

### Colors
Edit the CSS variables in `animated-nav.css`:

```css
.animated-nav-indicator {
  background: linear-gradient(90deg, #14b8a6, #06b6d4);
}

.animated-nav-item:hover {
  background: rgba(20, 184, 166, 0.1);
  color: #14b8a6;
}
```

### Animation Timing
Adjust the animation duration and easing:

```css
.animated-nav-item {
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Stagger Delay
Modify the delay between items:

```css
.stagger-delay-1 { transition-delay: 50ms; }
.stagger-delay-2 { transition-delay: 100ms; }
/* ... and so on */
```

## Technical Implementation

### Hardware Acceleration
The component uses `translateZ(0px)` to trigger GPU acceleration for smooth animations:

```css
.animated-nav-item {
  transform: translateZ(0px);
}
```

### Responsive Design
- **Mobile**: Hamburger menu with vertical layout
- **Desktop**: Horizontal navigation with always-visible items
- **Tablet**: Responsive breakpoints at 768px

### Accessibility
- Semantic HTML5 navigation structure
- ARIA labels for menu toggle button
- Keyboard navigation support
- Focus management

## Browser Support
- Modern browsers with CSS3 support
- Hardware acceleration on supported devices
- Fallback to basic navigation on older browsers

## Performance
- CSS animations for optimal performance
- Minimal JavaScript for state management
- Hardware acceleration for smooth 60fps animations
- Efficient event handling with React hooks

## Demo
See `src/pages/AnimatedNavDemo.tsx` for a complete implementation example.