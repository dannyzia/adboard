# AdBoard - Comprehensive TODO & Checklist (Part 2)
## Admin Pages & Backend Implementation

> **Continuation from Part 1** - Complete implementation guide for admin features and backend

---

# 6. PRICING PAGE

## 📋 Requirements
- Display 3 pricing tiers (Free, Basic, Pro)
- Side-by-side comparison cards
- Popular badge on recommended tier
- Feature lists with checkmarks
- Upgrade buttons
- Current plan indicator
- Custom plan CTA
- Responsive design

## ✅ Component Checklist

### PricingPage.tsx
```
[ ] Create PricingPage functional component
[ ] Fetch user subscription tier from AuthContext

[ ] Set up state:
    [ ] user: User | null
    [ ] loading: boolean

[ ] Create page structure:
    [ ] Container: max-w-7xl mx-auto px-4 py-16
    [ ] Header section (centered)
    [ ] Pricing cards grid
    [ ] Custom plan CTA section

[ ] Header section:
    [ ] Heading: "Choose Your Plan" (text-4xl font-bold)
    [ ] Description: "Post more ads and reach more customers..."
    [ ] Centered text: text-center mb-16

[ ] Pricing grid:
    [ ] Grid: grid-cols-1 md:grid-cols-3 gap-8

[ ] Export component
```

### PricingCard Component
```
[ ] Create PricingCard component
[ ] Props:
    [ ] tier: PricingTier
    [ ] isPopular?: boolean
    [ ] isCurrent?: boolean
    [ ] onUpgrade: (tier: string) => void

[ ] Card container:
    [ ] Base: bg-white rounded-lg shadow-lg p-8
    [ ] Border: border-2 border-gray-200
    [ ] If popular: border-blue-600, relative, transform scale-105
    [ ] If current: border-green-600

[ ] Popular badge (if isPopular):
    [ ] Position: absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
    [ ] Background: bg-blue-600 text-white
    [ ] Text: "POPULAR"
    [ ] Padding: px-4 py-1 rounded-full text-sm font-semibold

[ ] Header section (text-center mb-8):
    [ ] Tier name: text-2xl font-bold text-gray-800
    [ ] Price display:
        [ ] Container: mb-2
        [ ] Price: text-4xl font-bold (color based on tier)
        [ ] Period: /month text-lg text-gray-600
    [ ] Description: text-gray-600

[ ] Features list:
    [ ] Container: space-y-4 mb-8
    [ ] Map through tier.features
    [ ] Each feature:
        [ ] Flex: flex items-start
        [ ] Checkmark icon: w-5 h-5 text-green-600 mt-0.5 mr-3
        [ ] Feature text: text-gray-600

[ ] Action button:
    [ ] Full width: w-full py-3 rounded-lg font-semibold
    [ ] If current:
        [ ] Background: bg-gray-200 text-gray-800
        [ ] Text: "Current Plan"
        [ ] Disabled
    [ ] If not current:
        [ ] If free tier: bg-gray-200 (grayed out)
        [ ] If paid tier: bg-blue-600 text-white hover:bg-blue-700
        [ ] Text: "Upgrade Now"
    [ ] onClick: onUpgrade(tier.name)

[ ] Export component
```

### PricingTiers Data
```
[ ] Create PRICING_TIERS constant array:

Free Tier:
[ ] name: 'free'
[ ] price: 0
[ ] description: 'Perfect for getting started'
[ ] features: [
    '5 ads per month',
    '30-day listing duration',
    'Basic support',
    'Up to 3 images per ad'
  ]

Basic Tier:
[ ] name: 'basic'
[ ] price: 15
[ ] description: 'For regular sellers'
[ ] popular: true
[ ] features: [
    '20 ads per month',
    '60-day listing duration',
    'Featured badge',
    'Priority support',
    'Up to 5 images per ad',
    'Basic analytics'
  ]

Pro Tier:
[ ] name: 'pro'
[ ] price: 49
[ ] description: 'For businesses'
[ ] features: [
    'Unlimited ads',
    '90-day listing duration',
    'Priority placement',
    'Dedicated support',
    'Up to 10 images per ad',
    'Advanced analytics',
    'API access',
    'Custom branding'
  ]

[ ] Export PRICING_TIERS
```

### CustomPlanCTA Component
```
[ ] Create CustomPlanCTA component

[ ] Section container:
    [ ] Margin top: mt-16
    [ ] Text center: text-center

[ ] Content:
    [ ] Paragraph: text-gray-600
    [ ] Text: "Need a custom plan for your organization?"
    [ ] Link: "Contact us" (text-blue-600 hover:underline font-semibold)

[ ] Export component
```

## 🔧 Services

### subscription.service.ts
```
[ ] Create upgradeSubscription function:
    [ ] Parameters: tier: string
    [ ] POST request: /api/subscriptions/upgrade
    [ ] Body: { tier }
    [ ] Return: Promise<{ checkoutUrl: string }>
    [ ] Redirect to Stripe checkout

[ ] Create cancelSubscription function:
    [ ] POST request: /api/subscriptions/cancel
    [ ] Return: Promise<{ success: boolean }>

[ ] Create fetchSubscriptionDetails function:
    [ ] GET request: /api/subscriptions/current
    [ ] Return: Promise<SubscriptionDetails>

[ ] Export functions
```

## 🎨 Styling Requirements

```
[ ] Container: max-w-7xl mx-auto px-4 py-16
[ ] Grid: grid-cols-1 md:grid-cols-3 gap-8
[ ] Card: bg-white rounded-lg shadow-lg p-8 border-2
[ ] Popular card: border-blue-600 scale-105 z-10
[ ] Current card: border-green-600
[ ] Price: text-4xl font-bold
[ ] Features: space-y-4
[ ] Checkmark: w-5 h-5 text-green-600
[ ] Button: w-full py-3 rounded-lg font-semibold
[ ] Upgrade button: bg-blue-600 text-white hover:bg-blue-700
```

## 🧪 Testing Checklist

```
[ ] Pricing page loads
[ ] All 3 tiers display
[ ] Free tier shows $0/month
[ ] Basic tier shows $15/month
[ ] Pro tier shows $49/month
[ ] Popular badge shows on Basic tier
[ ] Popular card has larger scale
[ ] Current plan highlighted (if user logged in)
[ ] Current plan button disabled
[ ] Upgrade buttons work for other tiers
[ ] Feature lists display correctly
[ ] Checkmarks show for all features
[ ] Custom plan CTA displays
[ ] Contact us link works
[ ] Responsive on mobile (single column)
[ ] Responsive on tablet (2 columns)
[ ] Responsive on desktop (3 columns)
[ ] Not logged in: all upgrade buttons enabled
[ ] Logged in free tier: basic and pro upgradeable
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint: POST /api/subscriptions/upgrade
Headers: Authorization: Bearer {token}
Body: { tier: 'basic' | 'pro' }
Response: {
  checkoutUrl: string  // Stripe checkout URL
}
```

---

# 7. ADMIN DASHBOARD

## 📋 Requirements
- Admin-only access (role check)
- 4 statistics cards
- Recent activity feed (20 items)
- Quick actions
- Real-time updates (optional)
- Admin sidebar navigation
- Charts/graphs for trends

## ✅ Component Checklist

### AdminDashboard.tsx
```
[ ] Create AdminDashboard functional component
[ ] Check admin authentication:
    [ ] Verify user.role === 'admin'
    [ ] Redirect to home if not admin

[ ] Set up state:
    [ ] stats: AdminStats
    [ ] recentActivity: ActivityLog[]
    [ ] loading: boolean
    [ ] error: string | null

[ ] Implement useEffect for data fetching:
    [ ] Fetch admin stats
    [ ] Fetch recent activity
    [ ] Set up polling for real-time updates (optional)
    [ ] Handle loading and errors

[ ] Create page layout:
    [ ] Admin layout wrapper (sidebar + content)
    [ ] Stats grid
    [ ] Recent activity feed
    [ ] Quick actions section

[ ] Export component
```

### AdminLayout Component
```
[ ] Create AdminLayout component
[ ] Props: children: ReactNode

[ ] Layout structure:
    [ ] Container: flex min-h-screen
    [ ] AdminSidebar (fixed left)
    [ ] Main content area (flex-1)

[ ] Main content area:
    [ ] Padding: p-8
    [ ] Background: bg-gray-50
    [ ] Min height: min-h-screen

[ ] Export component
```

### AdminSidebar Component
```
[ ] Create AdminSidebar component
[ ] Get current route for active state

[ ] Sidebar structure:
    [ ] Container: w-64 bg-white shadow-lg fixed left-0 top-0 h-full
    [ ] Padding: p-6

[ ] Header:
    [ ] Logo/Brand: "ADMIN PANEL"
    [ ] Style: text-xl font-bold text-gray-800 mb-8

[ ] Navigation menu items:
    [ ] Array of menu items with icons and routes
    [ ] Map through menu items

Menu Items:
[ ] Dashboard - /admin/dashboard (grid icon)
[ ] Ads - /admin/ads (document icon)
[ ] Users - /admin/users (users icon)
[ ] Reports - /admin/reports (flag icon)
[ ] Archive - /admin/archive (archive icon)
[ ] Analytics - /admin/analytics (chart icon)
[ ] Settings - /admin/settings (cog icon)

[ ] Each menu item:
    [ ] Link element with onClick navigation
    [ ] Flex: flex items-center
    [ ] Padding: px-4 py-3 rounded-lg mb-2
    [ ] Active: bg-blue-100 text-blue-600 font-semibold
    [ ] Inactive: text-gray-600 hover:bg-gray-100
    [ ] Icon: w-5 h-5 mr-3

[ ] Divider line (border-t) after settings

[ ] Back to Site link:
    [ ] At bottom
    [ ] Icon: arrow-left
    [ ] Link to homepage
    [ ] onClick: navigate('/')

[ ] Export component
```

### AdminStatsGrid Component
```
[ ] Create AdminStatsGrid component
[ ] Props: stats: AdminStats

[ ] Grid structure:
    [ ] Container: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8

[ ] Create 4 AdminStatsCard components:

Card 1 - Total Ads:
[ ] Title: "Total Ads"
[ ] Main value: stats.totalAds.toLocaleString()
[ ] Breakdown:
    [ ] Active: stats.activeAds
    [ ] Expired: stats.expiredAds
    [ ] Archived: stats.archivedAds
[ ] 7-day trend chart
[ ] Icon: document stack (blue)

Card 2 - User Statistics:
[ ] Title: "User Statistics"
[ ] Main value: stats.totalUsers.toLocaleString()
[ ] Breakdown:
    [ ] Free: stats.freeUsers
    [ ] Basic: stats.basicUsers
    [ ] Pro: stats.proUsers
[ ] New today: stats.newUsersToday
[ ] Icon: users (green)

Card 3 - Revenue Metrics:
[ ] Title: "Revenue Metrics"
[ ] Main value: $${stats.mrr.toLocaleString()} MRR
[ ] This month: stats.revenueThisMonth
[ ] Growth: stats.revenueGrowth% (with arrow up/down)
[ ] Monthly trend chart
[ ] Icon: dollar sign (purple)

Card 4 - Activity Today:
[ ] Title: "Activity Today"
[ ] Metrics:
    [ ] New ads: stats.newAdsToday
    [ ] New users: stats.newUsersToday
    [ ] Reports: stats.reportsToday
    [ ] Archives: stats.archivesToday
[ ] Icon: activity (orange)

[ ] Export component
```

### AdminStatsCard Component
```
[ ] Create AdminStatsCard component
[ ] Props:
    [ ] title: string
    [ ] mainValue: string | number
    [ ] icon: ReactNode
    [ ] iconBg: string
    [ ] breakdown?: { label: string, value: number }[]
    [ ] trend?: { data: number[], positive: boolean }
    [ ] chart?: ReactNode

[ ] Card structure:
    [ ] Container: bg-white rounded-lg shadow p-6
    [ ] Hover: hover:shadow-md transition

[ ] Header row:
    [ ] Flex: flex items-center justify-between mb-4

[ ] Left side:
    [ ] Title: text-sm text-gray-600
    [ ] Main value: text-3xl font-bold text-gray-800 mt-1

[ ] Right side:
    [ ] Icon container: w-12 h-12 {iconBg} rounded-lg flex items-center justify-center
    [ ] Icon with color

[ ] Breakdown section (if provided):
    [ ] Border top: border-t pt-4 mt-4
    [ ] Map through breakdown items:
        [ ] Flex: flex justify-between text-sm
        [ ] Label: text-gray-600
        [ ] Value: text-gray-800 font-semibold

[ ] Chart section (if provided):
    [ ] Margin top: mt-4
    [ ] Render chart component

[ ] Export component
```

### RecentActivityFeed Component
```
[ ] Create RecentActivityFeed component
[ ] Props: activities: ActivityLog[]

[ ] Container structure:
    [ ] bg-white rounded-lg shadow p-6

[ ] Header:
    [ ] Flex: flex justify-between items-center mb-6
    [ ] Title: "Recent Activity" (text-xl font-semibold)
    [ ] "View All" link (text-blue-600 text-sm)

[ ] Activity list:
    [ ] Container: space-y-4
    [ ] Map through activities (slice first 20)
    [ ] Render ActivityItem for each

[ ] Empty state (if no activities):
    [ ] Center text: "No recent activity"
    [ ] Gray color

[ ] Export component
```

### ActivityItem Component
```
[ ] Create ActivityItem component
[ ] Props: activity: ActivityLog

[ ] Item structure:
    [ ] Container: flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg

[ ] Icon section:
    [ ] Different icons based on action:
        [ ] Created: plus icon (green)
        [ ] Updated: edit icon (blue)
        [ ] Deleted: trash icon (red)
        [ ] Archived: archive icon (yellow)
        [ ] Restored: refresh icon (purple)
    [ ] Circle background with color
    [ ] Size: w-10 h-10

[ ] Content section:
    [ ] Flex-1
    [ ] Action description:
        [ ] Bold: activity.performedBy name
        [ ] Action: activity.action
        [ ] Entity: activity.entityType
    [ ] Entity details (if available)
    [ ] Timestamp: formatTimeAgo(activity.performedAt)
    [ ] Style: text-xs text-gray-500

[ ] Action button (optional):
    [ ] "View" button
    [ ] onClick: navigate to entity detail

[ ] Export component
```

### QuickActions Component
```
[ ] Create QuickActions component

[ ] Container:
    [ ] bg-white rounded-lg shadow p-6 mb-8

[ ] Header:
    [ ] Title: "Quick Actions"
    [ ] Text-xl font-semibold mb-4

[ ] Actions grid:
    [ ] Grid: grid grid-cols-2 md:grid-cols-4 gap-4

Quick action buttons:
[ ] View All Ads
    [ ] Icon: document
    [ ] onClick: navigate('/admin/ads')

[ ] View All Users
    [ ] Icon: users
    [ ] onClick: navigate('/admin/users')

[ ] View Reports
    [ ] Icon: flag
    [ ] onClick: navigate('/admin/reports')

[ ] View Archive
    [ ] Icon: archive
    [ ] onClick: navigate('/admin/archive')

[ ] Each button:
    [ ] Flex: flex flex-col items-center
    [ ] Padding: p-4
    [ ] Border: border-2 border-gray-200
    [ ] Rounded: rounded-lg
    [ ] Hover: hover:border-blue-600 hover:bg-blue-50
    [ ] Icon (large, centered)
    [ ] Label (text-sm font-semibold)

[ ] Export component
```

## 🔧 Services

### admin.service.ts
```
[ ] Create fetchAdminStats function:
    [ ] GET request: /api/admin/dashboard/stats
    [ ] Return: Promise<AdminStats>
    [ ] Interface AdminStats with all stat fields

[ ] Create fetchRecentActivity function:
    [ ] GET request: /api/admin/dashboard/activity
    [ ] Query params: limit (default 20)
    [ ] Return: Promise<ActivityLog[]>

[ ] Create fetchAdminChartData function:
    [ ] GET request: /api/admin/dashboard/charts
    [ ] Query params: timeRange ('7d', '30d', '90d')
    [ ] Return: Promise<ChartData>

[ ] Export functions
```

## 🎨 Styling Requirements

```
[ ] Sidebar: w-64 bg-white shadow-lg fixed
[ ] Main content: p-8 bg-gray-50
[ ] Stats grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
[ ] Stats card: bg-white rounded-lg shadow p-6
[ ] Icon container: w-12 h-12 rounded-lg flex center
[ ] Activity feed: bg-white rounded-lg shadow p-6
[ ] Activity item: flex space-x-3 p-3 hover:bg-gray-50 rounded-lg
[ ] Action icon: w-10 h-10 rounded-full flex center
[ ] Quick actions: grid-cols-2 md:grid-cols-4 gap-4
```

## 🧪 Testing Checklist

```
[ ] Admin dashboard loads (admin users only)
[ ] Non-admin redirects to home
[ ] Sidebar displays all menu items
[ ] Active menu item highlighted
[ ] Navigation between admin pages works
[ ] Stats cards display correct data
[ ] Numbers formatted with commas
[ ] Revenue displays with $ symbol
[ ] Growth percentage shows with + or -
[ ] Breakdowns display correctly
[ ] Charts render (if implemented)
[ ] Recent activity feed loads
[ ] Activity items display correctly
[ ] Activity icons match action types
[ ] Timestamps formatted correctly
[ ] Quick actions buttons work
[ ] "View All" links navigate correctly
[ ] Real-time updates work (if implemented)
[ ] Loading states display
[ ] Error handling works
[ ] Responsive on tablet (2 columns stats)
[ ] Responsive on mobile (1 column)
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint 1: GET /api/admin/dashboard/stats
Headers: Authorization: Bearer {admin_token}
Response: {
  totalAds: number,
  activeAds: number,
  expiredAds: number,
  archivedAds: number,
  totalUsers: number,
  freeUsers: number,
  basicUsers: number,
  proUsers: number,
  newUsersToday: number,
  mrr: number,
  revenueThisMonth: number,
  revenueGrowth: number,
  newAdsToday: number,
  reportsToday: number,
  archivesToday: number
}

Endpoint 2: GET /api/admin/dashboard/activity?limit=20
Headers: Authorization: Bearer {admin_token}
Response: ActivityLog[]
```

---

# 8. ADMIN ADS MANAGEMENT

## 📋 Requirements
- Table view of all ads
- Search and filter functionality
- Sort by multiple columns
- Bulk actions (select multiple)
- Individual ad actions (view, edit, archive, delete)
- Pagination
- Status badges
- Export to CSV
- Ad approval/rejection (if moderation enabled)

## ✅ Component Checklist

### AdminAdsPage.tsx
```
[ ] Create AdminAdsPage functional component
[ ] Verify admin role

[ ] Set up state:
    [ ] ads: Ad[]
    [ ] selectedAds: string[] (IDs of selected ads)
    [ ] filters: AdFilters
    [ ] sortBy: string
    [ ] sortOrder: 'asc' | 'desc'
    [ ] page: number
    [ ] totalPages: number
    [ ] loading: boolean

[ ] Implement useEffect for data fetching:
    [ ] Fetch ads based on filters, sort, page
    [ ] Update state
    [ ] Handle loading and errors

[ ] Filter handlers:
    [ ] handleFilterChange(filter: Partial<AdFilters>)
    [ ] Reset page to 1
    [ ] Fetch new data

[ ] Sort handler:
    [ ] handleSort(column: string)
    [ ] Toggle sort order if same column
    [ ] Fetch new data

[ ] Selection handlers:
    [ ] handleSelectAll()
    [ ] handleSelectOne(id: string)
    [ ] Clear selection after actions

[ ] Bulk action handlers:
    [ ] handleBulkArchive()
    [ ] handleBulkDelete()
    [ ] handleBulkFeature()
    [ ] Show confirmation modal
    [ ] Execute action
    [ ] Refresh data

[ ] Individual action handlers:
    [ ] handleView(id: string)
    [ ] handleEdit(id: string)
    [ ] handleArchive(id: string)
    [ ] handleDelete(id: string)

[ ] Create page JSX:
    [ ] AdminLayout wrapper
    [ ] Page header with title
    [ ] Filter section
    [ ] Bulk action bar (if items selected)
    [ ] Ad table
    [ ] Pagination

[ ] Export component
```

### AdFiltersBar Component
```
[ ] Create AdFiltersBar component
[ ] Props:
    [ ] filters: AdFilters
    [ ] onChange: (filters: Partial<AdFilters>) => void
    [ ] onReset: () => void

[ ] Filter bar structure:
    [ ] Container: bg-white rounded-lg shadow p-4 mb-6
    [ ] Flex: flex flex-wrap items-center gap-4

[ ] Filters:

Status dropdown:
[ ] Label: Status
[ ] Options: All, Active, Expired, Archived, Deleted
[ ] onChange: update filters.status

Category dropdown:
[ ] Label: Category
[ ] Options: All Categories + map through CATEGORIES
[ ] onChange: update filters.category

Location dropdowns:
[ ] Country, State, City (cascading)
[ ] Similar to Post Ad page

Date range:
[ ] Label: Posted Date
[ ] Options: All Time, Today, Last 7 days, Last 30 days, Custom
[ ] If custom: show date picker

Search input:
[ ] Placeholder: "Search ads..."
[ ] debounced onChange
[ ] Update filters.search

[ ] Action buttons:
    [ ] Apply Filters button (primary)
    [ ] Reset Filters button (secondary)
    [ ] Export CSV button

[ ] Export component
```

### BulkActionBar Component
```
[ ] Create BulkActionBar component
[ ] Props:
    [ ] selectedCount: number
    [ ] onArchive: () => void
    [ ] onDelete: () => void
    [ ] onFeature: () => void
    [ ] onClearSelection: () => void

[ ] Show only if selectedCount > 0

[ ] Bar structure:
    [ ] Container: fixed bottom-0 left-0 right-0 z-50
    [ ] Background: bg-blue-600 text-white
    [ ] Padding: px-4 py-3
    [ ] Shadow: shadow-lg

[ ] Content:
    [ ] Flex: flex items-center justify-between

[ ] Left side:
    [ ] Text: "{selectedCount} ads selected"
    [ ] Font: font-semibold

[ ] Right side (action buttons):
    [ ] Archive button
        [ ] Icon: archive
        [ ] Text: "Archive"
        [ ] onClick: onArchive
    [ ] Delete button
        [ ] Icon: trash
        [ ] Text: "Delete"
        [ ] onClick: onDelete
    [ ] Feature button
        [ ] Icon: star
        [ ] Text: "Feature"
        [ ] onClick: onFeature
    [ ] Clear button
        [ ] Icon: X
        [ ] Text: "Clear"
        [ ] onClick: onClearSelection

[ ] All buttons:
    [ ] bg-white/20 hover:bg-white/30
    [ ] px-4 py-2 rounded
    [ ] transition

[ ] Export component
```

### AdminAdsTable Component
```
[ ] Create AdminAdsTable component
[ ] Props:
    [ ] ads: Ad[]
    [ ] selectedIds: string[]
    [ ] onSelectAll: () => void
    [ ] onSelectOne: (id: string) => void
    [ ] onSort: (column: string) => void
    [ ] sortBy: string
    [ ] sortOrder: 'asc' | 'desc'
    [ ] onView: (id: string) => void
    [ ] onEdit: (id: string) => void
    [ ] onArchive: (id: string) => void
    [ ] onDelete: (id: string) => void

[ ] Table structure:
    [ ] Container: bg-white rounded-lg shadow overflow-x-auto
    [ ] Table: w-full

[ ] Table header:
    [ ] Checkbox column (select all)
    [ ] Thumbnail column
    [ ] Title column (sortable)
    [ ] Category column (sortable)
    [ ] User column
    [ ] Status column (sortable)
    [ ] Posted Date column (sortable)
    [ ] Views column (sortable)
    [ ] Actions column

[ ] Sortable headers:
    [ ] Flex: flex items-center justify-between
    [ ] Cursor: cursor-pointer
    [ ] Sort icon (up/down arrow based on sortOrder)
    [ ] onClick: onSort(column)

[ ] Table body:
    [ ] Map through ads
    [ ] Render AdTableRow for each

[ ] Empty state:
    [ ] Show if ads.length === 0
    [ ] Message: "No ads found"
    [ ] Icon: document with slash

[ ] Export component
```

### AdTableRow Component
```
[ ] Create AdTableRow component
[ ] Props:
    [ ] ad: Ad
    [ ] isSelected: boolean
    [ ] onSelect: () => void
    [ ] onView: () => void
    [ ] onEdit: () => void
    [ ] onArchive: () => void
    [ ] onDelete: () => void

[ ] Row structure:
    [ ] tr element
    [ ] Hover: hover:bg-gray-50
    [ ] Border bottom: border-b

[ ] Checkbox cell:
    [ ] Input type="checkbox"
    [ ] Checked: isSelected
    [ ] onChange: onSelect

[ ] Thumbnail cell:
    [ ] Image: w-16 h-16 object-cover rounded
    [ ] Fallback if no image

[ ] Title cell:
    [ ] Font: font-semibold text-gray-800
    [ ] Line clamp: 2 lines
    [ ] Truncate long titles

[ ] Category cell:
    [ ] Category badge (color-coded)
    [ ] Text-xs

[ ] User cell:
    [ ] User name or email
    [ ] Link to user profile
    [ ] Text-sm text-blue-600

[ ] Status cell:
    [ ] Status badge:
        [ ] Active: bg-green-100 text-green-800
        [ ] Expired: bg-yellow-100 text-yellow-800
        [ ] Archived: bg-gray-100 text-gray-800
        [ ] Deleted: bg-red-100 text-red-800

[ ] Posted Date cell:
    [ ] Format: MMM DD, YYYY
    [ ] Text-sm text-gray-600

[ ] Views cell:
    [ ] Number with commas
    [ ] Text-sm

[ ] Actions cell:
    [ ] Dropdown menu or button group
    [ ] View button (eye icon)
    [ ] Edit button (pencil icon)
    [ ] Archive button (archive icon)
    [ ] Delete button (trash icon, red)

[ ] Export component
```

### AdActionsMenu Component
```
[ ] Create AdActionsMenu component
[ ] Props:
    [ ] onView: () => void
    [ ] onEdit: () => void
    [ ] onArchive: () => void
    [ ] onDelete: () => void

[ ] Dropdown structure:
    [ ] Button: 3-dot menu icon
    [ ] Menu container (absolute, right-aligned)
    [ ] Show/hide on click

[ ] Menu items:
    [ ] View Details
        [ ] Icon: eye
        [ ] onClick: onView
    [ ] Edit Ad
        [ ] Icon: pencil
        [ ] onClick: onEdit
    [ ] Archive Ad
        [ ] Icon: archive
        [ ] onClick: onArchive
    [ ] Delete Ad
        [ ] Icon: trash (red)
        [ ] onClick: onDelete

[ ] Each menu item:
    [ ] Padding: px-4 py-2
    [ ] Hover: hover:bg-gray-100
    [ ] Cursor: cursor-pointer
    [ ] Flex: flex items-center
    [ ] Icon + text

[ ] Click outside to close

[ ] Export component
```

### ConfirmActionModal Component
```
[ ] Create ConfirmActionModal component
[ ] Props:
    [ ] isOpen: boolean
    [ ] action: 'archive' | 'delete' | 'feature'
    [ ] itemCount: number
    [ ] onConfirm: (reason?: string) => void
    [ ] onCancel: () => void

[ ] Modal structure:
    [ ] Backdrop: fixed inset-0 bg-black/50 z-50
    [ ] Modal: centered, max-w-md

[ ] Content:
    [ ] Icon (color based on action):
        [ ] Archive: yellow
        [ ] Delete: red
        [ ] Feature: blue
    [ ] Heading: "Confirm {action}"
    [ ] Message: "Are you sure you want to {action} {itemCount} ad(s)?"
    [ ] Warning: "This action cannot be undone" (for delete)

[ ] Reason input (for archive/delete):
    [ ] Textarea
    [ ] Placeholder: "Enter reason (optional)"
    [ ] State: reason

[ ] Action buttons:
    [ ] Cancel button (secondary)
    [ ] Confirm button (primary, colored by action)
        [ ] Archive: bg-yellow-600
        [ ] Delete: bg-red-600
        [ ] Feature: bg-blue-600

[ ] Export component
```

## 🔧 Services

### admin.service.ts (add functions)
```
[ ] Create fetchAllAds function:
    [ ] Parameters: page, limit, filters, sort
    [ ] GET request: /api/admin/ads
    [ ] Query params include all filters
    [ ] Return: Promise<PaginatedAdsResponse>

[ ] Create bulkArchiveAds function:
    [ ] Parameter: adIds: string[], reason: string
    [ ] POST request: /api/admin/ads/bulk-action
    [ ] Body: { action: 'archive', adIds, reason }
    [ ] Return: Promise<{ success: boolean, count: number }>

[ ] Create bulkDeleteAds function:
    [ ] Parameter: adIds: string[], reason: string
    [ ] POST request: /api/admin/ads/bulk-action
    [ ] Body: { action: 'delete', adIds, reason }
    [ ] Return: Promise<{ success: boolean, count: number }>

[ ] Create bulkFeatureAds function:
    [ ] Parameter: adIds: string[], featured: boolean
    [ ] POST request: /api/admin/ads/bulk-action
    [ ] Body: { action: 'feature', adIds, featured }
    [ ] Return: Promise<{ success: boolean, count: number }>

[ ] Create exportAdsCSV function:
    [ ] Parameter: filters: AdFilters
    [ ] GET request: /api/admin/ads/export
    [ ] Return: Blob
    [ ] Trigger download

[ ] Export functions
```

## 🎨 Styling Requirements

```
[ ] Table: w-full min-w-[1000px]
[ ] Table header: bg-gray-50 border-b-2
[ ] Table cell: px-6 py-4
[ ] Checkbox: w-4 h-4
[ ] Thumbnail: w-16 h-16 rounded
[ ] Status badge: px-2 py-1 rounded-full text-xs font-semibold
[ ] Action buttons: text-gray-600 hover:text-blue-600
[ ] Bulk action bar: bg-blue-600 text-white fixed bottom
[ ] Filter bar: bg-white rounded-lg shadow p-4
[ ] Dropdown menu: absolute bg-white shadow-lg rounded
```

## 🧪 Testing Checklist

```
[ ] Admin ads page loads
[ ] Table displays all ads
[ ] Columns display correct data
[ ] Thumbnails load properly
[ ] Status badges show correct colors
[ ] Posted dates formatted correctly
[ ] View counts display with commas
[ ] Sort by title works
[ ] Sort by status works
[ ] Sort by posted date works
[ ] Sort by views works
[ ] Sort indicator shows current sort
[ ] Filter by status works
[ ] Filter by category works
[ ] Filter by location works
[ ] Filter by date range works
[ ] Search works (debounced)
[ ] Multiple filters work together
[ ] Reset filters works
[ ] Select all checkbox works
[ ] Individual checkboxes work
[ ] Bulk action bar appears when items selected
[ ] Bulk action bar shows correct count
[ ] Bulk archive works
[ ] Bulk delete works
[ ] Bulk feature works
[ ] Clear selection works
[ ] View ad navigates to detail
[ ] Edit ad navigates to edit page
[ ] Archive individual ad works
[ ] Delete individual ad works
[ ] Confirmation modals show
[ ] Reason input works
[ ] Export CSV works
[ ] Pagination works
[ ] Page numbers correct
[ ] Next/Previous buttons work
[ ] Loading states display
[ ] Error handling works
[ ] Responsive table (horizontal scroll)
[ ] Console has no errors
```

## 🔗 API Integration

```
Endpoint 1: GET /api/admin/ads
Headers: Authorization: Bearer {admin_token}
Query params:
  - page: number
  - limit: number
  - status: string
  - category: string
  - search: string
  - sortBy: string
  - sortOrder: string
Response: {
  ads: Ad[],
  page: number,
  totalPages: number,
  totalAds: number
}

Endpoint 2: POST /api/admin/ads/bulk-action
Headers: Authorization: Bearer {admin_token}
Body: {
  action: 'archive' | 'delete' | 'feature',
  adIds: string[],
  reason?: string,
  featured?: boolean
}
Response: {
  success: boolean,
  count: number,
  message: string
}

Endpoint 3: GET /api/admin/ads/export
Headers: Authorization: Bearer {admin_token}
Query params: filters
Response: CSV file (blob)
```

---

Due to character limit, this document covers through Admin Ads Management. The remaining sections (Admin Users, Reports, Archive, Analytics, Settings, Backend, Database) would follow the same detailed format.

Would you like me to create Part 3 with the remaining sections?