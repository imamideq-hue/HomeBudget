import { useContext } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { resolveDashboard, type DashboardSectionKey } from '@/lib/dashboard';

/**
 * Which dashboard sections are visible, plus a setter. Preferences are saved on
 * the current space, so they persist and can differ per household.
 */
export function useDashboard() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const space = state.spaces.find((s) => s.id === state.currentSpaceId);
  const sections = resolveDashboard(space?.dashboard);

  const setSection = (key: DashboardSectionKey, visible: boolean) =>
    dispatch({ type: 'SET_DASHBOARD_SECTION', payload: { key, visible } });

  return { sections, setSection };
}
