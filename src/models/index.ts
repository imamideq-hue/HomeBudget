/**
 * HomeBudget data schema.
 *
 * Relationships:
 *   User ──< SpaceMember >── Space
 *   Space ──< Account, GroupCategory, Goal
 *   GroupCategory ──< SubCategory          (sub-categories roll up to groups)
 *   Transaction ── Account, SubCategory, User   (and optionally Goal)
 */
export * from '@/models/common';
export * from '@/models/user';
export * from '@/models/space';
export * from '@/models/account';
export * from '@/models/category';
export * from '@/models/transaction';
export * from '@/models/goal';
export * from '@/models/contribution';

import type { Account } from '@/models/account';
import type { GroupCategory, SubCategory } from '@/models/category';
import type { ID } from '@/models/common';
import type { GoalContribution } from '@/models/contribution';
import type { Goal } from '@/models/goal';
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
  /** History of deposits made toward goals (who, how much, when). */
  contributions: GoalContribution[];
}
