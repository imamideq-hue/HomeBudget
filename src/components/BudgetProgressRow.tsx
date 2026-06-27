import { Text, View } from 'react-native';

import { CategoryPill } from '@/components/CategoryPill';
import type { GroupBudgetSummary } from '@/lib/budget';
import { formatCurrency } from '@/lib/format';

/** A group-category's monthly budget as an icon + spent/limit + progress bar. */
export function BudgetProgressRow({ budget }: { budget: GroupBudgetSummary }) {
  const ratio = Math.min(budget.percentUsed, 1);

  return (
    <View className="rounded-2xl bg-card p-4">
      <View className="flex-row items-center gap-3">
        <CategoryPill icon={budget.group.icon} color={budget.group.color} size={36} />
        <Text className="flex-1 text-base font-medium text-surface-dark">{budget.group.name}</Text>
        <Text
          className={`text-sm font-semibold ${budget.isOverBudget ? 'text-expense' : 'text-muted'}`}
        >
          {formatCurrency(budget.totalSpent)} / {formatCurrency(budget.budgetLimit)}
        </Text>
      </View>

      <View className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
        <View
          className="h-full rounded-full"
          style={{
            width: `${ratio * 100}%`,
            backgroundColor: budget.isOverBudget ? '#FF6B6B' : budget.group.color,
          }}
        />
      </View>

      <Text className={`mt-2 text-xs ${budget.isOverBudget ? 'text-expense' : 'text-muted'}`}>
        {budget.isOverBudget
          ? `${formatCurrency(Math.abs(budget.remaining))} over budget`
          : `${formatCurrency(budget.remaining)} remaining`}
      </Text>
    </View>
  );
}
