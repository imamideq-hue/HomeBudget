/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/screens/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Cashew-inspired palette
        // Driven by a runtime CSS variable so the accent is user-customizable.
        primary: {
          DEFAULT: 'rgb(var(--color-primary, 124 92 252) / <alpha-value>)',
          dark: '#5B3FD9',
          light: '#A48BFF',
        },
        income: '#34C77B',
        expense: '#FF6B6B',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#15151B',
        },
        card: {
          DEFAULT: '#F4F4F8',
          dark: '#1E1E27',
        },
        muted: '#8A8A9E',
      },
    },
  },
  plugins: [],
};
