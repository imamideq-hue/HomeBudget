/**
 * Shared primitives used across the data schema.
 */

/** Opaque identifier (UUID/slug). */
export type ID = string;

/** ISO-8601 timestamp string, e.g. "2026-06-27T10:30:00.000Z". */
export type ISODateString = string;

/** ISO-4217 currency code, e.g. "USD", "EUR". */
export type CurrencyCode = string;

/** Direction of a money movement. */
export type TransactionType = 'expense' | 'income';

/** Common fields every persisted record carries. */
export interface BaseEntity {
  id: ID;
  createdAt: ISODateString;
}
