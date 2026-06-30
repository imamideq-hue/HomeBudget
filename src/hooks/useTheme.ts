import { useContext } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { DEFAULT_ACCENT, darken } from '@/lib/theme';

/**
 * The current accent color (theme) and a setter. `accent` drives every
 * `bg-primary`/`text-primary` style (via a CSS variable) plus the hardcoded
 * accent spots that read this hook directly.
 */
export function useTheme() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const space = state.spaces.find((s) => s.id === state.currentSpaceId);
  const accent = space?.accentColor ?? DEFAULT_ACCENT;

  const setAccent = (color: string) => dispatch({ type: 'SET_ACCENT', payload: { color } });

  return { accent, accentDark: darken(accent), setAccent };
}
