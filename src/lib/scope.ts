import type { Account, Goal, Transaction } from '@/models';

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

export const accountInScope = (account: Account, scope: ScopeFilter): boolean =>
  ownerInScope(account.ownerId, scope);

export const goalInScope = (goal: Goal, scope: ScopeFilter): boolean =>
  ownerInScope(goal.ownerId, scope);

/**
 * A transaction belongs to a scope when its account does — money is "personal"
 * or "joint" based on where it lives.
 */
export function filterTransactionsByScope(
  transactions: Transaction[],
  accounts: Account[],
  scope: ScopeFilter,
): Transaction[] {
  if (scope === SCOPE_ALL) return transactions;
  const ownerByAccount = new Map(accounts.map((a) => [a.id, a.ownerId]));
  return transactions.filter((t) => ownerInScope(ownerByAccount.get(t.accountId), scope));
}
