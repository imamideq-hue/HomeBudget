import { useContext, useMemo } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import { useScope } from '@/context/ScopeContext';
import {
  calculateGroupBudget,
  calculateGroupBudgets,
  type GroupBudgetSummary,
} from '@/lib/budget';
import { getGroupForSub } from '@/lib/categories';
import { newId } from '@/lib/id';
import { filterTransactionsByScope } from '@/lib/scope';
import type { Transaction, TransactionType } from '@/models';

/** Fields a caller supplies; the hook fills in id/space/user/timestamps. */
export interface NewTransactionInput {
  subCategoryId: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  note?: string;
  /** Defaults to now. */
  date?: string;
  /** Which section it's filed under: a user id, or undefined for Joint. */
  ownerId?: string;
  goalId?: string;
}

export interface AddTransactionResult {
  transaction: Transaction;
  /** The parent group's monthly budget, recalculated to include the new item. */
  groupBudget: GroupBudgetSummary;
}

/**
 * State manager for transaction entry. `addTransaction` files a new item under
 * its sub-category and, because spend rolls up sub → group, immediately
 * recomputes the parent Group-Category's `totalSpent` and `remaining` monthly
 * budget. The `groupBudgets` list stays in sync reactively for any consumer.
 */
export function useBudgetTracker() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudgetTracker must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const { transactions, groupCategories, subCategories } = state;
  const { scope } = useScope();

  // Budgets reflect the finances currently in view (Everyone / Joint / a person).
  const scopedTransactions = useMemo(
    () => filterTransactionsByScope(transactions, scope),
    [transactions, scope],
  );

  // Recomputed automatically whenever transactions/categories/scope change.
  const groupBudgets = useMemo(
    () => calculateGroupBudgets(groupCategories, scopedTransactions, subCategories),
    [groupCategories, scopedTransactions, subCategories],
  );

  const getGroupBudget = (groupId: string): GroupBudgetSummary | undefined =>
    groupBudgets.find((g) => g.group.id === groupId);

  /** Set (or clear, when `limit <= 0`) a group's monthly budget limit. */
  const setBudgetLimit = (groupId: string, limit: number) =>
    dispatch({ type: 'SET_BUDGET_LIMIT', payload: { groupId, limit } });

  function addTransaction(input: NewTransactionInput): AddTransactionResult {
    const nowIso = new Date().toISOString();
    const transaction: Transaction = {
      id: newId(),
      spaceId: state.currentSpaceId,
      accountId: input.accountId,
      subCategoryId: input.subCategoryId,
      type: input.type,
      amount: input.amount,
      note: input.note?.trim() || undefined,
      date: input.date ?? nowIso,
      createdBy: state.currentUserId,
      createdAt: nowIso,
      ownerId: input.ownerId,
      goalId: input.goalId,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    // dispatch is applied on the next render, so project the recalculated
    // budget from the current transactions plus the new item.
    const group = getGroupForSub(groupCategories, subCategories, transaction.subCategoryId);
    const groupBudget = calculateGroupBudget(
      group,
      [transaction, ...transactions],
      subCategories,
    );

    return { transaction, groupBudget };
  }

  /**
   * Correct an existing transaction (e.g. switch the account from cash to card,
   * fix the amount or category). Spend rolls up sub → group, so the affected
   * group budgets recompute reactively for any consumer.
   */
  function editTransaction(id: string, input: NewTransactionInput): void {
    dispatch({
      type: 'EDIT_TRANSACTION',
      payload: {
        id,
        changes: {
          subCategoryId: input.subCategoryId,
          accountId: input.accountId,
          amount: input.amount,
          type: input.type,
          note: input.note?.trim() || undefined,
          date: input.date,
          ownerId: input.ownerId,
        },
      },
    });
  }

  return { groupBudgets, getGroupBudget, setBudgetLimit, addTransaction, editTransaction };
}
