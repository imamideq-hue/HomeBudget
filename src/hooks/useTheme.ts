import { useContext } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { DEFAULT_ACCENT, DEFAULT_JOINT_COLOR, FOREGROUND, darken } from '@/lib/theme';

/**
 * The current theme: accent color (drives `*-primary` styles via a CSS
 * variable) plus the light/dark color scheme. `foreground` is a hex for icons
 * that can't use a class and must stay readable in both schemes.
 */
export function useTheme() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const space = state.spaces.find((s) => s.id === state.currentSpaceId);
  const accent = space?.accentColor ?? DEFAULT_ACCENT;
  const jointColor = space?.jointColor ?? DEFAULT_JOINT_COLOR;
  // Dark is the default (Cashew-style); an explicit light choice still wins.
  const isDark = space?.darkMode ?? true;

  const setAccent = (color: string) => dispatch({ type: 'SET_ACCENT', payload: { color } });
  const setJointColor = (color: string) =>
    dispatch({ type: 'SET_JOINT_COLOR', payload: { color } });
  const setDark = (enabled: boolean) =>
    dispatch({ type: 'SET_DARK_MODE', payload: { enabled } });

  return {
    accent,
    accentDark: darken(accent),
    jointColor,
    isDark,
    foreground: isDark ? FOREGROUND.dark : FOREGROUND.light,
    setAccent,
    setJointColor,
    setDark,
  };
}
