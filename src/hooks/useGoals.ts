import { useContext, useMemo } from 'react';

import { BudgetContext, type GoalEdit } from '@/context/BudgetContext';
import { useScope } from '@/context/ScopeContext';
import { newId } from '@/lib/id';
import { goalInScope } from '@/lib/scope';
import type { Goal } from '@/models';

export interface NewGoalInput {
  name: string;
  targetAmount: number;
  color: string;
  icon: string;
  /** Owner user id, or undefined for a Joint/Shared goal. */
  ownerId?: string;
}

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
  const { scope } = useScope();
  // Goals in the current view (Everyone / Joint / a person).
  const goals = useMemo(
    () => state.goals.filter((g) => goalInScope(g, scope)),
    [state.goals, scope],
  );

  const progressFor = (goal: Goal): GoalProgress => {
    const ratio = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
    return {
      goal,
      ratio: Math.min(ratio, 1),
      remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
      isReached: goal.currentAmount >= goal.targetAmount,
    };
  };

  // Look up against the full list so contribute/deadline modals always resolve,
  // regardless of the current scope filter.
  const getGoal = (goalId: string) => state.goals.find((g) => g.id === goalId);

  /** Contributions for a goal, newest first. */
  const contributionsFor = (goalId: string) =>
    state.contributions
      .filter((c) => c.goalId === goalId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  /**
   * Add `amount` toward a goal, recording who contributed (defaults to the
   * current user). No-op for non-positive amounts.
   */
  const contribute = (goalId: string, amount: number, userId?: string) => {
    if (amount <= 0) return;
    dispatch({
      type: 'CONTRIBUTE_TO_GOAL',
      payload: {
        contribution: {
          id: newId(),
          spaceId: state.currentSpaceId,
          goalId,
          userId: userId ?? state.currentUserId,
          amount,
          createdAt: new Date().toISOString(),
        },
      },
    });
  };

  /** Set or clear (pass undefined) a goal's optional deadline. */
  const setDeadline = (goalId: string, deadline?: string) =>
    dispatch({ type: 'SET_GOAL_DEADLINE', payload: { goalId, deadline } });

  /** Assign a goal to a person, or to Joint/Shared (pass undefined). */
  const setOwner = (goalId: string, ownerId?: string) =>
    dispatch({ type: 'SET_GOAL_OWNER', payload: { goalId, ownerId } });

  /** Create a new savings goal (starts at zero progress). */
  const addGoal = (input: NewGoalInput): Goal => {
    const goal: Goal = {
      id: newId(),
      spaceId: state.currentSpaceId,
      name: input.name.trim(),
      targetAmount: input.targetAmount,
      currentAmount: 0,
      ownerId: input.ownerId,
      color: input.color,
      icon: input.icon,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GOAL', payload: goal });
    return goal;
  };

  /** Update an existing goal (name, target, icon, color, owner). */
  const editGoal = (id: string, changes: GoalEdit) =>
    dispatch({ type: 'EDIT_GOAL', payload: { id, changes } });

  /** Delete a goal and its contribution history. */
  const deleteGoal = (id: string) => dispatch({ type: 'DELETE_GOAL', payload: { id } });

  return {
    goals,
    progress: goals.map(progressFor),
    progressFor,
    getGoal,
    contributionsFor,
    contribute,
    setDeadline,
    setOwner,
    addGoal,
    editGoal,
    deleteGoal,
  };
}
