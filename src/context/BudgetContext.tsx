import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { setCurrencyCode } from '@/lib/format';
import { SEED_DATA } from '@/lib/seed';
import type {
  BudgetData,
  Goal,
  GoalContribution,
  GroupCategory,
  SubCategory,
  Transaction,
  User,
} from '@/models';

const STORAGE_KEY = 'homebudget:state:v4';

/** Editable fields of a sub-category. */
export type SubCategoryEdit = Partial<Pick<SubCategory, 'name' | 'icon' | 'color' | 'groupId'>>;

/** Editable fields of a goal. */
export type GoalEdit = Partial<
  Pick<Goal, 'name' | 'targetAmount' | 'icon' | 'color' | 'ownerId'>
>;

/** Editable fields of a transaction (e.g. correcting the account or amount). */
export type TransactionEdit = Partial<
  Pick<Transaction, 'accountId' | 'subCategoryId' | 'type' | 'amount' | 'note' | 'date' | 'ownerId'>
>;

// --- Reducer ----------------------------------------------------------------
export type BudgetAction =
  | { type: 'HYDRATE'; payload: BudgetData }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'EDIT_TRANSACTION'; payload: { id: string; changes: TransactionEdit } }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'SET_BUDGET_LIMIT'; payload: { groupId: string; limit: number } }
  | { type: 'CONTRIBUTE_TO_GOAL'; payload: { contribution: GoalContribution } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'EDIT_GOAL'; payload: { id: string; changes: GoalEdit } }
  | { type: 'DELETE_GOAL'; payload: { id: string } }
  | { type: 'ADD_SUBCATEGORY'; payload: SubCategory }
  | { type: 'EDIT_SUBCATEGORY'; payload: { id: string; changes: SubCategoryEdit } }
  | { type: 'ADD_GROUP_CATEGORY'; payload: GroupCategory }
  | { type: 'SET_GOAL_DEADLINE'; payload: { goalId: string; deadline?: string } }
  | { type: 'ADD_MEMBER'; payload: User }
  | { type: 'SET_GOAL_OWNER'; payload: { goalId: string; ownerId?: string } }
  | { type: 'SET_CURRENCY'; payload: { code: string } }
  | { type: 'SET_ACCENT'; payload: { color: string } };

function currencyOf(data: BudgetData): string {
  return data.spaces.find((s) => s.id === data.currentSpaceId)?.currency ?? 'USD';
}

function reducer(state: BudgetData, action: BudgetAction): BudgetData {
  switch (action.type) {
    case 'HYDRATE':
      // Sync the currency formatter before the resulting render.
      setCurrencyCode(currencyOf(action.payload));
      // Backfill collections added in newer versions so older saved state loads.
      return { ...action.payload, contributions: action.payload.contributions ?? [] };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.changes } : t,
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload.id),
      };
    case 'SET_BUDGET_LIMIT':
      return {
        ...state,
        groupCategories: state.groupCategories.map((g) =>
          g.id === action.payload.groupId
            ? { ...g, budgetLimit: action.payload.limit > 0 ? action.payload.limit : undefined }
            : g,
        ),
      };
    case 'CONTRIBUTE_TO_GOAL': {
      const { contribution } = action.payload;
      return {
        ...state,
        contributions: [contribution, ...state.contributions],
        goals: state.goals.map((goal) => {
          if (goal.id !== contribution.goalId) return goal;
          const currentAmount = goal.currentAmount + contribution.amount;
          return {
            ...goal,
            currentAmount,
            status: currentAmount >= goal.targetAmount ? 'reached' : 'active',
          };
        }),
      };
    }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'EDIT_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.changes } : g,
        ),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload.id),
        // Drop the goal's contribution history too.
        contributions: state.contributions.filter((c) => c.goalId !== action.payload.id),
      };
    case 'ADD_GROUP_CATEGORY':
      return { ...state, groupCategories: [...state.groupCategories, action.payload] };
    case 'ADD_SUBCATEGORY':
      return { ...state, subCategories: [...state.subCategories, action.payload] };
    case 'EDIT_SUBCATEGORY':
      return {
        ...state,
        subCategories: state.subCategories.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.changes } : s,
        ),
      };
    case 'SET_GOAL_DEADLINE':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.goalId
            ? { ...goal, targetDate: action.payload.deadline }
            : goal,
        ),
      };
    case 'SET_GOAL_OWNER':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.goalId ? { ...g, ownerId: action.payload.ownerId } : g,
        ),
      };
    case 'SET_CURRENCY':
      setCurrencyCode(action.payload.code);
      return {
        ...state,
        spaces: state.spaces.map((space) =>
          space.id === state.currentSpaceId
            ? { ...space, currency: action.payload.code }
            : space,
        ),
      };
    case 'SET_ACCENT':
      return {
        ...state,
        spaces: state.spaces.map((space) =>
          space.id === state.currentSpaceId
            ? { ...space, accentColor: action.payload.color }
            : space,
        ),
      };
    case 'ADD_MEMBER':
      return {
        ...state,
        users: [...state.users, action.payload],
        spaces: state.spaces.map((space) =>
          space.id === state.currentSpaceId
            ? {
                ...space,
                members: [
                  ...space.members,
                  {
                    userId: action.payload.id,
                    role: 'editor',
                    joinedAt: action.payload.createdAt,
                  },
                ],
              }
            : space,
        ),
      };
    default:
      return state;
  }
}

// --- Context ----------------------------------------------------------------
export interface BudgetContextValue {
  state: BudgetData;
  dispatch: React.Dispatch<BudgetAction>;
}

export const BudgetContext = createContext<BudgetContextValue | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, SEED_DATA);

  // Hydrate persisted state once on mount.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active && raw) {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) as BudgetData });
        }
      })
      .catch(() => {
        // Ignore read errors — fall back to seed data.
      });
    return () => {
      active = false;
    };
  }, []);

  // Persist on every change.
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Ignore write errors for the scaffold.
    });
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}
