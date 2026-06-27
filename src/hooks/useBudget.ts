import { useContext, useMemo } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import type { Budget, Transaction } from '@/lib/types';

export interface CategorySpend {
  categoryId: string;
  total: number;
}

/**
 * Access the shared budget store plus a few derived values.
 * Throws if used outside <BudgetProvider>.
 */
export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudget must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const { transactions, budgets } = state;

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const spendByCategory = useMemo<CategorySpend[]>(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return [...map.entries()]
      .map(([categoryId, total]) => ({ categoryId, total }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  // --- Action helpers -------------------------------------------------------
  const addTransaction = (t: Transaction) =>
    dispatch({ type: 'ADD_TRANSACTION', payload: t });

  const deleteTransaction = (id: string) =>
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } });

  const setBudget = (b: Budget) => dispatch({ type: 'SET_BUDGET', payload: b });

  return {
    transactions,
    budgets,
    totals,
    spendByCategory,
    addTransaction,
    deleteTransaction,
    setBudget,
  };
}
