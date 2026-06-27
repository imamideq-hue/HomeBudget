import type { BaseEntity } from '@/models/common';

/**
 * A person who can belong to one or more Spaces and log transactions.
 */
export interface User extends BaseEntity {
  name: string;
  email?: string;
  /** Hex color used for the user's avatar/initials. */
  color: string;
}
