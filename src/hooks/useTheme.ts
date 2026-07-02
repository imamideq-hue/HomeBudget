import { useContext } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { useScope } from '@/context/ScopeContext';
import { SCOPE_JOINT } from '@/lib/scope';
import { DEFAULT_ACCENT, DEFAULT_JOINT_COLOR, FOREGROUND, darken } from '@/lib/theme';

/**
 * The current theme. The accent (which drives `*-primary` styles via a CSS
 * variable) follows the selected section: the Joint color when Joint is in
 * view, or the person's color when a personal section is selected — so the
 * whole app re-tints to make the active section obvious. `foreground` is a hex
 * for icons that can't use a class and must stay readable in both schemes.
 */
export function useTheme() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <BudgetProvider>');
  }
  const { state } = ctx;
  const { dispatch } = ctx;
  const { scope } = useScope();
  const space = state.spaces.find((s) => s.id === state.currentSpaceId);

  const jointColor = space?.jointColor ?? DEFAULT_JOINT_COLOR;
  const me = state.users.find((u) => u.id === state.currentUserId);
  const youColor = me?.color ?? DEFAULT_ACCENT;

  // Accent = the color of whatever section is currently selected.
  const scopeUser = state.users.find((u) => u.id === scope);
  const accent = scope === SCOPE_JOINT ? jointColor : (scopeUser?.color ?? jointColor);

  // Dark is the default (Cashew-style); an explicit light choice still wins.
  const isDark = space?.darkMode ?? true;

  const setJointColor = (color: string) =>
    dispatch({ type: 'SET_JOINT_COLOR', payload: { color } });
  const setDark = (enabled: boolean) =>
    dispatch({ type: 'SET_DARK_MODE', payload: { enabled } });

  return {
    accent,
    accentDark: darken(accent),
    jointColor,
    youColor,
    isDark,
    foreground: isDark ? FOREGROUND.dark : FOREGROUND.light,
    setJointColor,
    setDark,
  };
}
