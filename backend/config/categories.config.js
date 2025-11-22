// Single source of truth for categories
const CATEGORIES = [
  { value: 'Apartments for Rent', label: 'Apartments for Rent', color: 'orange' },
  { value: 'Arts & Crafts', label: 'Arts & Crafts', color: 'purple' },
  { value: 'Auction', label: 'Auction', color: 'fuchsia' },
  { value: 'Baby & Kids', label: 'Baby & Kids', color: 'rose' },
  { value: 'Boats & Marine', label: 'Boats & Marine', color: 'indigo' },
  { value: 'Books', label: 'Books', color: 'yellow' },
  { value: 'Buy & Sell', label: 'Buy & Sell', color: 'slate' },
  { value: 'Cars & Trucks', label: 'Cars & Trucks', color: 'indigo' },
  { value: 'Commercial Property', label: 'Commercial Property', color: 'orange' },
  { value: 'Deals & Offers', label: 'Deals & Offers', color: 'emerald' },
  { value: 'Digital Products', label: 'Digital Products', color: 'cyan' },
  { value: 'Electronics', label: 'Electronics', color: 'blue' },
  { value: 'Events & Shows', label: 'Events & Shows', color: 'rose' },
  { value: 'Fashion', label: 'Fashion', color: 'pink' },
  { value: 'Food & Dining', label: 'Food & Dining', color: 'lime' },
  { value: 'Free', label: 'Free', color: 'green' },
  { value: 'Health & Beauty', label: 'Health & Beauty', color: 'pink' },
  { value: 'Home & Garden', label: 'Home & Garden', color: 'green' },
  { value: 'Home Repair', label: 'Home Repair', color: 'amber' },
  { value: 'Houses for Sale', label: 'Houses for Sale', color: 'orange' },
  { value: 'Jobs', label: 'Jobs', color: 'cyan' },
  { value: 'Motorcycles', label: 'Motorcycles', color: 'indigo' },
  { value: 'Musical Instruments', label: 'Musical Instruments', color: 'violet' },
  { value: 'Notices', label: 'Notices', color: 'teal' },
  { value: 'Office Supplies', label: 'Office Supplies', color: 'slate' },
  { value: 'Other', label: 'Other', color: 'gray' },
  { value: 'Pets', label: 'Pets', color: 'amber' },
  { value: 'RVs & Campers', label: 'RVs & Campers', color: 'indigo' },
  { value: 'Services', label: 'Services', color: 'purple' },
  { value: 'Software & Apps', label: 'Software & Apps', color: 'blue' },
  { value: 'Sports', label: 'Sports', color: 'red' },
  { value: 'Tickets', label: 'Tickets', color: 'violet' },
  { value: 'Travel & Resorts', label: 'Travel & Resorts', color: 'sky' },
  { value: 'Tutoring & Lessons', label: 'Tutoring & Lessons', color: 'emerald' },
  { value: 'Vacation Rentals', label: 'Vacation Rentals', color: 'orange' },
];

// Export just the values for Mongoose enum
const getCategoryValues = () => CATEGORIES.map(cat => cat.value);

module.exports = {
  CATEGORIES,
  getCategoryValues,
};
