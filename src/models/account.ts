import type { BaseEntity, CurrencyCode, ID } from '@/models/common';

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit' | 'investment';

/**
 * A place money lives within a Space (bank account, wallet, credit card…).
 * The live balance is `startingBalance` plus the sum of its transactions.
 */
export interface Account extends BaseEntity {
  spaceId: ID;
  name: string;
  type: AccountType;
  startingBalance: number;
  currency: CurrencyCode;
  /** Hex color + Ionicons glyph for display. */
  color: string;
  icon: string;
  /**
   * Who this account belongs to. A user id makes it that person's personal
   * money; `undefined` means it's Joint/Shared between everyone in the space.
   */
  ownerId?: ID;
  archived?: boolean;
}
