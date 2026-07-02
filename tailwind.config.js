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
        // Surface/card/muted are variable-driven so they flip for dark mode.
        surface: {
          // page background
          DEFAULT: 'rgb(var(--color-bg, 255 255 255) / <alpha-value>)',
          // primary foreground text (named "dark" historically)
          dark: 'rgb(var(--color-fg, 21 21 27) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--color-card, 244 244 248) / <alpha-value>)',
          dark: '#1E1E27',
        },
        muted: 'rgb(var(--color-muted, 138 138 158) / <alpha-value>)',
        // Hairline for card borders/dividers (flips with the scheme).
        line: 'rgb(var(--color-line, 234 234 240) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
