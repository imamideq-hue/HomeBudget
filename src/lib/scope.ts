import type { Goal, Transaction } from '@/models';
import type { ID } from '@/models/common';

/**
 * A view-level filter that decides whose finances are shown:
 *  - `'all'`   → everyone's money combined
 *  - `'joint'` → only Joint/Shared accounts & goals (ownerId undefined)
 *  - a user id → only that person's personal money
 */
export type ScopeFilter = 'all' | 'joint' | string;

export const SCOPE_ALL: ScopeFilter = 'all';
export const SCOPE_JOINT: ScopeFilter = 'joint';

/** Does an owner (or its absence) fall within the selected scope? */
export function ownerInScope(ownerId: string | undefined, scope: ScopeFilter): boolean {
  if (scope === SCOPE_ALL) return true;
  if (scope === SCOPE_JOINT) return ownerId == null;
  return ownerId === scope;
}

export const goalInScope = (goal: Goal, scope: ScopeFilter): boolean =>
  ownerInScope(goal.ownerId, scope);

/**
 * A transaction belongs to a scope based on its own owner (the section it was
 * filed under): a user id for personal, `undefined` for Joint/Shared.
 */
export function filterTransactionsByScope(
  transactions: Transaction[],
  scope: ScopeFilter,
): Transaction[] {
  if (scope === SCOPE_ALL) return transactions;
  return transactions.filter((t) => ownerInScope(t.ownerId, scope));
}

/**
 * The owner to file a *new* entry under, given the section currently in view.
 * "Everyone" has no single owner, so new items default to Joint/Shared.
 */
export function defaultOwnerForScope(scope: ScopeFilter): ID | undefined {
  if (scope === SCOPE_ALL || scope === SCOPE_JOINT) return undefined;
  return scope;
}
