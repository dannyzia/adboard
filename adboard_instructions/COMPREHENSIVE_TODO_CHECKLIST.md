# AdBoard - Comprehensive TODO & Checklist
## Complete Implementation Guide for Every Page

> **Usage**: Copy each section and send it to GitHub Copilot when building that specific page/feature.

---

# Table of Contents

1. [Homepage](#1-homepage)
2. [Ad Detail Page](#2-ad-detail-page)
3. [Post Ad Page](#3-post-ad-page)
4. [User Dashboard](#4-user-dashboard)
5. [Login/Signup Page](#5-loginsignup-page)
6. [Pricing Page](#6-pricing-page)
7. [Admin Dashboard](#7-admin-dashboard)
8. [Admin Ads Management](#8-admin-ads-management)
9. [Admin Users Management](#9-admin-users-management)
10. [Admin Reports Management](#10-admin-reports-management)
11. [Admin Archive System](#11-admin-archive-system)
12. [Admin Analytics](#12-admin-analytics)
13. [Admin Settings](#13-admin-settings)
14. [Navigation Bar Component](#14-navigation-bar-component)
15. [Backend API Setup](#15-backend-api-setup)
16. [Archive System Backend](#16-archive-system-backend)
17. [Authentication System](#17-authentication-system)
18. [Database Setup](#18-database-setup)

---

# 1. HOMEPAGE

## 📋 Requirements
- Display ads in a 12-column grid (responsive: 2 mobile, 4-6 tablet, 8-12 desktop)
- Infinite scroll loading (24 ads at a time)
- Square (1:1) ad cards with hover effects
- Filter by category, country, state, city, search
- Show ad count
- Loading indicators
- No footer (infinite scroll)

## ✅ Component Checklist

### HomePage.tsx
```
[ ] Create HomePage functional component with TypeScript
[ ] Import required dependencies (React, useState, useEffect, useInfiniteScroll)
[ ] Set up state management:
    [ ] ads: Ad[] - array of ad objects
    [ ] loading: boolean - loading state
    [ ] hasMore: boolean - more ads available
    [ ] page: number - current page number
    [ ] filters: AdFilters - category, location, search
    [ ] totalAds: number - total ad count

[ ] Implement useEffect for initial data load:
    [ ] Call fetchAds() on component mount
    [ ] Handle loading state
    [ ] Handle errors with try-catch
    [ ] Update totalAds count

[ ] Implement infinite scroll:
    [ ] Use useInfiniteScroll hook
    [ ] Detect when user scrolls within 500px of bottom
    [ ] Call loadMore() function
    [ ] Prevent duplicate loading with loading flag
    [ ] Update page number
    [ ] Append new ads to existing array

[ ] Implement filter handlers:
    [ ] handleCategoryChange(category: string)
    [ ] handleLocationChange(location: Location)
    [ ] handleSearch(query: string)
    [ ] Reset page to 1 when filters change
    [ ] Call fetchAds with new filters

[ ] Create JSX structure:
    [ ] Container div with px-4 padding
    [ ] Ad count display: "X ads found"
    [ ] AdGrid component with ads prop
    [ ] Loading indicator at bottom
    [ ] "No ads found" message when ads.length === 0

[ ] Handle edge cases:
    [ ] Empty state (no ads)
    [ ] Error state (fetch failed)
    [ ] Loading state (first load)
    [ ] No more ads (hasMore === false)

[ ] Add TypeScript types:
    [ ] Import Ad, AdFilters types
    [ ] Type all state variables
    [ ] Type all function parameters
```

### AdGrid.tsx
```
[ ] Create AdGrid functional component
[ ] Props interface:
    [ ] ads: Ad[]
    [ ] onAdClick: (id: string) => void
    [ ] columns?: number (default 12)

[ ] Create grid container:
    [ ] Use Tailwind grid classes
    [ ] grid grid-cols-{columns}
    [ ] gap-3 (12px gap)
    [ ] Responsive breakpoints:
        [ ] grid-cols-2 (mobile)
        [ ] md:grid-cols-4 (tablet)
        [ ] lg:grid-cols-6 (tablet-large)
        [ ] xl:grid-cols-{columns} (desktop)

[ ] Map through ads array:
    [ ] Render AdCard for each ad
    [ ] Pass ad data as props
    [ ] Pass onClick handler
    [ ] Add unique key prop (ad._id)

[ ] Handle empty state:
    [ ] Show message if ads.length === 0
    [ ] Center the message
    [ ] Style with gray text

[ ] Export component
```

### AdCard.tsx
```
[ ] Create AdCard functional component with TypeScript
[ ] Props interface:
    [ ] ad: Ad
    [ ] onClick: () => void

[ ] Create card structure:
    [ ] Outer div: bg-white rounded shadow-sm relative cursor-pointer
    [ ] Add hover effects: hover:shadow-md hover:-translate-y-0.5
    [ ] Add transition: transition-all duration-200

[ ] Image container (1:1 aspect ratio):
    [ ] Wrapper div: relative aspect-square
    [ ] Image element:
        [ ] src={ad.images[0]}
        [ ] alt={ad.title}
        [ ] className="w-full h-full object-cover"
        [ ] loading="lazy"
    [ ] Handle missing image with fallback

[ ] Category badge (top-left):
    [ ] Position: absolute top-1 left-1
    [ ] Get color from CATEGORY_COLORS map
    [ ] Text: text-white text-xs px-1.5 py-0.5 rounded text-[10px]
    [ ] Display: {ad.category}

[ ] Featured badge (conditional):
    [ ] Show if ad.isFeatured === true
    [ ] Position: absolute top-1 left-16
    [ ] Background: bg-yellow-500
    [ ] Display: "★"

[ ] 3-dot menu (top-right):
    [ ] Position: absolute top-1 right-1
    [ ] Background: bg-white/90 rounded-full p-1
    [ ] Hover: hover:bg-white
    [ ] SVG icon (3 vertical dots)
    [ ] onClick: stop propagation
    [ ] Open dropdown menu (implement later)

[ ] Card content section:
    [ ] Container: p-2

[ ] Title:
    [ ] h4 element
    [ ] className: font-semibold text-xs text-gray-800 mb-1 line-clamp-1
    [ ] Display: {ad.title}

[ ] Description:
    [ ] p element
    [ ] className: text-gray-600 text-[9px] mb-1.5 line-clamp-2
    [ ] Display: {ad.shortDescription}

[ ] Meta info (location and time):
    [ ] Container: flex items-center justify-between text-[9px] text-gray-500
    [ ] Location: span with truncate class
    [ ] Time: span with whitespace-nowrap
    [ ] Format time with formatTimeAgo() helper

[ ] Price display (if ad.price exists):
    [ ] Show instead of location
    [ ] Font: font-bold text-blue-600
    [ ] Format: ${ad.price.toLocaleString()}

[ ] Add onClick handler to outer div:
    [ ] Call props.onClick
    [ ] Navigate to ad detail page

[ ] Create formatTimeAgo helper function:
    [ ] Calculate time difference
    [ ] Return "Xm ago", "Xh ago", "Xd ago"

[ ] Export component
```

### LoadingSpinner.tsx
```
[ ] Create LoadingSpinner component
[ ] Props interface:
    [ ] message?: string (default: "Loading more ads...")

[ ] Create structure:
    [ ] Container: flex justify-center items-center py-8
    [ ] SVG spinner:
        [ ] className: animate-spin h-8 w-8 text-blue-600
        [ ] Circle with stroke for spinner effect
    [ ] Text span:
        [ ] className: ml-2 text-gray-600 font-semibold
        [ ] Display: {message}

[ ] Export component
```

## 🔧 Services & Hooks

### ad.service.ts
```
[ ] Create fetchAds function:
    [ ] Parameters:
        [ ] page: number
        [ ] limit: number (default 24)
        [ ] filters?: AdFilters
    [ ] Build query string from filters
    [ ] Make GET request to /api/ads
    [ ] Return: Promise<PaginatedAdsResponse>
    [ ] Handle errors with try-catch
    [ ] Type return value properly

[ ] Export fetchAds function
```

### useInfiniteScroll.ts
```
[ ] Create custom hook: useInfiniteScroll
[ ] Parameters:
    [ ] loading: boolean
    [ ] hasMore: boolean
    [ ] onLoadMore: () => void
    [ ] threshold?: number (default 500)

[ ] Implementation options (choose one):

Option 1: Intersection Observer (preferred)
[ ] Create useRef for observer
[ ] Create lastElementRef callback:
    [ ] Disconnect previous observer
    [ ] Create new IntersectionObserver
    [ ] Observe when entry is intersecting and hasMore
    [ ] Call onLoadMore
[ ] Return lastElementRef

Option 2: Scroll Event
[ ] Create handleScroll function:
    [ ] Check if loading or !hasMore
    [ ] Calculate scroll position
    [ ] Check if within threshold of bottom
    [ ] Call onLoadMore
[ ] Add scroll event listener in useEffect
[ ] Remove listener on cleanup
[ ] Return null

[ ] Add dependencies array properly
[ ] Export hook
```

## 🎨 Styling Requirements

```
[ ] Grid spacing: gap-3 (12px)
[ ] Card border-radius: rounded (6px)
[ ] Card shadow: shadow-sm
[ ] Card hover shadow: shadow-md
[ ] Card hover transform: -translate-y-0.5
[ ] Image aspect ratio: aspect-square (1:1)
[ ] Category badge: rounded, text-[10px]
[ ] Title: text-xs (12px), font-semibold
[ ] Description: text-[9px] (9px)
[ ] Meta text: text-[9px] (9px)
[ ] Responsive columns:
    [ ] Mobile (default): grid-cols-2
    [ ] Tablet (md): grid-cols-4
    [ ] Large tablet (lg): grid-cols-6
    [ ] Desktop (xl): grid-cols-8 to grid-cols-12
```

## 🧪 Testing Checklist

```
[ ] Homepage loads without errors
[ ] Initial 24 ads display correctly
[ ] Infinite scroll triggers at 500px from bottom
[ ] New ads append to existing ads
[ ] No duplicate ads loaded
[ ] Loading indicator shows during fetch
[ ] Ad cards maintain 1:1 aspect ratio on all screens
[ ] Hover effects work on desktop
[ ] Images lazy load properly
[ ] Clicking ad navigates to detail page
[ ] Filter changes trigger new fetch
[ ] Search functionality works
[ ] "No ads found" shows when appropriate
[ ] Category badges show correct colors
[ ] Featured badges show only for featured ads
[ ] Time formatting works correctly (1h ago, 2d ago, etc.)
[ ] Responsive design works on mobile (320px width)
[ ] Responsive design works on tablet (768px width)
[ ] Responsive design works on desktop (1920px width)
[ ] Error handling shows user-friendly messages
[ ] Console has no errors
```

## 📦 Dependencies to Install

```bash
npm install axios
npm install react-router-dom
npm install lodash  # for debounce
npm install date-fns  # for date formatting
```

## 🔗 API Integration

```
Endpoint: GET /api/ads
Query params:
  - page: number
  - limit: number (24)
  - category?: string
  - country?: string
  - state?: string
  - city?: string
  - search?: string

Expected response:
{
  ads: Ad[],
  page: number,
  totalPages: number,
  totalAds: number,
  hasMore: boolean
}
```

---

# 2. AD DETAIL PAGE

## 📋 Requirements
- Display full ad information
- Image gallery with thumbnails
- 2-column layout (70% / 30%)
- Seller contact card (sticky)
- Similar ads section
- Safety tips
- Breadcrumbs
- Social sharing
- View count tracking

## ✅ Component Checklist

### AdDetailPage.tsx
```
[ ] Create AdDetailPage functional component
[ ] Get ad ID from URL params (useParams)
[ ] Set up state:
    [ ] ad: Ad | null
    [ ] loading: boolean
    [ ] error: string | null
    [ ] selectedImage: number (index of current image)
    [ ] similarAds: Ad[]

[ ] Implement useEffect for data fetching:
    [ ] Fetch ad details by ID
    [ ] Fetch similar ads (same category, location)
    [ ] Increment view count
    [ ] Handle loading state
    [ ] Handle error state (404, etc.)

[ ] Create main layout structure:
    [ ] Container: max-w-7xl mx-auto px-4 py-8
    [ ] Breadcrumbs section
    [ ] Grid: grid-cols-1 lg:grid-cols-3 gap-8

[ ] Left column (lg:col-span-2):
    [ ] Image gallery component
    [ ] Ad details section
    [ ] Additional links section

[ ] Right column (lg:col-span-1):
    [ ] Contact card (sticky)
    [ ] Safety tips
    [ ] Similar ads

[ ] Handle edge cases:
    [ ] Ad not found (404)
    [ ] Loading state
    [ ] Error state
    [ ] Deleted/expired ad

[ ] Add SEO meta tags:
    [ ] Title: {ad.title}
    [ ] Description: {ad.shortDescription}
    [ ] OG tags for social sharing
```

### Breadcrumbs Component
```
[ ] Create Breadcrumbs functional component
[ ] Props: ad: Ad

[ ] Create structure:
    [ ] Container: flex items-center space-x-2 text-sm text-gray-600 mb-6
    [ ] Home link (onClick: navigate to /)
    [ ] Separator: "/"
    [ ] Category link
    [ ] Separator: "/"
    [ ] Current page (non-clickable): ad.title

[ ] Style:
    [ ] Links: cursor-pointer hover:text-blue-600
    [ ] Current page: text-gray-800

[ ] Export component
```

### ImageGallery Component
```
[ ] Create ImageGallery functional component
[ ] Props:
    [ ] images: string[]
    [ ] title: string

[ ] State:
    [ ] selectedIndex: number (default 0)

[ ] Main image display:
    [ ] Container: bg-white rounded-lg shadow overflow-hidden mb-6
    [ ] Image: w-full h-96 object-cover
    [ ] Alt text: {title}
    [ ] Click to enlarge (optional lightbox)

[ ] Thumbnail strip:
    [ ] Container: flex space-x-2 p-4 overflow-x-auto
    [ ] Map through images:
        [ ] Each thumbnail: w-24 h-16 object-cover rounded cursor-pointer
        [ ] Active thumbnail: border-2 border-blue-600
        [ ] Hover: border-2 border-blue-600
        [ ] onClick: setSelectedIndex

[ ] Keyboard navigation:
    [ ] Arrow left: previous image
    [ ] Arrow right: next image

[ ] Export component
```

### AdDetailsSection Component
```
[ ] Create AdDetailsSection component
[ ] Props: ad: Ad

[ ] Header section:
    [ ] Category badge
    [ ] Title (text-3xl font-bold)
    [ ] Meta info: location, posted time
    [ ] Favorite button (heart icon)

[ ] Description section:
    [ ] Heading: "Description" (text-xl font-semibold)
    [ ] Full description with formatting
    [ ] Preserve line breaks
    [ ] Render as HTML if needed

[ ] Conditional sections based on category:
    [ ] Jobs: Responsibilities, Requirements, Benefits
    [ ] Products: Specifications, Condition, Brand
    [ ] Real Estate: Bedrooms, Bathrooms, Square footage
    [ ] Events: Date, Time, Venue

[ ] Additional details:
    [ ] Price (if applicable)
    [ ] Location details
    [ ] Posted date
    [ ] Last updated date

[ ] Export component
```

### ContactCard Component
```
[ ] Create ContactCard component (sticky)
[ ] Props: ad: Ad

[ ] Card structure:
    [ ] Container: bg-white rounded-lg shadow p-6 mb-6 sticky top-24
    [ ] Heading: "Contact Advertiser" (text-xl font-semibold)

[ ] Seller info section:
    [ ] Avatar or initials circle
    [ ] Name/Company name
    [ ] Member since date
    [ ] Rating (if implemented)

[ ] Action buttons:
    [ ] "Send Message" button (primary, full width)
        [ ] onClick: open message modal or navigate to messages
    [ ] "Call Now" button (secondary, full width)
        [ ] If phone available
        [ ] Format phone number nicely
    [ ] "Share Ad" button (tertiary, full width)
        [ ] onClick: open share modal
        [ ] Copy link to clipboard
        [ ] Share on social media

[ ] Ad metadata section:
    [ ] Border top
    [ ] Ad ID: #AD-12345
    [ ] Views: 1,234
    [ ] Posted: 2 days ago

[ ] Style:
    [ ] Buttons: mb-3 spacing
    [ ] Primary button: bg-blue-600 text-white
    [ ] Secondary button: border-2 border-blue-600 text-blue-600
    [ ] Tertiary button: border border-gray-300

[ ] Export component
```

### SafetyTips Component
```
[ ] Create SafetyTips component

[ ] Card structure:
    [ ] Container: bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6
    [ ] Warning icon (yellow)
    [ ] Heading: "Safety Tips"

[ ] Tips list:
    [ ] "• Meet in a public place"
    [ ] "• Check the item before you buy"
    [ ] "• Pay only after collecting item"
    [ ] "• Beware of unrealistic offers"
    [ ] Additional tips based on category

[ ] Style:
    [ ] Icon: text-yellow-600
    [ ] Heading: font-semibold text-yellow-800
    [ ] List: text-sm text-yellow-700

[ ] Export component
```

### SimilarAds Component
```
[ ] Create SimilarAds component
[ ] Props:
    [ ] ads: Ad[]
    [ ] onAdClick: (id: string) => void

[ ] Card structure:
    [ ] Container: bg-white rounded-lg shadow p-6
    [ ] Heading: "Similar Ads" (text-lg font-semibold mb-4)

[ ] Ads list:
    [ ] Map through ads (max 3)
    [ ] Each ad item:
        [ ] Container: flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded
        [ ] Image: w-20 h-20 object-cover rounded
        [ ] Details:
            [ ] Title (font-semibold text-sm)
            [ ] Location (text-xs text-gray-600)
            [ ] Price (text-sm font-bold text-blue-600)
        [ ] onClick: navigate to ad detail

[ ] Empty state:
    [ ] Show "No similar ads found" if ads.length === 0

[ ] Export component
```

### AdditionalLinks Component
```
[ ] Create AdditionalLinks component
[ ] Props: links: { link1?: string, link2?: string }

[ ] Show only if links exist
[ ] Card structure:
    [ ] Container: bg-white rounded-lg shadow p-6
    [ ] Heading: "Additional Resources"

[ ] Link items:
    [ ] Map through available links
    [ ] Each link:
        [ ] Container: flex items-center justify-between p-3 border rounded-lg
        [ ] Hover: border-blue-600 bg-blue-50
        [ ] Icon (link icon)
        [ ] Label: "Company Website" or "Apply on LinkedIn"
        [ ] External link icon
        [ ] Open in new tab (target="_blank" rel="noopener noreferrer")

[ ] Export component
```

## 🔧 Services

### ad.service.ts (add functions)
```
[ ] Create fetchAdById function:
    [ ] Parameter: id: string
    [ ] GET request: /api/ads/:id
    [ ] Return: Promise<Ad>
    [ ] Handle 404 error
    [ ] Increment view count

[ ] Create fetchSimilarAds function:
    [ ] Parameters: adId: string, category: string, location: Location
    [ ] GET request: /api/ads/similar
    [ ] Query params: category, location
    [ ] Exclude current ad
    [ ] Limit: 3 ads
    [ ] Return: Promise<Ad[]>

[ ] Export functions
```

## 🎨 Styling Requirements

```
[ ] Container max-width: max-w-7xl
[ ] Grid gap: gap-8
[ ] Left column: lg:col-span-2
[ ] Right column: lg:col-span-1 (sticky top-24)
[ ] Image height: h-96
[ ] Thumbnail size: w-24 h-16
[ ] Card shadow: shadow-lg
[ ] Button spacing: mb-3
[ ] Section spacing: mb-6
[ ] Heading sizes: text-3xl (title), text-xl (sections), text-lg (similar)
```

## 🧪 Testing Checklist

```
[ ] Page loads with correct ad data
[ ] Breadcrumbs show correct path
[ ] Image gallery displays all images
[ ] Thumbnail selection works
[ ] Full description displays correctly
[ ] Category-specific fields show
[ ] Contact card is sticky on scroll
[ ] "Send Message" button works
[ ] "Call Now" button works (if phone exists)
[ ] "Share" button copies link to clipboard
[ ] View count increments
[ ] Similar ads load and display
[ ] Similar ads click navigation works
[ ] Safety tips display
[ ] Additional links open in new tab
[ ] 404 error handles gracefully
[ ] Loading state shows
[ ] Responsive on mobile (single column)
[ ] Responsive on tablet (adjusted layout)
[ ] SEO meta tags present
[ ] Social sharing works
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint 1: GET /api/ads/:id
Response: Ad object

Endpoint 2: GET /api/ads/similar
Query params:
  - category: string
  - city: string
  - exclude: string (current ad ID)
  - limit: 3
Response: Ad[]

Endpoint 3: POST /api/ads/:id/view
Response: { views: number }
```

---

# 3. POST AD PAGE

## 📋 Requirements
- Multi-step form or single page form
- All required fields validated
- Image upload with drag & drop
- Max 5 images, 5MB each
- Character counters for title and description
- Location dropdowns (cascading)
- Optional fields clearly marked
- Free tier info display
- Draft save functionality
- Form validation with error messages
- Success message and redirect

## ✅ Component Checklist

### PostAdPage.tsx
```
[ ] Create PostAdPage functional component
[ ] Check authentication (redirect to login if not authenticated)
[ ] Initialize react-hook-form:
    [ ] const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PostAdFormData>()

[ ] Set up state:
    [ ] uploadedImages: File[]
    [ ] uploadProgress: number
    [ ] isSubmitting: boolean
    [ ] categories: Category[]
    [ ] countries: Country[]
    [ ] states: State[]
    [ ] cities: City[]

[ ] Fetch location data:
    [ ] Load countries on mount
    [ ] Load states when country selected
    [ ] Load cities when state selected

[ ] Watch form values for character counts:
    [ ] const title = watch('title')
    [ ] const shortDescription = watch('shortDescription')
    [ ] Update character counters

[ ] Image upload handlers:
    [ ] handleImageUpload(files: FileList)
    [ ] handleImageRemove(index: number)
    [ ] handleDragOver(e: DragEvent)
    [ ] handleDrop(e: DragEvent)
    [ ] Validate: max 5 images, max 5MB each
    [ ] Show preview thumbnails

[ ] Form submission handler:
    [ ] onSubmit(data: PostAdFormData)
    [ ] Upload images first (get URLs)
    [ ] Create ad object
    [ ] POST to /api/ads
    [ ] Handle success: show message, redirect to ad detail
    [ ] Handle error: show error message

[ ] Save draft handler:
    [ ] saveDraft(data: PostAdFormData)
    [ ] Save to localStorage or backend
    [ ] Show success toast

[ ] Create form JSX structure:
    [ ] Card container: bg-white rounded-lg shadow-lg p-8
    [ ] Form heading and description
    [ ] Form element with onSubmit={handleSubmit(onSubmit)}
    [ ] All form fields (see below)
    [ ] Terms checkbox
    [ ] Action buttons (Publish and Save Draft)

[ ] Add TypeScript types:
    [ ] PostAdFormData interface
    [ ] Image upload types
    [ ] Form validation types
```

### Form Fields Components

#### CategorySelect
```
[ ] Create CategorySelect component
[ ] Props: register, error

[ ] Field structure:
    [ ] Label: "Category *"
    [ ] Select element:
        [ ] {...register('category', { required: 'Category is required' })}
        [ ] className with focus styles
        [ ] Options: map through CATEGORIES
    [ ] Error message display (if error exists)

[ ] Export component
```

#### TitleInput
```
[ ] Create TitleInput component
[ ] Props: register, error, value

[ ] Field structure:
    [ ] Label: "Ad Title *"
    [ ] Input element:
        [ ] type="text"
        [ ] maxLength={50}
        [ ] placeholder="e.g., Senior Software Engineer"
        [ ] {...register('title', {
            required: 'Title is required',
            maxLength: { value: 50, message: 'Max 50 characters' }
          })}
    [ ] Character counter: "{value?.length || 0}/50 characters"
    [ ] Error message display

[ ] Export component
```

#### ShortDescriptionInput
```
[ ] Create ShortDescriptionInput component
[ ] Props: register, error, value

[ ] Field structure:
    [ ] Label: "Short Description *"
    [ ] Textarea element:
        [ ] rows={3}
        [ ] maxLength={150}
        [ ] placeholder="Brief description that will appear on the ad card..."
        [ ] {...register('shortDescription', {
            required: 'Short description is required',
            maxLength: { value: 150, message: 'Max 150 characters' }
          })}
    [ ] Character counter: "{value?.length || 0}/150 characters"
    [ ] Helper text: "This appears on the listing page"
    [ ] Error message display

[ ] Export component
```

#### FullDescriptionInput
```
[ ] Create FullDescriptionInput component
[ ] Props: register, error

[ ] Field structure:
    [ ] Label: "Full Description *"
    [ ] Textarea element:
        [ ] rows={8}
        [ ] placeholder="Detailed description of your ad..."
        [ ] {...register('fullDescription', {
            required: 'Full description is required',
            minLength: { value: 20, message: 'Min 20 characters' }
          })}
    [ ] Helper text: "This will be shown on the ad detail page"
    [ ] Error message display

[ ] Export component
```

#### ImageUploadSection
```
[ ] Create ImageUploadSection component
[ ] Props:
    [ ] images: File[]
    [ ] onUpload: (files: FileList) => void
    [ ] onRemove: (index: number) => void
    [ ] maxImages: number (5)
    [ ] maxSize: number (5MB)

[ ] Hidden file input:
    [ ] ref={fileInputRef}
    [ ] type="file"
    [ ] accept="image/*"
    [ ] multiple
    [ ] onChange handler

[ ] Drag & drop zone:
    [ ] Container: border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
    [ ] Hover state: border-blue-500
    [ ] onDragOver: prevent default, add hover class
    [ ] onDragLeave: remove hover class
    [ ] onDrop: handle file drop, prevent default
    [ ] onClick: trigger file input click

[ ] Drop zone content:
    [ ] Upload icon (cloud with arrow)
    [ ] "Click to upload or drag and drop"
    [ ] File type and size info: "PNG, JPG up to 5MB (Max 5 images)"

[ ] Image preview section:
    [ ] Show if images.length > 0
    [ ] Grid of thumbnails: grid grid-cols-5 gap-4 mt-4
    [ ] Each image:
        [ ] Container: relative
        [ ] Image preview: w-full h-24 object-cover rounded
        [ ] Remove button (X icon): absolute top-1 right-1
        [ ] onClick remove: call onRemove(index)

[ ] Validation messages:
    [ ] Show error if trying to upload more than 5 images
    [ ] Show error if file size exceeds 5MB
    [ ] Show error if file type not allowed

[ ] Export component
```

#### LocationSelectors
```
[ ] Create LocationSelectors component
[ ] Props:
    [ ] register
    [ ] errors
    [ ] setValue
    [ ] countries: Country[]
    [ ] states: State[]
    [ ] cities: City[]
    [ ] onCountryChange: (id: string) => void
    [ ] onStateChange: (id: string) => void

[ ] Create 3-column grid: grid grid-cols-1 md:grid-cols-3 gap-4

[ ] Country dropdown:
    [ ] Label: "Country *"
    [ ] Select element
    [ ] {...register('country', { required: 'Country is required' })}
    [ ] onChange: trigger onCountryChange, reset state and city
    [ ] Map through countries

[ ] State dropdown:
    [ ] Label: "State *"
    [ ] Select element
    [ ] {...register('state', { required: 'State is required' })}
    [ ] onChange: trigger onStateChange, reset city
    [ ] Disabled if no country selected
    [ ] Map through states

[ ] City dropdown:
    [ ] Label: "City *"
    [ ] Select element
    [ ] {...register('city', { required: 'City is required' })}
    [ ] Disabled if no state selected
    [ ] Map through cities

[ ] Error messages for each field

[ ] Export component
```

#### AdditionalLinksInputs
```
[ ] Create AdditionalLinksInputs component
[ ] Props: register, errors

[ ] Link 1 field:
    [ ] Label: "Link 1 (Optional)"
    [ ] Input type="url"
    [ ] Placeholder: "https://example.com/more-info"
    [ ] {...register('link1', {
        pattern: {
          value: /^https?:\/\/.+/,
          message: 'Enter valid URL starting with http:// or https://'
        }
      })}
    [ ] Helper text: "Company website, LinkedIn, or related link"
    [ ] Error message

[ ] Link 2 field:
    [ ] Label: "Link 2 (Optional)"
    [ ] Input type="url"
    [ ] Placeholder: "https://example.com/apply"
    [ ] {...register('link2', {
        pattern: {
          value: /^https?:\/\/.+/,
          message: 'Enter valid URL'
        }
      })}
    [ ] Helper text: "Application page, portfolio, or additional resource"
    [ ] Error message

[ ] Export component
```

#### PriceInput
```
[ ] Create PriceInput component
[ ] Props: register, error

[ ] Field structure:
    [ ] Label: "Price (Optional)"
    [ ] Input container with $ prefix:
        [ ] Span: $ symbol (inline-flex items-center px-4 bg-gray-100)
        [ ] Input: type="number", min="0", step="0.01"
        [ ] {...register('price', {
            min: { value: 0, message: 'Price must be positive' },
            validate: (value) => !value || value <= 999999999 || 'Price too high'
          })}
    [ ] Error message

[ ] Export component
```

#### ContactInputs
```
[ ] Create ContactInputs component
[ ] Props: register, errors

[ ] 2-column grid: grid grid-cols-1 md:grid-cols-2 gap-4

[ ] Email field:
    [ ] Label: "Contact Email *"
    [ ] Input type="email"
    [ ] Placeholder: "your@email.com"
    [ ] {...register('email', {
        required: 'Email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Enter valid email'
        }
      })}
    [ ] Error message

[ ] Phone field:
    [ ] Label: "Phone Number (Optional)"
    [ ] Input type="tel"
    [ ] Placeholder: "+1 (555) 123-4567"
    [ ] {...register('phone', {
        pattern: {
          value: /^[\d\s\-\+\(\)]+$/,
          message: 'Enter valid phone number'
        }
      })}
    [ ] Error message

[ ] Export component
```

#### FreeTierInfoBox
```
[ ] Create FreeTierInfoBox component
[ ] Props: adsRemaining: number, totalFreeAds: number

[ ] Info box structure:
    [ ] Container: bg-blue-50 border border-blue-200 rounded-lg p-4
    [ ] Icon: info icon (blue)
    [ ] Heading: "Free Tier"
    [ ] Message:
        [ ] "You have {adsRemaining} out of {totalFreeAds} free ads remaining this month."
        [ ] "Your ad will be active for 30 days."
    [ ] If adsRemaining === 0:
        [ ] Show warning message
        [ ] Link to upgrade page

[ ] Export component
```

#### TermsCheckbox
```
[ ] Create TermsCheckbox component
[ ] Props: register, error

[ ] Checkbox structure:
    [ ] Container: flex items-start
    [ ] Input checkbox:
        [ ] {...register('agreeToTerms', {
            required: 'You must agree to the terms'
          })}
    [ ] Label: "I agree to the Terms of Service and Privacy Policy"
    [ ] Links in label (underlined, blue)
    [ ] Error message below

[ ] Export component
```

### FormActionButtons
```
[ ] Create FormActionButtons component
[ ] Props:
    [ ] isSubmitting: boolean
    [ ] onSaveDraft: () => void

[ ] Button container: flex space-x-4 pt-4

[ ] Publish button:
    [ ] type="submit"
    [ ] className: flex-1 bg-blue-600 text-white py-4 rounded-lg
    [ ] Disabled when isSubmitting
    [ ] Loading spinner when isSubmitting
    [ ] Text: "Publish Ad" or "Publishing..."

[ ] Save Draft button:
    [ ] type="button"
    [ ] onClick: onSaveDraft
    [ ] className: px-8 border border-gray-300 text-gray-700 py-4 rounded-lg
    [ ] Text: "Save Draft"

[ ] Export component
```

## 🔧 Services

### ad.service.ts (add functions)
```
[ ] Create createAd function:
    [ ] Parameter: adData: CreateAdRequest
    [ ] POST request: /api/ads
    [ ] Return: Promise<Ad>
    [ ] Handle auth token
    [ ] Handle validation errors

[ ] Create uploadImages function:
    [ ] Parameter: images: File[]
    [ ] POST request: /api/upload/images
    [ ] Use FormData for multipart upload
    [ ] Track upload progress
    [ ] Return: Promise<string[]> (image URLs)

[ ] Export functions
```

### location.service.ts
```
[ ] Create fetchCountries function:
    [ ] GET request: /api/locations/countries
    [ ] Return: Promise<Country[]>

[ ] Create fetchStates function:
    [ ] Parameter: countryId: string
    [ ] GET request: /api/locations/states/:countryId
    [ ] Return: Promise<State[]>

[ ] Create fetchCities function:
    [ ] Parameter: stateId: string
    [ ] GET request: /api/locations/cities/:stateId
    [ ] Return: Promise<City[]>

[ ] Export functions
```

## 🎨 Styling Requirements

```
[ ] Form container: max-w-4xl mx-auto px-4 py-12
[ ] Card: bg-white rounded-lg shadow-lg p-8
[ ] Input fields: w-full px-4 py-3 border border-gray-300 rounded-lg
[ ] Focus state: focus:outline-none focus:ring-2 focus:ring-blue-500
[ ] Error border: border-red-500
[ ] Error text: text-sm text-red-600 mt-1
[ ] Label: block text-sm font-semibold text-gray-700 mb-2
[ ] Helper text: text-sm text-gray-500 mt-1
[ ] Character counter: text-sm text-gray-500
[ ] Button primary: bg-blue-600 hover:bg-blue-700 text-white font-semibold
[ ] Button secondary: border border-gray-300 hover:bg-gray-50 text-gray-700
```

## 🧪 Testing Checklist

```
[ ] Form loads correctly
[ ] All fields render properly
[ ] Authentication check works (redirect if not logged in)
[ ] Country dropdown loads countries
[ ] State dropdown loads when country selected
[ ] City dropdown loads when state selected
[ ] State resets when country changes
[ ] City resets when state changes
[ ] Character counter updates for title
[ ] Character counter updates for short description
[ ] Title max length enforced (50 chars)
[ ] Short description max length enforced (150 chars)
[ ] Image upload via click works
[ ] Image upload via drag & drop works
[ ] Image preview displays
[ ] Image removal works
[ ] Max 5 images enforced
[ ] Max 5MB per image enforced
[ ] Invalid file types rejected
[ ] All required field validation works
[ ] Email validation works
[ ] URL validation works (links)
[ ] Phone validation works
[ ] Price validation works (positive number)
[ ] Terms checkbox validation works
[ ] Form submits successfully
[ ] Success message shows
[ ] Redirect to ad detail after publish
[ ] Save draft works
[ ] Error messages display correctly
[ ] Loading state shows during submission
[ ] Responsive on mobile
[ ] Free tier info displays correctly
[ ] Upload progress shows (if implemented)
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint 1: POST /api/ads
Headers: Authorization: Bearer {token}
Body: {
  title, shortDescription, fullDescription, category,
  images[], location: {country, state, city},
  links: {link1?, link2?}, price?, contact: {email, phone?}
}
Response: Ad object

Endpoint 2: POST /api/upload/images
Headers: Authorization: Bearer {token}
Body: FormData with images
Response: { urls: string[] }

Endpoint 3: GET /api/locations/countries
Response: Country[]

Endpoint 4: GET /api/locations/states/:countryId
Response: State[]

Endpoint 5: GET /api/locations/cities/:stateId
Response: City[]
```

---

# 4. USER DASHBOARD

## 📋 Requirements
- Display user statistics (4 cards)
- Show active ads list
- Tabs: My Ads | Favorites | Settings
- Edit/Delete ad functionality
- Ad expiry countdown
- Renew ad option
- View count per ad
- Subscription tier display
- Link to upgrade/pricing page

## ✅ Component Checklist

### DashboardPage.tsx
```
[ ] Create DashboardPage functional component
[ ] Check authentication (redirect to login if not authenticated)
[ ] Fetch user data from AuthContext

[ ] Set up state:
    [ ] activeTab: 'my-ads' | 'favorites' | 'settings'
    [ ] myAds: Ad[]
    [ ] favorites: Ad[]
    [ ] stats: DashboardStats
    [ ] loading: boolean

[ ] Implement useEffect for data fetching:
    [ ] Fetch user's ads
    [ ] Fetch user's favorites
    [ ] Fetch dashboard stats
    [ ] Handle loading state
    [ ] Handle errors

[ ] Create page structure:
    [ ] Container: max-w-7xl mx-auto px-4 py-12
    [ ] Page heading section
    [ ] Stats cards grid
    [ ] Tabs section
    [ ] Tab content (conditional render based on activeTab)

[ ] Tab switching handler:
    [ ] setActiveTab(tab)
    [ ] Update URL params (optional)

[ ] Export component
```

### DashboardStats Component
```
[ ] Create DashboardStats component
[ ] Props: stats: DashboardStats

[ ] Grid structure:
    [ ] Container: grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8

[ ] Create 4 StatsCard components:

StatsCard 1 - Active Ads:
[ ] Icon: document icon (blue)
[ ] Label: "Active Ads"
[ ] Value: stats.activeAds
[ ] Background: bg-blue-100
[ ] Icon color: text-blue-600

StatsCard 2 - Total Views:
[ ] Icon: eye icon (green)
[ ] Label: "Total Views"
[ ] Value: stats.totalViews.toLocaleString()
[ ] Background: bg-green-100
[ ] Icon color: text-green-600

StatsCard 3 - Free Ads Left:
[ ] Icon: dollar icon (purple)
[ ] Label: "Free Ads Left"
[ ] Value: `${stats.adsRemaining}/${stats.totalFreeAds}`
[ ] Background: bg-purple-100
[ ] Icon color: text-purple-600

StatsCard 4 - Subscription:
[ ] Icon: star icon (yellow)
[ ] Label: "Subscription"
[ ] Value: stats.subscriptionTier (capitalize)
[ ] Link: "Upgrade" button if free tier
[ ] Background: bg-yellow-100
[ ] Icon color: text-yellow-600

[ ] Export component
```

### StatsCard Component
```
[ ] Create StatsCard component
[ ] Props:
    [ ] icon: ReactNode
    [ ] label: string
    [ ] value: string | number
    [ ] bgColor: string
    [ ] actionButton?: ReactNode

[ ] Card structure:
    [ ] Container: bg-white rounded-lg shadow p-6
    [ ] Flex container: flex items-center justify-between

[ ] Left side:
    [ ] Label (text-sm text-gray-600 mb-1)
    [ ] Value (text-3xl font-bold text-gray-800)

[ ] Right side:
    [ ] Icon container: w-12 h-12 rounded-full flex items-center justify-center
    [ ] Background: {bgColor}
    [ ] Icon with color

[ ] Action button (if provided):
    [ ] Below value
    [ ] Small text-sm button

[ ] Export component
```

### DashboardTabs Component
```
[ ] Create DashboardTabs component
[ ] Props:
    [ ] activeTab: string
    [ ] onTabChange: (tab: string) => void

[ ] Tabs structure:
    [ ] Container: bg-white rounded-lg shadow overflow-hidden
    [ ] Border bottom

[ ] Tab buttons container:
    [ ] Flex: flex space-x-8 px-6

[ ] Tab buttons (My Ads, Favorites, Settings):
    [ ] Button element
    [ ] onClick: onTabChange
    [ ] Active styling: border-b-2 border-blue-600 text-blue-600 font-semibold
    [ ] Inactive styling: border-transparent text-gray-600 font-semibold
    [ ] Hover: hover:text-gray-800
    [ ] Padding: py-4

[ ] Export component
```

### MyAdsList Component
```
[ ] Create MyAdsList component
[ ] Props:
    [ ] ads: Ad[]
    [ ] onEdit: (id: string) => void
    [ ] onDelete: (id: string) => void
    [ ] onRenew: (id: string) => void

[ ] Container structure:
    [ ] Padding: p-6

[ ] Header section:
    [ ] Flex: flex justify-between items-center mb-6
    [ ] Heading: "Your Active Listings"
    [ ] "New Ad" button (navigate to /post-ad)

[ ] Ads list:
    [ ] Map through ads
    [ ] Render AdRow for each ad
    [ ] Pass handlers as props
    [ ] Empty state if no ads: "You haven't posted any ads yet"

[ ] Export component
```

### AdRow Component
```
[ ] Create AdRow component
[ ] Props:
    [ ] ad: Ad
    [ ] onEdit: () => void
    [ ] onDelete: () => void
    [ ] onRenew: () => void

[ ] Row container:
    [ ] Border: border border-gray-200 rounded-lg p-4
    [ ] Hover: hover:shadow-md transition
    [ ] Margin: mb-4

[ ] Flex layout: flex items-start space-x-4

[ ] Image section:
    [ ] Image: w-24 h-24 object-cover rounded
    [ ] Alt: {ad.title}

[ ] Content section (flex-1):
    [ ] Top row: flex justify-between

Left content:
[ ] Category badge
[ ] Title (text-lg font-semibold)
[ ] Location (text-sm text-gray-600)
[ ] Stats row:
    [ ] View icon + count
    [ ] Posted date
    [ ] Status badge (color-coded)

Right content:
[ ] Action buttons:
    [ ] Edit button (border, small)
    [ ] Delete button (border-red, small)

[ ] Expiry section (if close to expiry):
    [ ] Container: bg-gray-50 rounded-lg p-3 mt-3
    [ ] Flex: flex justify-between items-center
    [ ] Text: "Expires in: X days"
    [ ] Renew button (text-blue-600, font-semibold)

[ ] Export component
```

### FavoritesList Component
```
[ ] Create FavoritesList component
[ ] Props:
    [ ] favorites: Ad[]
    [ ] onRemove: (id: string) => void

[ ] Container: p-6

[ ] Heading: "Your Favorites"

[ ] Grid of favorite ads:
    [ ] Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
    [ ] Map through favorites
    [ ] Render FavoriteCard for each
    [ ] Pass onRemove handler

[ ] Empty state:
    [ ] Message: "You haven't favorited any ads yet"
    [ ] Icon: heart outline (gray)
    [ ] Button: "Browse Ads"

[ ] Export component
```

### FavoriteCard Component
```
[ ] Create FavoriteCard component
[ ] Props:
    [ ] ad: Ad
    [ ] onRemove: () => void

[ ] Card structure:
    [ ] Container: bg-white border rounded-lg overflow-hidden
    [ ] Hover: hover:shadow-md
    [ ] Cursor: cursor-pointer

[ ] Image section:
    [ ] Image: w-full h-48 object-cover
    [ ] Relative positioning
    [ ] Remove button (heart filled icon, red)
        [ ] Position: absolute top-2 right-2
        [ ] Background: bg-white/90 rounded-full p-2
        [ ] onClick: onRemove (stop propagation)

[ ] Content section:
    [ ] Padding: p-3
    [ ] Title (font-semibold)
    [ ] Location (text-sm text-gray-600)
    [ ] Price (font-bold text-blue-600)

[ ] onClick: navigate to ad detail

[ ] Export component
```

### SettingsTab Component
```
[ ] Create SettingsTab component
[ ] Props: user: User

[ ] Container: p-6

[ ] Heading: "Account Settings"

[ ] Settings sections:

Profile Section:
[ ] Subheading: "Profile Information"
[ ] Form fields:
    [ ] Name input
    [ ] Email input (disabled)
    [ ] Phone input
    [ ] Avatar upload
[ ] Save button

Password Section:
[ ] Subheading: "Change Password"
[ ] Form fields:
    [ ] Current password
    [ ] New password
    [ ] Confirm new password
[ ] Change Password button

Notifications Section:
[ ] Subheading: "Notification Preferences"
[ ] Checkboxes:
    [ ] Email notifications
    [ ] New messages
    [ ] Ad expiring soon
    [ ] Marketing emails
[ ] Save Preferences button

Danger Zone:
[ ] Subheading: "Danger Zone" (text-red-600)
[ ] Delete Account button (bg-red-600)
[ ] Confirmation modal

[ ] Export component
```

### DeleteConfirmationModal Component
```
[ ] Create DeleteConfirmationModal component
[ ] Props:
    [ ] isOpen: boolean
    [ ] onClose: () => void
    [ ] onConfirm: () => void
    [ ] itemType: 'ad' | 'account'
    [ ] itemName?: string

[ ] Modal structure:
    [ ] Backdrop: fixed inset-0 bg-black/50 z-50
    [ ] Modal container: centered, max-w-md
    [ ] Card: bg-white rounded-lg p-6

[ ] Content:
    [ ] Warning icon (red)
    [ ] Heading: "Delete {itemType}?"
    [ ] Message: Are you sure warning
    [ ] If itemName: mention the name
    [ ] "This action cannot be undone"

[ ] Action buttons:
    [ ] Cancel button (secondary)
    [ ] Delete button (bg-red-600, confirm text)

[ ] Click backdrop to close
[ ] ESC key to close

[ ] Export component
```

## 🔧 Services

### user.service.ts
```
[ ] Create fetchDashboardStats function:
    [ ] GET request: /api/users/dashboard/stats
    [ ] Return: Promise<DashboardStats>

[ ] Create fetchMyAds function:
    [ ] GET request: /api/ads/my-ads
    [ ] Return: Promise<Ad[]>

[ ] Create fetchFavorites function:
    [ ] GET request: /api/users/favorites
    [ ] Return: Promise<Ad[]>

[ ] Create updateUser function:
    [ ] Parameter: userData: UpdateUserRequest
    [ ] PUT request: /api/users/:id
    [ ] Return: Promise<User>

[ ] Create deleteUser function:
    [ ] DELETE request: /api/users/:id
    [ ] Return: Promise<void>

[ ] Create renewAd function:
    [ ] Parameter: adId: string
    [ ] POST request: /api/ads/:id/renew
    [ ] Return: Promise<Ad>

[ ] Export functions
```

## 🎨 Styling Requirements

```
[ ] Container: max-w-7xl mx-auto px-4 py-12
[ ] Stats grid: grid-cols-1 lg:grid-cols-4 gap-6
[ ] Stats card: bg-white rounded-lg shadow p-6
[ ] Tabs: border-b with active indicator
[ ] Ad row: border rounded-lg p-4 mb-4
[ ] Action buttons: px-4 py-2 border rounded
[ ] Edit button: border-gray-300 hover:bg-gray-50
[ ] Delete button: border-red-300 text-red-600 hover:bg-red-50
[ ] Renew button: text-blue-600 hover:text-blue-700
[ ] Empty state: centered, gray text, icon
```

## 🧪 Testing Checklist

```
[ ] Dashboard loads with user data
[ ] Stats cards display correct values
[ ] Stats cards format numbers correctly (commas)
[ ] Active Ads count matches
[ ] Total Views displays correctly
[ ] Free Ads Left shows fraction
[ ] Subscription tier displays
[ ] Upgrade link shows for free users
[ ] My Ads tab loads user's ads
[ ] Ads display with correct info
[ ] Edit button navigates to edit page
[ ] Delete button shows confirmation modal
[ ] Delete confirmation works
[ ] Renew button works
[ ] Expiry countdown shows correctly
[ ] Favorites tab loads favorites
[ ] Favorite cards display correctly
[ ] Remove favorite works
[ ] Settings tab loads user info
[ ] Profile update works
[ ] Password change works
[ ] Notification preferences save
[ ] Delete account requires confirmation
[ ] Empty states show appropriately
[ ] Loading states display
[ ] Error handling works
[ ] Responsive on mobile
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint 1: GET /api/users/dashboard/stats
Headers: Authorization: Bearer {token}
Response: {
  activeAds: number,
  totalViews: number,
  adsRemaining: number,
  totalFreeAds: number,
  subscriptionTier: string
}

Endpoint 2: GET /api/ads/my-ads
Headers: Authorization: Bearer {token}
Response: Ad[]

Endpoint 3: GET /api/users/favorites
Headers: Authorization: Bearer {token}
Response: Ad[]

Endpoint 4: PUT /api/users/:id
Headers: Authorization: Bearer {token}
Body: { name?, phone?, avatar? }
Response: User

Endpoint 5: DELETE /api/ads/:id
Headers: Authorization: Bearer {token}
Response: { success: boolean }

Endpoint 6: POST /api/ads/:id/renew
Headers: Authorization: Bearer {token}
Response: Ad (with updated expiresAt)
```

---

# 5. LOGIN/SIGNUP PAGE

## 📋 Requirements
- Tabbed interface (Sign In | Sign Up)
- Email + Password authentication
- Remember me checkbox
- Forgot password link
- Social login (Google, GitHub)
- Form validation
- Loading states
- Error messages
- Redirect after successful login
- Responsive centered card

## ✅ Component Checklist

### LoginPage.tsx
```
[ ] Create LoginPage functional component
[ ] Check if already authenticated (redirect to dashboard if yes)

[ ] Set up state:
    [ ] activeTab: 'signin' | 'signup'
    [ ] isLoading: boolean
    [ ] error: string | null

[ ] Create page structure:
    [ ] Container: min-h-screen flex items-center justify-center px-4 py-12
    [ ] Card container: max-w-md w-full
    [ ] Header section (title and description)
    [ ] Tab switcher
    [ ] Form section (conditional based on activeTab)

[ ] Tab switching:
    [ ] onClick: setActiveTab, clear errors

[ ] Export component
```

### SignInForm Component
```
[ ] Create SignInForm functional component
[ ] Use react-hook-form:
    [ ] const { register, handleSubmit, formState: { errors } } = useForm<SignInData>()

[ ] Set up state:
    [ ] isLoading: boolean
    [ ] error: string | null
    [ ] rememberMe: boolean

[ ] Form submission handler:
    [ ] onSubmit(data: SignInData)
    [ ] Set isLoading true
    [ ] Call authService.login(email, password)
    [ ] Store token (localStorage or cookie)
    [ ] Update AuthContext
    [ ] Redirect to dashboard or returnUrl
    [ ] Handle errors (show error message)
    [ ] Set isLoading false

[ ] Create form JSX:
    [ ] Form element with onSubmit
    [ ] Email field with validation
    [ ] Password field with validation
    [ ] Remember me checkbox
    [ ] Forgot password link
    [ ] Submit button
    [ ] Error message display
    [ ] Social login section

[ ] Email field:
    [ ] Label: "Email"
    [ ] Input type="email"
    [ ] {...register('email', {
        required: 'Email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Enter valid email'
        }
      })}
    [ ] Error message display

[ ] Password field:
    [ ] Label: "Password"
    [ ] Input type="password"
    [ ] {...register('password', {
        required: 'Password is required',
        minLength: { value: 6, message: 'Min 6 characters' }
      })}
    [ ] Error message display

[ ] Remember me section:
    [ ] Flex: flex items-center justify-between
    [ ] Checkbox with label
    [ ] Forgot password link (text-blue-600)

[ ] Submit button:
    [ ] Full width: w-full
    [ ] Background: bg-blue-600 hover:bg-blue-700
    [ ] Disabled when isLoading
    [ ] Loading spinner when isLoading
    [ ] Text: "Sign In" or "Signing in..."

[ ] Or divider:
    [ ] Horizontal line with "Or continue with" text centered

[ ] Social login buttons:
    [ ] Grid: grid-cols-2 gap-4
    [ ] Google button with icon
    [ ] GitHub button with icon

[ ] Export component
```

### SignUpForm Component
```
[ ] Create SignUpForm functional component
[ ] Use react-hook-form

[ ] Set up state:
    [ ] isLoading: boolean
    [ ] error: string | null

[ ] Form submission handler:
    [ ] onSubmit(data: SignUpData)
    [ ] Validate password confirmation
    [ ] Set isLoading true
    [ ] Call authService.register(data)
    [ ] Auto-login after registration
    [ ] Redirect to dashboard
    [ ] Handle errors
    [ ] Set isLoading false

[ ] Create form JSX:
    [ ] Name field with validation
    [ ] Email field with validation
    [ ] Password field with validation
    [ ] Confirm password field with validation
    [ ] Terms checkbox
    [ ] Submit button
    [ ] Social signup buttons

[ ] Name field:
    [ ] Label: "Full Name"
    [ ] Input type="text"
    [ ] {...register('name', {
        required: 'Name is required',
        minLength: { value: 2, message: 'Min 2 characters' }
      })}
    [ ] Error message

[ ] Email field:
    [ ] Label: "Email"
    [ ] Input type="email"
    [ ] Validation (same as sign in)
    [ ] Error message

[ ] Password field:
    [ ] Label: "Password"
    [ ] Input type="password"
    [ ] {...register('password', {
        required: 'Password is required',
        minLength: { value: 8, message: 'Min 8 characters' },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: 'Include uppercase, lowercase, and number'
        }
      })}
    [ ] Password strength indicator
    [ ] Error message

[ ] Confirm password field:
    [ ] Label: "Confirm Password"
    [ ] Input type="password"
    [ ] {...register('confirmPassword', {
        required: 'Please confirm password',
        validate: (value) => value === password || 'Passwords do not match'
      })}
    [ ] Error message

[ ] Terms checkbox:
    [ ] Label with links to Terms and Privacy
    [ ] {...register('agreeToTerms', {
        required: 'You must agree to the terms'
      })}
    [ ] Error message

[ ] Submit button:
    [ ] Same styling as sign in
    [ ] Text: "Create Account" or "Creating..."

[ ] Social signup buttons (same as sign in)

[ ] Export component
```

### SocialLoginButton Component
```
[ ] Create SocialLoginButton component
[ ] Props:
    [ ] provider: 'google' | 'github'
    [ ] onClick: () => void

[ ] Button structure:
    [ ] Flex: flex items-center justify-center
    [ ] Padding: px-4 py-3
    [ ] Border: border border-gray-300
    [ ] Rounded: rounded-lg
    [ ] Hover: hover:bg-gray-50

[ ] Icon section:
    [ ] Google: Google logo SVG
    [ ] GitHub: GitHub logo SVG
    [ ] Size: w-5 h-5

[ ] Text:
    [ ] Margin: ml-2
    [ ] Capitalize provider name

[ ] Export component
```

### ForgotPasswordModal Component
```
[ ] Create ForgotPasswordModal component
[ ] Props:
    [ ] isOpen: boolean
    [ ] onClose: () => void

[ ] Set up state:
    [ ] email: string
    [ ] isLoading: boolean
    [ ] success: boolean
    [ ] error: string | null

[ ] Modal structure:
    [ ] Backdrop overlay
    [ ] Centered modal card
    [ ] Close button (X)

[ ] Form content:
    [ ] Heading: "Reset Password"
    [ ] Description: "Enter your email..."
    [ ] Email input field
    [ ] Submit button

[ ] Submission handler:
    [ ] Validate email
    [ ] Call authService.requestPasswordReset(email)
    [ ] Show success message
    [ ] Auto-close after 3 seconds

[ ] Success state:
    [ ] Show checkmark icon
    [ ] Message: "Password reset link sent to your email"

[ ] Export component
```

## 🔧 Services

### auth.service.ts
```
[ ] Create login function:
    [ ] Parameters: email: string, password: string
    [ ] POST request: /api/auth/login
    [ ] Body: { email, password }
    [ ] Return: Promise<AuthResponse> { user, token }
    [ ] Store token in localStorage
    [ ] Set axios auth header

[ ] Create register function:
    [ ] Parameters: data: RegisterData
    [ ] POST request: /api/auth/register
    [ ] Body: { name, email, password }
    [ ] Return: Promise<AuthResponse>
    [ ] Store token
    [ ] Set axios header

[ ] Create logout function:
    [ ] POST request: /api/auth/logout (optional)
    [ ] Remove token from localStorage
    [ ] Clear axios header
    [ ] Redirect to login

[ ] Create requestPasswordReset function:
    [ ] Parameter: email: string
    [ ] POST request: /api/auth/forgot-password
    [ ] Return: Promise<{ success: boolean }>

[ ] Create socialLogin function:
    [ ] Parameter: provider: 'google' | 'github'
    [ ] Redirect to OAuth URL
    [ ] Handle OAuth callback
    [ ] Store token

[ ] Create getCurrentUser function:
    [ ] GET request: /api/auth/me
    [ ] Return: Promise<User>
    [ ] Called on app initialization

[ ] Export functions
```

### AuthContext.tsx
```
[ ] Create AuthContext with createContext
[ ] Define AuthContextType interface:
    [ ] user: User | null
    [ ] token: string | null
    [ ] isAuthenticated: boolean
    [ ] loading: boolean
    [ ] login: (email, password) => Promise<void>
    [ ] register: (data) => Promise<void>
    [ ] logout: () => void
    [ ] updateUser: (user) => void

[ ] Create AuthProvider component:
    [ ] Set up state (user, token, loading)
    [ ] Load user from token on mount
    [ ] Implement login function
    [ ] Implement register function
    [ ] Implement logout function
    [ ] Provide context value

[ ] Create useAuth hook:
    [ ] Use useContext(AuthContext)
    [ ] Throw error if used outside provider
    [ ] Return context value

[ ] Export AuthProvider and useAuth
```

## 🎨 Styling Requirements

```
[ ] Page container: min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100
[ ] Card: max-w-md w-full bg-white rounded-lg shadow-lg p-8
[ ] Header: text-center mb-8
[ ] Title: text-3xl font-bold text-gray-800
[ ] Description: text-gray-600
[ ] Tabs: flex mb-6 border-b
[ ] Active tab: border-b-2 border-blue-600 text-blue-600
[ ] Input field: w-full px-4 py-3 border rounded-lg
[ ] Submit button: w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
[ ] Social buttons: border border-gray-300 hover:bg-gray-50
[ ] Error message: text-sm text-red-600 mt-1
```

## 🧪 Testing Checklist

```
[ ] Page loads correctly
[ ] Tab switching works
[ ] Sign In form displays
[ ] Sign Up form displays
[ ] Email validation works
[ ] Password validation works
[ ] Sign in with valid credentials works
[ ] Invalid credentials show error
[ ] Remember me checkbox saves preference
[ ] Forgot password link opens modal
[ ] Password reset request works
[ ] Sign up with valid data works
[ ] Password confirmation validates
[ ] Password strength indicator works
[ ] Terms checkbox required
[ ] Duplicate email shows error
[ ] Social login buttons display
[ ] Google login redirects (if implemented)
[ ] GitHub login redirects (if implemented)
[ ] Token stored after login
[ ] Redirect to dashboard after login
[ ] Redirect to returnUrl if specified
[ ] Already logged in redirects to dashboard
[ ] Loading states show
[ ] Error messages clear
[ ] Responsive on mobile
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint 1: POST /api/auth/login
Body: { email: string, password: string }
Response: {
  user: User,
  token: string
}

Endpoint 2: POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: {
  user: User,
  token: string
}

Endpoint 3: POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: { success: boolean }

Endpoint 4: POST /api/auth/forgot-password
Body: { email: string }
Response: { success: boolean, message: string }

Endpoint 5: GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: User

Endpoint 6: GET /api/auth/google (OAuth)
Redirects to Google OAuth

Endpoint 7: GET /api/auth/github (OAuth)
Redirects to GitHub OAuth
```

---

Due to length constraints, I'll continue with the remaining pages in the next response. Would you like me to continue with:
- Pricing Page
- Admin Dashboard
- Admin Ads Management
- Admin Users Management
- Admin Reports Management
- Admin Archive System
- Admin Analytics
- Admin Settings
- Navigation Bar Component
- Backend API Setup
- Archive System Backend
- Authentication System
- Database Setup

Let me know and I'll create the remaining detailed checklists!