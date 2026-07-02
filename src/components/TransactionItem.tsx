import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/format';
import type { Transaction } from '@/models';

interface Props {
  transaction: Transaction;
  onPress?: (t: Transaction) => void;
}

export function TransactionItem({ transaction, onPress }: Props) {
  const { resolveSubVisual, getGroupForSub } = useCategories();
  const visual = resolveSubVisual(transaction.subCategoryId);
  const group = getGroupForSub(transaction.subCategoryId);
  const isIncome = transaction.type === 'income';

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center gap-3 bg-surface px-4 py-3 active:opacity-70"
    >
      {/* Plain icon (no box), settings-style */}
      <View className="w-10 items-center justify-center">
        <Ionicons
          name={visual.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color={visual.color}
        />
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-surface-dark" numberOfLines={1}>
          {transaction.note ?? visual.name}
        </Text>
        {/* Small category chip below the title (Cashew style) */}
        <View className="mt-1 flex-row">
          <View className="flex-row items-center gap-1 rounded-full bg-card px-2.5 py-1">
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: visual.color }}
            />
            <Text className="text-xs font-medium text-muted" numberOfLines={1}>
              {group.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount with a ▼ (expense) / ▲ (income) direction triangle */}
      <View className="flex-row items-center gap-1">
        <Ionicons
          name={isIncome ? 'caret-up' : 'caret-down'}
          size={14}
          color={isIncome ? '#34C77B' : '#FF6B6B'}
        />
        <Text
          className={`text-base font-bold ${isIncome ? 'text-income' : 'text-surface-dark'}`}
        >
          {formatCurrency(Math.abs(transaction.amount))}
        </Text>
      </View>
    </Pressable>
  );
}
