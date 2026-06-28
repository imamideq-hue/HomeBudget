import { useContext, useMemo } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { getGroupForSub } from '@/lib/categories';
import { newId } from '@/lib/id';
import type { GroupCategory, Transaction, User } from '@/models';

export interface NewMemberInput {
  name: string;
  email?: string;
  color: string;
}

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
  const { transactions, accounts, goals, groupCategories, subCategories } = state;

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
      const group = getGroupForSub(groupCategories, subCategories, t.subCategoryId);
      totalByGroup.set(group.id, (totalByGroup.get(group.id) ?? 0) + t.amount);
    }
    return groupCategories
      .map((group) => ({ group, total: totalByGroup.get(group.id) ?? 0 }))
      .filter((g) => g.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions, groupCategories, subCategories]);

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

  /** Add a person to the current space (as an editor). */
  const addMember = (input: NewMemberInput): User => {
    const user: User = {
      id: newId(),
      name: input.name.trim(),
      email: input.email?.trim() || undefined,
      color: input.color,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MEMBER', payload: user });
    return user;
  };

  /** Change the active currency (the provider re-syncs the formatter). */
  const setCurrency = (code: string) =>
    dispatch({ type: 'SET_CURRENCY', payload: { code } });

  return {
    // collections
    transactions,
    accounts,
    goals,
    groupCategories,
    users: state.users,
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
    addMember,
    setCurrency,
  };
}
