import { SEED_DATA } from '@/lib/seed';
import type { GroupCategory, SubCategory } from '@/models';

/**
 * Pure category lookups + the sub→group roll-up. These operate on the category
 * arrays passed in (which come from app state) so custom, user-created
 * categories resolve everywhere. The `DEFAULT_*` exports are the seed values,
 * used for seeding and tests.
 */

export const DEFAULT_GROUP_CATEGORIES = SEED_DATA.groupCategories;
export const DEFAULT_SUB_CATEGORIES = SEED_DATA.subCategories;

export function getGroupCategory(
  groups: GroupCategory[],
  id: string,
): GroupCategory | undefined {
  return groups.find((g) => g.id === id);
}

export function getSubCategory(subs: SubCategory[], id: string): SubCategory | undefined {
  return subs.find((s) => s.id === id);
}

/** Resolve the GroupCategory a sub-category rolls up into (falls back to last). */
export function getGroupForSub(
  groups: GroupCategory[],
  subs: SubCategory[],
  subCategoryId: string,
): GroupCategory {
  const sub = subs.find((s) => s.id === subCategoryId);
  const group = sub && groups.find((g) => g.id === sub.groupId);
  return group ?? groups[groups.length - 1];
}

/** Sub-categories belonging to a group (for pickers / drill-downs). */
export function getSubsForGroup(subs: SubCategory[], groupId: string): SubCategory[] {
  return subs.filter((s) => s.groupId === groupId);
}

export interface CategoryVisual {
  name: string;
  icon: string;
  color: string;
}

/** Display name/icon/color for a sub-category, inheriting the group's. */
export function resolveSubVisual(
  groups: GroupCategory[],
  subs: SubCategory[],
  subCategoryId: string,
): CategoryVisual {
  const sub = subs.find((s) => s.id === subCategoryId);
  const group = getGroupForSub(groups, subs, subCategoryId);
  return {
    name: sub?.name ?? group.name,
    icon: sub?.icon ?? group.icon,
    color: sub?.color ?? group.color,
  };
}
