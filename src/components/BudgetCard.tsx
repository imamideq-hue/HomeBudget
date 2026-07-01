import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import type { GroupBudgetSummary } from '@/lib/budget';
import { formatCurrency } from '@/lib/format';
import { darken, lighten } from '@/lib/theme';

interface Props {
  budget: GroupBudgetSummary;
  onPress?: (budget: GroupBudgetSummary) => void;
}

/**
 * Cashew-style budget card: a color-gradient header for the category, the
 * amount left of the limit, a month timeline with a "Today" marker, and a
 * suggested daily spend for the days remaining.
 */
export function BudgetCard({ budget, onPress }: Props) {
  const spentRatio = Math.min(Math.max(budget.percentUsed, 0), 1);

  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const timeRatio = Math.min(dayOfMonth / totalDays, 1);
  const daysLeft = Math.max(totalDays - dayOfMonth, 0);
  const perDay = daysLeft > 0 ? Math.max(budget.remaining, 0) / daysLeft : Math.max(budget.remaining, 0);

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const base = budget.group.color;
  const top = lighten(base, 0.08);
  const bottom = darken(base, 0.28);

  return (
    <Pressable onPress={onPress ? () => onPress(budget) : undefined} className="active:opacity-90">
      <LinearGradient
        colors={[top, bottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 28, padding: 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white/20">
            <Ionicons
              name={budget.group.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color="#FFFFFF"
            />
          </View>
          <Text className="flex-1 text-lg font-bold text-white" numberOfLines={1}>
            {budget.group.name}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
        </View>

        {/* Amount left */}
        <View className="mt-4 flex-row items-baseline gap-2">
          <Text className="text-3xl font-extrabold text-white">
            {budget.isOverBudget
              ? formatCurrency(Math.abs(budget.remaining))
              : formatCurrency(budget.remaining)}
          </Text>
          <Text className="text-sm font-medium text-white/75">
            {budget.isOverBudget ? 'over' : 'left'} of {formatCurrency(budget.budgetLimit)}
          </Text>
        </View>

        {/* Timeline: spent fill + a Today marker */}
        <View className="mt-4">
          <View className="h-2.5 overflow-hidden rounded-full bg-black/25">
            <View
              className="h-full rounded-full bg-white"
              style={{ width: `${spentRatio * 100}%` }}
            />
          </View>
          {/* Today marker */}
          <View
            className="absolute -top-0.5 h-3.5 w-1 rounded-full bg-white/90"
            style={{ left: `${timeRatio * 100}%` }}
          />
          <View className="mt-1.5 flex-row justify-between">
            <Text className="text-[11px] text-white/70">{fmt(start)}</Text>
            <Text className="text-[11px] text-white/70">{fmt(end)}</Text>
          </View>
        </View>

        {/* Daily allowance */}
        <Text className="mt-3 text-xs font-medium text-white/85">
          {budget.isOverBudget
            ? 'Over budget for this month'
            : `You can spend ${formatCurrency(perDay)}/day for ${daysLeft} more day${
                daysLeft === 1 ? '' : 's'
              }`}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
