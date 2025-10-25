// Single source of truth for categories
const CATEGORIES = [
  { value: 'Electronics', label: 'Electronics', color: 'blue' },
  { value: 'Vehicles', label: 'Vehicles', color: 'indigo' },
  { value: 'Property', label: 'Property', color: 'orange' },
  { value: 'Jobs', label: 'Jobs', color: 'cyan' },
  { value: 'Services', label: 'Services', color: 'purple' },
  { value: 'Fashion', label: 'Fashion', color: 'pink' },
  { value: 'Home & Garden', label: 'Home & Garden', color: 'green' },
  { value: 'Sports', label: 'Sports', color: 'red' },
  { value: 'Books', label: 'Books', color: 'yellow' },
  { value: 'Pets', label: 'Pets', color: 'amber' },
  { value: 'Food & Dining', label: 'Food & Dining', color: 'lime' },
  { value: 'Travel & Resorts', label: 'Travel & Resorts', color: 'sky' },
  { value: 'Deals & Offers', label: 'Deals & Offers', color: 'emerald' },
  { value: 'Tickets', label: 'Tickets', color: 'violet' },
  { value: 'Events & Shows', label: 'Events & Shows', color: 'rose' },
  { value: 'Auction', label: 'Auction', color: 'fuchsia' },
  { value: 'Buy & Sell', label: 'Buy & Sell', color: 'slate' },
  { value: 'Notices', label: 'Notices', color: 'teal' },
  { value: 'Other', label: 'Other', color: 'gray' },
];

// Export just the values for Mongoose enum
const getCategoryValues = () => CATEGORIES.map(cat => cat.value);

module.exports = {
  CATEGORIES,
  getCategoryValues,
};
