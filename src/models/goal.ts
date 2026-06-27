import type { BaseEntity, ID, ISODateString } from '@/models/common';

export type GoalStatus = 'active' | 'reached' | 'archived';

/**
 * A savings target within a Space (e.g. "Vacation Fund"). `currentAmount`
 * tracks progress and can be grown by transactions linked via `goalId`.
 */
export interface Goal extends BaseEntity {
  spaceId: ID;
  name: string;
  targetAmount: number;
  currentAmount: number;
  /** Account where the saved money is held. */
  accountId?: ID;
  targetDate?: ISODateString;
  color: string;
  icon: string;
  status: GoalStatus;
}
