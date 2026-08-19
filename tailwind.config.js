/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        'navy': {
          DEFAULT: '#0A192F',
          'light': '#172A45',
        },
        'primary-blue': '#3B82F6',
        'light-gray': '#F3F4F6',
        'card': '#FFFFFF',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}