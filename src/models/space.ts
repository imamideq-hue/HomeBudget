import type { BaseEntity, CurrencyCode, ID, ISODateString } from '@/models/common';

/** A member's permission level within a Space. */
export type SpaceRole = 'owner' | 'editor' | 'viewer';

export interface SpaceMember {
  userId: ID;
  role: SpaceRole;
  joinedAt: ISODateString;
}

/**
 * A shared budgeting workspace. Accounts, categories, transactions and goals
 * all belong to a Space so several people can collaborate on one budget.
 */
export interface Space extends BaseEntity {
  name: string;
  ownerId: ID;
  members: SpaceMember[];
  /** Base currency every account/transaction in the space reports in. */
  currency: CurrencyCode;
  /** Accent color for the app theme (hex). Defaults to the app's purple. */
  accentColor?: string;
  /** Color used to mark the Joint (shared) section. */
  jointColor?: string;
  /** Whether the app uses the dark color scheme. */
  darkMode?: boolean;
  /** Which dashboard sections are visible (keyed by DashboardSectionKey). */
  dashboard?: Record<string, boolean>;
}
