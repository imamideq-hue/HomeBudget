import { describe, expect, it } from 'vitest';

import {
  filterTransactionsByScope,
  goalInScope,
  ownerInScope,
  SCOPE_ALL,
  SCOPE_JOINT,
} from '@/lib/scope';
import type { Account, Goal, Transaction } from '@/models';

const acc = (id: string, ownerId?: string): Account => ({
  id,
  spaceId: 'space_home',
  name: id,
  type: 'cash',
  startingBalance: 0,
  currency: 'USD',
  color: '#000',
  icon: 'cash',
  ownerId,
  createdAt: '2026-06-01T00:00:00.000Z',
});

const tx = (id: string, accountId: string): Transaction => ({
  id,
  spaceId: 'space_home',
  accountId,
  subCategoryId: 'sub_groceries',
  type: 'expense',
  amount: 10,
  date: '2026-06-10T00:00:00.000Z',
  createdBy: 'user_me',
  createdAt: '2026-06-10T00:00:00.000Z',
});

describe('ownerInScope', () => {
  it("'all' matches everyone", () => {
    expect(ownerInScope(undefined, SCOPE_ALL)).toBe(true);
    expect(ownerInScope('user_a', SCOPE_ALL)).toBe(true);
  });

  it("'joint' matches only un-owned (shared) entities", () => {
    expect(ownerInScope(undefined, SCOPE_JOINT)).toBe(true);
    expect(ownerInScope('user_a', SCOPE_JOINT)).toBe(false);
  });

  it('a user id matches only that person', () => {
    expect(ownerInScope('user_a', 'user_a')).toBe(true);
    expect(ownerInScope('user_b', 'user_a')).toBe(false);
    expect(ownerInScope(undefined, 'user_a')).toBe(false);
  });
});

describe('filterTransactionsByScope', () => {
  const accounts = [acc('joint_acc'), acc('a_acc', 'user_a'), acc('b_acc', 'user_b')];
  const txs = [tx('t1', 'joint_acc'), tx('t2', 'a_acc'), tx('t3', 'b_acc')];

  it('returns everything for the All scope', () => {
    expect(filterTransactionsByScope(txs, accounts, SCOPE_ALL)).toHaveLength(3);
  });

  it('keeps only joint-account transactions for Joint', () => {
    const result = filterTransactionsByScope(txs, accounts, SCOPE_JOINT);
    expect(result.map((t) => t.id)).toEqual(['t1']);
  });

  it("keeps only a person's transactions for their scope", () => {
    const result = filterTransactionsByScope(txs, accounts, 'user_a');
    expect(result.map((t) => t.id)).toEqual(['t2']);
  });
});

describe('goalInScope', () => {
  const joint = { ownerId: undefined } as Goal;
  const personal = { ownerId: 'user_a' } as Goal;

  it('joint goals show under Joint and Everyone, not a person', () => {
    expect(goalInScope(joint, SCOPE_JOINT)).toBe(true);
    expect(goalInScope(joint, SCOPE_ALL)).toBe(true);
    expect(goalInScope(joint, 'user_a')).toBe(false);
  });

  it('personal goals show under their owner and Everyone, not Joint', () => {
    expect(goalInScope(personal, 'user_a')).toBe(true);
    expect(goalInScope(personal, SCOPE_ALL)).toBe(true);
    expect(goalInScope(personal, SCOPE_JOINT)).toBe(false);
  });
});
