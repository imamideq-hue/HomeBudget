import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { SCOPE_JOINT, type ScopeFilter } from '@/lib/scope';

interface ScopeContextValue {
  scope: ScopeFilter;
  setScope: (scope: ScopeFilter) => void;
}

const ScopeContext = createContext<ScopeContextValue | null>(null);

/**
 * Holds which finances are currently in view (Everyone / Joint / a person).
 * It's a UI preference, kept separate from the persisted budget data.
 */
export function ScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<ScopeFilter>(SCOPE_JOINT);
  const value = useMemo(() => ({ scope, setScope }), [scope]);
  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope(): ScopeContextValue {
  const ctx = useContext(ScopeContext);
  if (!ctx) {
    throw new Error('useScope must be used within a <ScopeProvider>');
  }
  return ctx;
}
