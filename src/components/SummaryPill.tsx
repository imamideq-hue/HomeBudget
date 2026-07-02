import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { formatCurrency } from '@/lib/format';

interface Props {
  income: number;
  expense: number;
}

/** Cashew-style summary strip: money out (expense), money in (income), and the
 *  net for the current view. */
export function SummaryPill({ income, expense }: Props) {
  const net = income - expense;
  return (
    <View className="flex-row items-center justify-between rounded-3xl bg-card px-5 py-4">
      <View className="items-start gap-1">
        <View className="flex-row items-center gap-1">
          <Ionicons name="caret-down" size={13} color="#FF6B6B" />
          <Text className="text-xs font-medium text-muted">Out</Text>
        </View>
        <Text className="text-base font-bold text-surface-dark">{formatCurrency(expense)}</Text>
      </View>

      <View className="h-8 w-px bg-line" />

      <View className="items-center gap-1">
        <View className="flex-row items-center gap-1">
          <Ionicons name="caret-up" size={13} color="#34C77B" />
          <Text className="text-xs font-medium text-muted">In</Text>
        </View>
        <Text className="text-base font-bold text-income">{formatCurrency(income)}</Text>
      </View>

      <View className="h-8 w-px bg-line" />

      <View className="items-end gap-1">
        <Text className="text-xs font-medium text-muted">Net</Text>
        <Text
          className={`text-base font-bold ${net >= 0 ? 'text-income' : 'text-expense'}`}
        >
          {net >= 0 ? '+' : '-'}
          {formatCurrency(Math.abs(net))}
        </Text>
      </View>
    </View>
  );
}
