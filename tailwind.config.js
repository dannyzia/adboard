/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Define screens explicitly to match the project's responsive matrix
    screens: {
      'xs': '480px',       // XSmall
      'sm': '640px',       // Small (default)
      'md': '768px',       // Medium (default)
      'lg': '1024px',      // Large (default)
      'xl': '1280px',      // XLarge (default)
      '2xl': '1536px',     // 2XLarge
      '3xl': '1920px',     // Extra large (16" and above)
    },
    extend: {
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
