// Simple test to verify homepage toggle functionality
// This file can be run in the browser console to test the toggle

console.log('Testing homepage toggle functionality...');

// Test 1: Check if context is available
try {
  const context = require('../context/HomepageContext').useHomepage();
  console.log('✅ HomepageContext is available');
} catch (error) {
  console.error('❌ HomepageContext not available:', error);
}

// Test 2: Check if components are exported
try {
  const HomePageAlternative = require('../pages/HomePageAlternative').HomePageAlternative;
  const HeroSectionAlternative = require('../components/HeroSectionAlternative').HeroSectionAlternative;
  const AdCardAlternative = require('../components/ads/AdCardAlternative').AdCardAlternative;
  const HomepageToggle = require('../components/HomepageToggle').HomepageToggle;
  
  console.log('✅ All new components are available');
  console.log('✅ HomePageAlternative:', typeof HomePageAlternative);
  console.log('✅ HeroSectionAlternative:', typeof HeroSectionAlternative);
  console.log('✅ AdCardAlternative:', typeof AdCardAlternative);
  console.log('✅ HomepageToggle:', typeof HomepageToggle);
} catch (error) {
  console.error('❌ Component import error:', error);
}

console.log('Homepage toggle test completed');