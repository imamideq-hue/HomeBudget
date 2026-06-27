import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { SEED_DATA } from '@/lib/seed';
import type { BudgetData, Transaction } from '@/models';

const STORAGE_KEY = 'homebudget:state:v2';

// --- Reducer ----------------------------------------------------------------
export type BudgetAction =
  | { type: 'HYDRATE'; payload: BudgetData }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } };

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
