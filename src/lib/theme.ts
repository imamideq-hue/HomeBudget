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
