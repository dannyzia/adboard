/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
      },
      aspectRatio: {
        'square': '1 / 1',
      },
    },
  },
  plugins: [],
}
