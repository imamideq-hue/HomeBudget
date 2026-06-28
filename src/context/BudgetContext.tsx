import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { SEED_DATA } from '@/lib/seed';
import type {
  BudgetData,
  GroupCategory,
  SubCategory,
  Transaction,
} from '@/models';

const STORAGE_KEY = 'homebudget:state:v3';

// --- Reducer ----------------------------------------------------------------
export type BudgetAction =
  | { type: 'HYDRATE'; payload: BudgetData }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'SET_BUDGET_LIMIT'; payload: { groupId: string; limit: number } }
  | { type: 'CONTRIBUTE_TO_GOAL'; payload: { goalId: string; amount: number } }
  | { type: 'ADD_SUBCATEGORY'; payload: SubCategory }
  | { type: 'ADD_GROUP_CATEGORY'; payload: GroupCategory }
  | { type: 'SET_GOAL_DEADLINE'; payload: { goalId: string; deadline?: string } };

function reducer(state: BudgetData, action: BudgetAction): BudgetData {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
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
    case 'CONTRIBUTE_TO_GOAL':
      return {
        ...state,
        goals: state.goals.map((goal) => {
          if (goal.id !== action.payload.goalId) return goal;
          const currentAmount = goal.currentAmount + action.payload.amount;
          return {
            ...goal,
            currentAmount,
            status: currentAmount >= goal.targetAmount ? 'reached' : 'active',
          };
        }),
      };
    case 'ADD_GROUP_CATEGORY':
      return { ...state, groupCategories: [...state.groupCategories, action.payload] };
    case 'ADD_SUBCATEGORY':
      return { ...state, subCategories: [...state.subCategories, action.payload] };
    case 'SET_GOAL_DEADLINE':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.goalId
            ? { ...goal, targetDate: action.payload.deadline }
            : goal,
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
