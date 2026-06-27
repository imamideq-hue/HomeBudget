/**
 * Core domain types for the HomeBudget app.
 * Kept intentionally small for the initial scaffold — extend as features grow.
 */

export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  /** Ionicons glyph name (see lib/categories.ts). */
  icon: string;
  /** Hex color used for charts and category pills. */
  color: string;
}

export interface Transaction {
  id: string;
  /** Always a positive number; `type` determines direction. */
  amount: number;
  type: TransactionType;
  categoryId: string;
  note?: string;
  /** ISO date string (YYYY-MM-DDTHH:mm:ss.sssZ). */
  date: string;
  /** Email/name of the member who logged it (for the shared use-case later). */
  member?: string;
}

export type BudgetPeriod = 'weekly' | 'monthly';

export interface Budget {
  categoryId: string;
  /** Spending limit for the period, in the app's base currency. */
  limit: number;
  period: BudgetPeriod;
}

export interface BudgetState {
  transactions: Transaction[];
  budgets: Budget[];
}
