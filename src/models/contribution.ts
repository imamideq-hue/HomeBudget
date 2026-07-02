import type { BaseEntity, ID } from '@/models/common';

/**
 * A single deposit toward a Goal — the history of who added how much, and when.
 */
export interface GoalContribution extends BaseEntity {
  spaceId: ID;
  goalId: ID;
  /** FK -> User.id — who made the contribution. */
  userId: ID;
  amount: number;
}
