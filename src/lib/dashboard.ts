/** Dashboard sections the user can show/hide (Cashew-style home customization). */
export type DashboardSectionKey =
  | 'balance'
  | 'spending'
  | 'quickAdd'
  | 'accounts'
  | 'budgets'
  | 'goals'
  | 'recent';

export interface DashboardSectionDef {
  key: DashboardSectionKey;
  label: string;
  description: string;
  icon: string;
}

/** Order here is also the order sections render on the dashboard. */
export const DASHBOARD_SECTIONS: DashboardSectionDef[] = [
  { key: 'balance', label: 'Total balance', description: 'Income and expenses summary', icon: 'wallet-outline' },
  { key: 'spending', label: 'Spending overview', description: 'Breakdown by category', icon: 'pie-chart-outline' },
  { key: 'quickAdd', label: 'Quick add', description: 'One-tap category shortcuts', icon: 'flash-outline' },
  { key: 'accounts', label: 'Accounts', description: 'Balances for each account', icon: 'card-outline' },
  { key: 'budgets', label: 'Budgets', description: "This month's budget rings", icon: 'stats-chart-outline' },
  { key: 'goals', label: 'Goals', description: 'Savings goal progress', icon: 'flag-outline' },
  { key: 'recent', label: 'Recent activity', description: 'Latest transactions', icon: 'time-outline' },
];

export type DashboardVisibility = Record<DashboardSectionKey, boolean>;

export const DEFAULT_DASHBOARD: DashboardVisibility = {
  balance: true,
  spending: true,
  quickAdd: true,
  accounts: true,
  budgets: true,
  goals: true,
  recent: true,
};

/** Merge saved prefs over the defaults so new sections default to visible. */
export function resolveDashboard(prefs?: Partial<Record<string, boolean>>): DashboardVisibility {
  return { ...DEFAULT_DASHBOARD, ...(prefs ?? {}) } as DashboardVisibility;
}
