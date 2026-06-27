import { useContext, useMemo } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { getGroupForSub } from '@/lib/categories';
import type { GroupCategory, Transaction } from '@/models';

export interface GroupSpend {
  group: GroupCategory;
  total: number;
}

/**
 * Access the shared budget store plus derived, rolled-up values.
 * Throws if used outside <BudgetProvider>.
 */
export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudget must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const { transactions, accounts, goals, groupCategories } = state;

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId),
    [state.users, state.currentUserId],
  );

  const currentSpace = useMemo(
    () => state.spaces.find((s) => s.id === state.currentSpaceId),
    [state.spaces, state.currentSpaceId],
  );

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [transactions]);

  /** Expense totals rolled up from sub-categories to their group, desc. */
  const spendByGroup = useMemo<GroupSpend[]>(() => {
    const totalByGroup = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      const group = getGroupForSub(t.subCategoryId);
      totalByGroup.set(group.id, (totalByGroup.get(group.id) ?? 0) + t.amount);
    }
    return groupCategories
      .map((group) => ({ group, total: totalByGroup.get(group.id) ?? 0 }))
      .filter((g) => g.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions, groupCategories]);

  /** Live balance for an account: opening balance + its transactions. */
  const accountBalance = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return 0;
    return transactions.reduce((sum, t) => {
      if (t.accountId !== accountId) return sum;
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, account.startingBalance);
  };

  // --- Action helpers -------------------------------------------------------
  const addTransaction = (t: Transaction) =>
    dispatch({ type: 'ADD_TRANSACTION', payload: t });

  const deleteTransaction = (id: string) =>
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } });

  return {
    // collections
    transactions,
    accounts,
    goals,
    groupCategories,
    // context
    currentUser,
    currentSpace,
    // derived
    totals,
    spendByGroup,
    accountBalance,
    // actions
    addTransaction,
    deleteTransaction,
  };
}
