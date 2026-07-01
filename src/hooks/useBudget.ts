import { useContext, useMemo } from 'react';

import { BudgetContext, type AccountEdit, type UserEdit } from '@/context/BudgetContext';
import { useScope } from '@/context/ScopeContext';
import { getGroupForSub } from '@/lib/categories';
import { newId } from '@/lib/id';
import { filterTransactionsByScope, goalInScope } from '@/lib/scope';
import type { Account, AccountType, GroupCategory, Transaction, User } from '@/models';

export interface NewMemberInput {
  name: string;
  email?: string;
  color: string;
}

export interface NewAccountInput {
  name: string;
  type: AccountType;
  icon: string;
  color: string;
  startingBalance: number;
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
  const {
    transactions: allTransactions,
    accounts: allAccounts,
    goals: allGoals,
    groupCategories,
    subCategories,
  } = state;
  const { scope } = useScope();

  // Accounts are shared payment sources, shown regardless of the active section.
  const accounts = allAccounts;
  // Scoped views: which finances are currently shown (Everyone / Joint / a person).
  const transactions = useMemo(
    () => filterTransactionsByScope(allTransactions, scope),
    [allTransactions, scope],
  );
  const goals = useMemo(
    () => allGoals.filter((g) => goalInScope(g, scope)),
    [allGoals, scope],
  );

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

  /**
   * Live balance for an account: opening balance + its transactions. Balance is
   * account-specific, so it always uses the full (unscoped) transaction list.
   */
  const accountBalance = (accountId: string) => {
    const account = allAccounts.find((a) => a.id === accountId);
    if (!account) return 0;
    return allTransactions.reduce((sum, t) => {
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

  /** Remove a member from the space (the current user can't remove themselves). */
  const removeMember = (userId: string) => {
    if (userId === state.currentUserId) return;
    dispatch({ type: 'REMOVE_MEMBER', payload: { userId } });
  };

  /** Rename a person (e.g. change "You" to your real name). */
  const renameUser = (userId: string, name: string) => {
    const trimmed = name.trim();
    if (trimmed) dispatch({ type: 'RENAME_USER', payload: { userId, name: trimmed } });
  };

  /** Edit a member's details (name, email, color). */
  const editUser = (userId: string, changes: UserEdit) =>
    dispatch({ type: 'EDIT_USER', payload: { userId, changes } });

  /** Create a new account. */
  const addAccount = (input: NewAccountInput): Account => {
    const account: Account = {
      id: newId(),
      spaceId: state.currentSpaceId,
      name: input.name.trim(),
      type: input.type,
      startingBalance: input.startingBalance,
      currency: currentSpace?.currency ?? 'USD',
      color: input.color,
      icon: input.icon,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: account });
    return account;
  };

  /** Edit an account's details (name, type, icon, color). */
  const editAccount = (id: string, changes: AccountEdit) =>
    dispatch({ type: 'EDIT_ACCOUNT', payload: { id, changes } });

  /** Delete an account and its transactions. */
  const deleteAccount = (id: string) => dispatch({ type: 'DELETE_ACCOUNT', payload: { id } });

  /** Change the active currency (the provider re-syncs the formatter). */
  const setCurrency = (code: string) =>
    dispatch({ type: 'SET_CURRENCY', payload: { code } });

  /**
   * Add `amount` (may be negative) to an account's balance without logging a
   * transaction — it adjusts the opening balance, so it never shows as income
   * or expense.
   */
  const addToAccountBalance = (accountId: string, amount: number) => {
    const account = allAccounts.find((a) => a.id === accountId);
    if (!account) return;
    dispatch({
      type: 'SET_ACCOUNT_STARTING_BALANCE',
      payload: { accountId, startingBalance: account.startingBalance + amount },
    });
  };

  /**
   * Correct an account so its current balance becomes `targetBalance`, by
   * shifting the opening balance. Not recorded as a transaction.
   */
  const setAccountBalance = (accountId: string, targetBalance: number) => {
    const account = allAccounts.find((a) => a.id === accountId);
    if (!account) return;
    const delta = targetBalance - accountBalance(accountId);
    dispatch({
      type: 'SET_ACCOUNT_STARTING_BALANCE',
      payload: { accountId, startingBalance: account.startingBalance + delta },
    });
  };

  return {
    // collections (scoped to the current view)
    transactions,
    accounts,
    goals,
    groupCategories,
    users: state.users,
    // raw collections (ignore the scope filter — for forms & detail lookups)
    allTransactions,
    allAccounts,
    allGoals,
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
    removeMember,
    renameUser,
    editUser,
    addAccount,
    editAccount,
    deleteAccount,
    setCurrency,
    addToAccountBalance,
    setAccountBalance,
  };
}
