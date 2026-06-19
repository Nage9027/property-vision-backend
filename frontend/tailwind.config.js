/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: "#0f172a",
          teal: "#14b8a6",
          accent: "#2dd4bf",
        },
      }
    },
  },
  plugins: [],
}
