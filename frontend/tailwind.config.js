/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'slate-dark': '#0F172A',
        'blue-soft': '#3B82F6',
        'bg-light': '#F8FAFC',
      }
    },
  },
  plugins: [],
}
