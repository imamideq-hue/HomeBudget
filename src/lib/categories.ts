import { SEED_DATA } from '@/lib/seed';
import type { GroupCategory, SubCategory } from '@/models';

/**
 * Category lookups + the sub→group roll-up. Categories are static in the
 * scaffold, so these resolve against the seed definitions.
 */

export const GROUP_CATEGORIES = SEED_DATA.groupCategories;
export const SUB_CATEGORIES = SEED_DATA.subCategories;

const GROUP_BY_ID = new Map(GROUP_CATEGORIES.map((g) => [g.id, g]));
const SUB_BY_ID = new Map(SUB_CATEGORIES.map((s) => [s.id, s]));

const FALLBACK_GROUP: GroupCategory =
  GROUP_CATEGORIES[GROUP_CATEGORIES.length - 1];

export function getGroupCategory(id: string): GroupCategory | undefined {
  return GROUP_BY_ID.get(id);
}

export function getSubCategory(id: string): SubCategory | undefined {
  return SUB_BY_ID.get(id);
}

/** Resolve the GroupCategory a sub-category rolls up into. */
export function getGroupForSub(subCategoryId: string): GroupCategory {
  const sub = SUB_BY_ID.get(subCategoryId);
  return (sub && GROUP_BY_ID.get(sub.groupId)) ?? FALLBACK_GROUP;
}

/** Sub-categories belonging to a group (for pickers / drill-downs). */
export function getSubsForGroup(groupId: string): SubCategory[] {
  return SUB_CATEGORIES.filter((s) => s.groupId === groupId);
}

export interface CategoryVisual {
  name: string;
  icon: string;
  color: string;
}

/** Display name/icon/color for a sub-category, inheriting the group's. */
export function resolveSubVisual(subCategoryId: string): CategoryVisual {
  const sub = SUB_BY_ID.get(subCategoryId);
  const group = getGroupForSub(subCategoryId);
  return {
    name: sub?.name ?? group.name,
    icon: sub?.icon ?? group.icon,
    color: sub?.color ?? group.color,
  };
}
