import type { BaseEntity, ID, ISODateString, TransactionType } from '@/models/common';

/**
 * A single money movement — the "Item" in the budget. Each transaction is
 * filed under a SubCategory (and therefore rolls up to a GroupCategory) and
 * is attributed to an Account and the User who logged it.
 */
export interface Transaction extends BaseEntity {
  spaceId: ID;
  accountId: ID;
  /** FK -> SubCategory.id. Group is derived via SubCategory.groupId. */
  subCategoryId: ID;
  type: TransactionType;
  /** Always positive; `type` determines direction. */
  amount: number;
  note?: string;
  date: ISODateString;
  /** FK -> User.id — who logged it. */
  createdBy: ID;
  /** Optional links when this item funds a goal or repays a loan. */
  goalId?: ID;
  loanId?: ID;
}
