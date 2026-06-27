import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import type { Budget, BudgetState, Transaction } from '@/lib/types';

const STORAGE_KEY = 'homebudget:state:v1';

// --- Seed data so the charts/lists render on first launch -------------------
const SEED: BudgetState = {
  transactions: [
    { id: 't1', amount: 64.2, type: 'expense', categoryId: 'groceries', note: 'Weekly shop', date: daysAgo(0) },
    { id: 't2', amount: 12.5, type: 'expense', categoryId: 'dining', note: 'Lunch', date: daysAgo(0) },
    { id: 't3', amount: 30, type: 'expense', categoryId: 'transport', note: 'Fuel', date: daysAgo(1) },
    { id: 't4', amount: 1800, type: 'income', categoryId: 'income', note: 'Salary', date: daysAgo(2) },
    { id: 't5', amount: 22, type: 'expense', categoryId: 'entertainment', note: 'Cinema', date: daysAgo(2) },
    { id: 't6', amount: 120, type: 'expense', categoryId: 'utilities', note: 'Electricity', date: daysAgo(4) },
  ],
  budgets: [
    { categoryId: 'groceries', limit: 400, period: 'monthly' },
    { categoryId: 'dining', limit: 200, period: 'monthly' },
    { categoryId: 'transport', limit: 150, period: 'monthly' },
    { categoryId: 'entertainment', limit: 100, period: 'monthly' },
  ],
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// --- Reducer ----------------------------------------------------------------
export type BudgetAction =
  | { type: 'HYDRATE'; payload: BudgetState }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'SET_BUDGET'; payload: Budget };

function reducer(state: BudgetState, action: BudgetAction): BudgetState {
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
    case 'SET_BUDGET': {
      const others = state.budgets.filter(
        (b) => b.categoryId !== action.payload.categoryId,
      );
      return { ...state, budgets: [...others, action.payload] };
    }
    default:
      return state;
  }
}

// --- Context ----------------------------------------------------------------
export interface BudgetContextValue {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
}

export const BudgetContext = createContext<BudgetContextValue | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, SEED);

  // Hydrate from AsyncStorage once on mount.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active && raw) {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) as BudgetState });
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
