import type { GroupCategory, SubCategory, Transaction } from '@/models';

/**
 * Monthly budget summary for a single Group-Category. `totalSpent` rolls up
 * every expense filed under the group's sub-categories for the month, and
 * `remaining` is the limit minus that spend.
 */
export interface GroupBudgetSummary {
  group: GroupCategory;
  hasBudget: boolean;
  budgetLimit: number;
  totalSpent: number;
  remaining: number;
  /** 0..1+ fraction of the limit used (0 when there is no limit). */
  percentUsed: number;
  isOverBudget: boolean;
}

/** True if `iso` falls in the same calendar month/year as `ref`. */
export function isSameMonth(iso: string, ref: Date = new Date()): boolean {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/** Map of sub-category id → parent group id, for fast roll-up. */
function subToGroup(subCategories: SubCategory[]): Map<string, string> {
  return new Map(subCategories.map((s) => [s.id, s.groupId]));
}

function summarize(group: GroupCategory, totalSpent: number): GroupBudgetSummary {
  const budgetLimit = group.budgetLimit ?? 0;
  const hasBudget = budgetLimit > 0;
  return {
    group,
    hasBudget,
    budgetLimit,
    totalSpent,
    remaining: hasBudget ? budgetLimit - totalSpent : 0,
    percentUsed: hasBudget ? totalSpent / budgetLimit : 0,
    isOverBudget: hasBudget && totalSpent > budgetLimit,
  };
}

/**
 * Total expense spend for one group in the given month, rolled up from its
 * sub-categories (a transaction's sub-category resolves to its parent group).
 */
export function spentForGroup(
  groupId: string,
  transactions: Transaction[],
  subCategories: SubCategory[],
  ref: Date = new Date(),
): number {
  const groupOf = subToGroup(subCategories);
  let total = 0;
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    if (!isSameMonth(t.date, ref)) continue;
    if (groupOf.get(t.subCategoryId) !== groupId) continue;
    total += t.amount;
  }
  return total;
}

/** Month-scoped budget summary for a single group. */
export function calculateGroupBudget(
  group: GroupCategory,
  transactions: Transaction[],
  subCategories: SubCategory[],
  ref: Date = new Date(),
): GroupBudgetSummary {
  return summarize(group, spentForGroup(group.id, transactions, subCategories, ref));
}

/** Month-scoped budget summaries for every group, in input order. */
export function calculateGroupBudgets(
  groups: GroupCategory[],
  transactions: Transaction[],
  subCategories: SubCategory[],
  ref: Date = new Date(),
): GroupBudgetSummary[] {
  const groupOf = subToGroup(subCategories);
  const spentByGroup = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    if (!isSameMonth(t.date, ref)) continue;
    const groupId = groupOf.get(t.subCategoryId);
    if (groupId === undefined) continue;
    spentByGroup.set(groupId, (spentByGroup.get(groupId) ?? 0) + t.amount);
  }
  return groups.map((group) => summarize(group, spentByGroup.get(group.id) ?? 0));
}
