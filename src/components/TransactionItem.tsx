import { Pressable, Text, View } from 'react-native';

import { CategoryPill } from '@/components/CategoryPill';
import { getCategory } from '@/lib/categories';
import { formatSigned } from '@/lib/format';
import type { Transaction } from '@/lib/types';

interface Props {
  transaction: Transaction;
  onPress?: (t: Transaction) => void;
}

export function TransactionItem({ transaction, onPress }: Props) {
  const category = getCategory(transaction.categoryId);
  const isIncome = transaction.type === 'income';

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center gap-3 px-4 py-3 active:opacity-70"
    >
      <CategoryPill category={category} />

      <View className="flex-1">
        <Text className="text-base font-medium text-surface-dark">{category.name}</Text>
        {transaction.note ? (
          <Text className="text-sm text-muted" numberOfLines={1}>
            {transaction.note}
          </Text>
        ) : null}
      </View>

      <Text className={`text-base font-semibold ${isIncome ? 'text-income' : 'text-surface-dark'}`}>
        {formatSigned(transaction)}
      </Text>
    </Pressable>
  );
}
