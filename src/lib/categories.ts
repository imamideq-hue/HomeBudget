import type { Category } from '@/lib/types';

/**
 * Default spending categories, Cashew-style. `icon` values are Ionicons names.
 */
export const CATEGORIES: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'cart', color: '#34C77B' },
  { id: 'dining', name: 'Dining', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', icon: 'bus', color: '#4DABF7' },
  { id: 'housing', name: 'Housing', icon: 'home', color: '#7C5CFC' },
  { id: 'utilities', name: 'Utilities', icon: 'flash', color: '#FFA94D' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#F783AC' },
  { id: 'health', name: 'Health', icon: 'medkit', color: '#22B8CF' },
  { id: 'income', name: 'Income', icon: 'cash', color: '#82C91E' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#8A8A9E' },
];

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

const FALLBACK: Category = CATEGORIES[CATEGORIES.length - 1];

export function getCategory(id: string): Category {
  return CATEGORY_BY_ID.get(id) ?? FALLBACK;
}
