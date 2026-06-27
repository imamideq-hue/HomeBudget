import { useContext } from 'react';

import { BudgetContext } from '@/context/BudgetContext';
import type { Goal } from '@/models';

export interface GoalProgress {
  goal: Goal;
  /** 0..1 fraction of the target saved. */
  ratio: number;
  remaining: number;
  isReached: boolean;
}

/**
 * Read goals and contribute toward them. Contributing increases a goal's saved
 * amount and marks it reached once it meets its target.
 * Throws if used outside <BudgetProvider>.
 */
export function useGoals() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useGoals must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const { goals } = state;

  const progressFor = (goal: Goal): GoalProgress => {
    const ratio = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
    return {
      goal,
      ratio: Math.min(ratio, 1),
      remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
      isReached: goal.currentAmount >= goal.targetAmount,
    };
  };

  const getGoal = (goalId: string) => goals.find((g) => g.id === goalId);

  /** Add `amount` toward a goal (no-op for non-positive amounts). */
  const contribute = (goalId: string, amount: number) => {
    if (amount > 0) dispatch({ type: 'CONTRIBUTE_TO_GOAL', payload: { goalId, amount } });
  };

  return {
    goals,
    progress: goals.map(progressFor),
    progressFor,
    getGoal,
    contribute,
  };
}
