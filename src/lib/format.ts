import type { Transaction } from '@/lib/types';

/** Base currency for the scaffold. Make this user-configurable later. */
export const CURRENCY = 'USD';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/** Signed display: income shows "+", expense shows "-". */
export function formatSigned(t: Transaction): string {
  const sign = t.type === 'income' ? '+' : '-';
  return `${sign}${formatCurrency(Math.abs(t.amount))}`;
}

/** Full date label, e.g. "Jun 27, 2026". */
export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Whole days from today to `iso` (negative if in the past). */
export function daysUntil(iso: string): number {
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** Deadline status, e.g. "5 days left", "Due today", "Overdue by 3 days". */
export function formatDeadline(iso: string): string {
  const d = daysUntil(iso);
  if (d === 0) return 'Due today';
  if (d > 0) return `${d} day${d === 1 ? '' : 's'} left`;
  const overdue = -d;
  return `Overdue by ${overdue} day${overdue === 1 ? '' : 's'}`;
}

/** Human-friendly day label, e.g. "Today", "Yesterday", or "Jun 27". */
export function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface TransactionGroup {
  label: string;
  /** YYYY-MM-DD key used for sorting/section identity. */
  key: string;
  transactions: Transaction[];
}

/** Groups transactions by calendar day, newest day first. */
export function groupByDay(transactions: Transaction[]): TransactionGroup[] {
  const groups = new Map<string, Transaction[]>();

  for (const t of transactions) {
    const key = t.date.slice(0, 10);
    const bucket = groups.get(key);
    if (bucket) bucket.push(t);
    else groups.set(key, [t]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, items]) => ({
      key,
      label: formatDayLabel(items[0].date),
      transactions: items.sort((a, b) => (a.date < b.date ? 1 : -1)),
    }));
}
