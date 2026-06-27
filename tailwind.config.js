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
        primary: {
          DEFAULT: '#7C5CFC',
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
