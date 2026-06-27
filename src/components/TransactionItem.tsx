import { Pressable, Text, View } from 'react-native';

import { CategoryPill } from '@/components/CategoryPill';
import { getGroupForSub, resolveSubVisual } from '@/lib/categories';
import { formatSigned } from '@/lib/format';
import type { Transaction } from '@/models';

interface Props {
  transaction: Transaction;
  onPress?: (t: Transaction) => void;
}

export function TransactionItem({ transaction, onPress }: Props) {
  const visual = resolveSubVisual(transaction.subCategoryId);
  const group = getGroupForSub(transaction.subCategoryId);
  const isIncome = transaction.type === 'income';
  const subtitle = transaction.note ?? group.name;

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center gap-3 bg-white px-4 py-3 active:opacity-70"
    >
      <CategoryPill icon={visual.icon} color={visual.color} />

      <View className="flex-1">
        <Text className="text-base font-medium text-surface-dark">{visual.name}</Text>
        <Text className="text-sm text-muted" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <Text className={`text-base font-semibold ${isIncome ? 'text-income' : 'text-surface-dark'}`}>
        {formatSigned(transaction)}
      </Text>
    </Pressable>
  );
}
