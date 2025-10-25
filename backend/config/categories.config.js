// Single source of truth for categories
const CATEGORIES = [
  { value: 'Electronics', label: 'Electronics', color: 'blue' },
  { value: 'Cars & Trucks', label: 'Cars & Trucks', color: 'indigo' },
  { value: 'Motorcycles', label: 'Motorcycles', color: 'indigo' },
  { value: 'Boats & Marine', label: 'Boats & Marine', color: 'indigo' },
  { value: 'RVs & Campers', label: 'RVs & Campers', color: 'indigo' },
  { value: 'Houses for Sale', label: 'Houses for Sale', color: 'orange' },
  { value: 'Apartments for Rent', label: 'Apartments for Rent', color: 'orange' },
  { value: 'Commercial Property', label: 'Commercial Property', color: 'orange' },
  { value: 'Vacation Rentals', label: 'Vacation Rentals', color: 'orange' },
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
  { value: 'Health & Beauty', label: 'Health & Beauty', color: 'pink' },
  { value: 'Baby & Kids', label: 'Baby & Kids', color: 'rose' },
  { value: 'Arts & Crafts', label: 'Arts & Crafts', color: 'purple' },
  { value: 'Musical Instruments', label: 'Musical Instruments', color: 'violet' },
  { value: 'Office Supplies', label: 'Office Supplies', color: 'slate' },
  { value: 'Digital Products', label: 'Digital Products', color: 'cyan' },
  { value: 'Software & Apps', label: 'Software & Apps', color: 'blue' },
  { value: 'Tutoring & Lessons', label: 'Tutoring & Lessons', color: 'emerald' },
  { value: 'Home Repair', label: 'Home Repair', color: 'amber' },
  { value: 'Free', label: 'Free', color: 'green' },
  { value: 'Other', label: 'Other', color: 'gray' },
];

// Export just the values for Mongoose enum
const getCategoryValues = () => CATEGORIES.map(cat => cat.value);

module.exports = {
  CATEGORIES,
  getCategoryValues,
};
