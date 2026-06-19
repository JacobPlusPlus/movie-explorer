/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        'secondary-bg': '#121826',
        card: '#1B2333',
        primary: '#6366F1',
        'hover-accent': '#818CF8',
        success: '#22C55E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'border-color': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
}