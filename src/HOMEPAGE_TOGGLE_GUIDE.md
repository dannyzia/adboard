# Homepage Toggle Feature Guide

## Overview
Your adboard now includes a stunning alternative homepage design with a toggle mechanism to switch between the classic and modern designs. Both designs are fully functional and you can switch between them at any time.

## Features

### Classic Design (Original)
- Clean, minimalist interface
- World map background with animated category buttons
- Traditional grid layout for ads
- Familiar user experience

### Modern Design (New)
- Dynamic gradient backgrounds with interactive mouse-following effects
- Enhanced hero section with improved search functionality
- Masonry layout option for ads
- Improved visual hierarchy and micro-interactions
- Enhanced ad cards with hover effects and better typography

## How to Use

### Toggle Switch
- Look for the theme toggle button in the bottom-right corner of any page
- Click "Classic" to switch to the original design
- Click "Modern" to switch to the new design
- Your preference is automatically saved in browser storage

### Design Differences

#### Hero Section
- **Classic**: World map with randomly appearing category buttons
- **Modern**: Interactive gradient background with mouse-following effects, featured categories grid, enhanced search bar

#### Ad Display
- **Classic**: Standard grid layout with basic sorting
- **Modern**: Masonry layout option, enhanced sorting with featured priority, improved loading states

#### Visual Elements
- **Classic**: Teal/cyan color scheme with simple animations
- **Modern**: Multi-gradient backgrounds, enhanced hover effects, improved typography

## Technical Implementation

### File Structure
```
src/
├── context/
│   └── HomepageContext.tsx      # Context for managing homepage state
├── components/
│   ├── HeroSectionAlternative.tsx # Modern hero section
│   ├── HomepageToggle.tsx        # Toggle component
│   └── ads/
│       └── AdCardAlternative.tsx # Enhanced ad cards
├── pages/
│   ├── HomePage.tsx              # Original homepage
│   ├── HomePageAlternative.tsx   # Modern homepage
│   └── HomePageWrapper.tsx       # Wrapper that switches between designs
└── App.tsx                      # Updated to include the toggle system
```

### Key Components

#### HomepageContext
- Manages which design is currently active
- Persists user preference in localStorage
- Provides toggle and set methods

#### HomepageToggle
- Floating toggle button in bottom-right corner
- Visual indication of current active design
- Smooth transitions between states

#### HomePageWrapper
- Reads current design state from context
- Renders appropriate homepage component
- Handles all the routing logic

## Customization

### Adding New Designs
1. Create a new homepage component (e.g., `HomePageNewDesign.tsx`)
2. Update the `HomepageContext` to support more options
3. Modify `HomePageWrapper` to include the new design
4. Update the `HomepageToggle` component to show the new option

### Modifying Existing Designs
- **Classic**: Edit `src/pages/HomePage.tsx` and `src/components/HeroSection.tsx`
- **Modern**: Edit `src/pages/HomePageAlternative.tsx` and `src/components/HeroSectionAlternative.tsx`

### Styling Changes
- Modern design uses more gradients and animations
- Classic design maintains the original clean aesthetic
- Both designs share the same Tailwind CSS configuration

## Browser Support

The modern design includes:
- CSS Grid and Flexbox (supported in all modern browsers)
- CSS Custom Properties for dynamic theming
- CSS Transforms and Transitions for animations
- Backdrop filters for blur effects

## Performance Considerations

- Both designs use lazy loading for images
- Infinite scroll is preserved in both versions
- Modern design includes additional CSS animations but they are optimized
- Context state is minimal and efficiently managed

## Troubleshooting

### Toggle Not Working
- Check browser console for JavaScript errors
- Ensure localStorage is enabled in your browser
- Try refreshing the page

### Design Not Loading
- Check that all components are properly imported
- Verify the context provider is wrapping the application
- Check for any CSS conflicts

### Performance Issues
- The modern design includes more animations which may impact performance on older devices
- You can disable animations by modifying the CSS classes
- Consider using the classic design for better performance on low-end devices

## Future Enhancements

Potential improvements for the modern design:
- Dark mode support
- More layout options (list, card, etc.)
- Advanced filtering options
- Personalized recommendations
- A/B testing framework for comparing designs