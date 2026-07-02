import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { GroupBudgetSummary } from '@/lib/budget';
import { formatCurrency } from '@/lib/format';

/**
 * A compact budget tile: a rounded card (like the account cards) with a colored
 * outline, the category icon, the name, spent/limit and a progress bar.
 */
export function BudgetRing({
  budget,
  onPress,
}: {
  budget: GroupBudgetSummary;
  onPress?: () => void;
}) {
  const pct = Math.min(budget.percentUsed, 1);
  const color = budget.isOverBudget ? '#FF6B6B' : budget.group.color;

  return (
    <Pressable
      onPress={onPress}
      className="w-40 items-center rounded-2xl bg-card p-4 active:opacity-70"
    >
      <View className="h-11 w-11 items-center justify-center">
        <Ionicons
          name={budget.group.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color={color}
        />
      </View>

      <Text numberOfLines={1} className="mt-3 text-sm font-semibold text-surface-dark">
        {budget.group.name}
      </Text>
      <Text
        numberOfLines={1}
        className={`mt-0.5 text-xs ${budget.isOverBudget ? 'text-expense' : 'text-muted'}`}
      >
        {formatCurrency(budget.totalSpent)} / {formatCurrency(budget.budgetLimit)}
      </Text>

      <View className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/25">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, backgroundColor: color }}
        />
      </View>
    </Pressable>
  );
}
