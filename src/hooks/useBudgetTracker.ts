import { useContext, useMemo } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import {
  calculateGroupBudget,
  calculateGroupBudgets,
  type GroupBudgetSummary,
} from '@/lib/budget';
import { getGroupForSub } from '@/lib/categories';
import { newId } from '@/lib/id';
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

  // Recomputed automatically whenever transactions/categories change.
  const groupBudgets = useMemo(
    () => calculateGroupBudgets(groupCategories, transactions, subCategories),
    [groupCategories, transactions, subCategories],
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

  return { groupBudgets, getGroupBudget, setBudgetLimit, addTransaction };
}
