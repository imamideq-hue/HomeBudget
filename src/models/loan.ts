import type { BaseEntity, ID, ISODateString } from '@/models/common';

/** 'borrowed' = money you owe; 'lent' = money owed to you. */
export type LoanDirection = 'borrowed' | 'lent';

export type LoanStatus = 'open' | 'settled';

/**
 * Money owed to or by the Space. `outstanding` is the remaining balance and
 * shrinks as repayments (transactions linked via `loanId`) are recorded.
 */
export interface Loan extends BaseEntity {
  spaceId: ID;
  name: string;
  counterparty: string;
  direction: LoanDirection;
  principal: number;
  outstanding: number;
  /** Annual interest rate as a percentage, if any. */
  interestRate?: number;
  accountId?: ID;
  startDate: ISODateString;
  dueDate?: ISODateString;
  status: LoanStatus;
}
