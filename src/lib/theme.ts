/** The app's default accent (the original purple). */
export const DEFAULT_ACCENT = '#7C5CFC';

/** Accent colors the user can choose from in Settings. */
export const ACCENT_CHOICES = [
  '#7C5CFC', // purple (default)
  '#4DABF7', // blue
  '#22B8CF', // teal
  '#34C77B', // green
  '#FFA94D', // orange
  '#FF6B6B', // red
  '#F783AC', // pink
  '#15151B', // graphite
];

/** Surface/text CSS variables for each color scheme (used at the app root). */
export const THEME_VARS = {
  light: {
    '--color-bg': '255 255 255',
    '--color-fg': '21 21 27',
    '--color-card': '244 244 248',
    '--color-muted': '138 138 158',
  },
  dark: {
    '--color-bg': '21 21 27',
    '--color-fg': '244 244 248',
    '--color-card': '30 30 39',
    '--color-muted': '154 160 174',
  },
} as const;

/** Neutral foreground hex for icons that can't use a class (per scheme). */
export const FOREGROUND = { light: '#15151B', dark: '#F4F4F8' } as const;

/** Page background hex per scheme (for the root container). */
export const BACKGROUND = { light: '#FFFFFF', dark: '#15151B' } as const;

/** Parse `#RRGGBB` into a space-separated `"r g b"` triplet for CSS variables. */
export function hexToRgbTriplet(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/** Darken a hex color by `amount` (0..1) — used for the balance-card gradient. */
export function darken(hex: string, amount = 0.22): string {
  const h = hex.replace('#', '');
  const channel = (i: number) => {
    const v = parseInt(h.slice(i, i + 2), 16);
    return Math.max(0, Math.round(v * (1 - amount)));
  };
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to2(channel(0))}${to2(channel(2))}${to2(channel(4))}`;
}
