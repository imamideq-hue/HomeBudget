import { describe, expect, it } from 'vitest';

import {
  calculateGroupBudget,
  calculateGroupBudgets,
  isSameMonth,
  spentForGroup,
} from '@/lib/budget';
import { DEFAULT_GROUP_CATEGORIES, DEFAULT_SUB_CATEGORIES } from '@/lib/categories';
import type { Transaction } from '@/models';

const REF = new Date('2026-06-15T12:00:00.000Z');
const inJune = '2026-06-10T09:00:00.000Z';
const inMay = '2026-05-28T09:00:00.000Z';

const GROUPS = DEFAULT_GROUP_CATEGORIES;
const SUBS = DEFAULT_SUB_CATEGORIES;
// Seed groups have no budget by default; give Food a limit for these tests.
const FOOD = { ...GROUPS.find((g) => g.id === 'grp_food')!, budgetLimit: 600 };

let seq = 0;
function tx(partial: Partial<Transaction> & { subCategoryId: string; amount: number }): Transaction {
  return {
    id: `tx${seq++}`,
    spaceId: 'space_home',
    accountId: 'acc_checking',
    type: 'expense',
    note: undefined,
    date: inJune,
    createdBy: 'user_me',
    createdAt: inJune,
    ...partial,
  };
}

describe('isSameMonth', () => {
  it('matches within the same calendar month/year', () => {
    expect(isSameMonth(inJune, REF)).toBe(true);
  });

  it('rejects a different month', () => {
    expect(isSameMonth(inMay, REF)).toBe(false);
  });
});

describe('spentForGroup (sub -> group roll-up, month-scoped)', () => {
  it('sums expenses across a group\'s sub-categories for the month', () => {
    const txs = [
      tx({ subCategoryId: 'sub_groceries', amount: 100 }), // -> grp_food
      tx({ subCategoryId: 'sub_dining', amount: 50 }), //     -> grp_food
      tx({ subCategoryId: 'sub_transit', amount: 30 }), //    -> grp_transport (excluded)
    ];
    expect(spentForGroup('grp_food', txs, SUBS, REF)).toBe(150);
  });

  it('ignores transactions from other months', () => {
    const txs = [
      tx({ subCategoryId: 'sub_groceries', amount: 100, date: inJune }),
      tx({ subCategoryId: 'sub_coffee', amount: 999, date: inMay }), // wrong month
    ];
    expect(spentForGroup('grp_food', txs, SUBS, REF)).toBe(100);
  });

  it('ignores income transactions', () => {
    const txs = [
      tx({ subCategoryId: 'sub_groceries', amount: 100 }),
      tx({ subCategoryId: 'sub_groceries', amount: 500, type: 'income' }),
    ];
    expect(spentForGroup('grp_food', txs, SUBS, REF)).toBe(100);
  });
});

describe('calculateGroupBudget', () => {
  it('computes remaining and stays under budget', () => {
    const txs = [tx({ subCategoryId: 'sub_groceries', amount: 150 })];
    const result = calculateGroupBudget(FOOD, txs, SUBS, REF);

    expect(result.budgetLimit).toBe(600);
    expect(result.totalSpent).toBe(150);
    expect(result.remaining).toBe(450);
    expect(result.percentUsed).toBeCloseTo(0.25);
    expect(result.isOverBudget).toBe(false);
    expect(result.hasBudget).toBe(true);
  });

  it('flags over-budget with a negative remaining', () => {
    const txs = [tx({ subCategoryId: 'sub_groceries', amount: 700 })];
    const result = calculateGroupBudget(FOOD, txs, SUBS, REF);

    expect(result.totalSpent).toBe(700);
    expect(result.remaining).toBe(-100);
    expect(result.isOverBudget).toBe(true);
  });
});

describe('calculateGroupBudgets', () => {
  it('returns one summary per group, in input order', () => {
    const summaries = calculateGroupBudgets(GROUPS, [], SUBS, REF);
    expect(summaries).toHaveLength(GROUPS.length);
    expect(summaries.map((s) => s.group.id)).toEqual(GROUPS.map((g) => g.id));
  });

  it('rolls each transaction up to the correct group', () => {
    const txs = [
      tx({ subCategoryId: 'sub_groceries', amount: 80 }), // grp_food
      tx({ subCategoryId: 'sub_fuel', amount: 40 }), //      grp_transport
    ];
    const byId = Object.fromEntries(
      calculateGroupBudgets(GROUPS, txs, SUBS, REF).map((s) => [s.group.id, s.totalSpent]),
    );
    expect(byId.grp_food).toBe(80);
    expect(byId.grp_transport).toBe(40);
    expect(byId.grp_home).toBe(0);
  });
});
