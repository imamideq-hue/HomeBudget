/**
 * HomeBudget data schema.
 *
 * Relationships:
 *   User ──< SpaceMember >── Space
 *   Space ──< Account, GroupCategory, Goal, Loan
 *   GroupCategory ──< SubCategory          (sub-categories roll up to groups)
 *   Transaction ── Account, SubCategory, User   (and optionally Goal / Loan)
 */
export * from '@/models/common';
export * from '@/models/user';
export * from '@/models/space';
export * from '@/models/account';
export * from '@/models/category';
export * from '@/models/transaction';
export * from '@/models/goal';
export * from '@/models/loan';

import type { Account } from '@/models/account';
import type { GroupCategory, SubCategory } from '@/models/category';
import type { ID } from '@/models/common';
import type { Goal } from '@/models/goal';
import type { Loan } from '@/models/loan';
import type { Space } from '@/models/space';
import type { Transaction } from '@/models/transaction';
import type { User } from '@/models/user';

/**
 * The full client-side dataset for the active session. In a synced version
 * each collection would be scoped to the current Space on the server.
 */
export interface BudgetData {
  currentUserId: ID;
  currentSpaceId: ID;
  users: User[];
  spaces: Space[];
  accounts: Account[];
  groupCategories: GroupCategory[];
  subCategories: SubCategory[];
  transactions: Transaction[];
  goals: Goal[];
  loans: Loan[];
}
