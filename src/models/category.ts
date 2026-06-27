import type { BaseEntity, ID, TransactionType } from '@/models/common';

/**
 * Top-level category bucket. Sub-categories roll up into a GroupCategory, so
 * reporting can aggregate spend at the group level (e.g. "Food & Drink").
 */
export interface GroupCategory extends BaseEntity {
  spaceId: ID;
  name: string;
  icon: string;
  color: string;
  /** Whether this group buckets expenses or income. */
  kind: TransactionType;
  /** Optional monthly spending limit for the whole group. */
  budgetLimit?: number;
  order?: number;
}

/**
 * Leaf category. Always belongs to exactly one GroupCategory via `groupId`
 * — this is the roll-up relationship.
 */
export interface SubCategory extends BaseEntity {
  /** FK -> GroupCategory.id. */
  groupId: ID;
  spaceId: ID;
  name: string;
  /** Optional overrides; fall back to the parent group's icon/color. */
  icon?: string;
  color?: string;
  order?: number;
}
