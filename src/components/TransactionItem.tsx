import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { CategoryPill } from '@/components/CategoryPill';
import { useCategories } from '@/hooks/useCategories';
import { formatSigned } from '@/lib/format';
import type { Transaction } from '@/models';

interface Props {
  transaction: Transaction;
  onPress?: (t: Transaction) => void;
}

/** A clean list row (matching the accounts list): tinted icon, title +
 *  category, the signed amount and a chevron. */
export function TransactionItem({ transaction, onPress }: Props) {
  const { resolveSubVisual, getGroupForSub } = useCategories();
  const visual = resolveSubVisual(transaction.subCategoryId);
  const group = getGroupForSub(transaction.subCategoryId);
  const isIncome = transaction.type === 'income';

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3.5 active:opacity-70"
    >
      <CategoryPill icon={visual.icon} color={visual.color} size={44} />

      <View className="flex-1">
        <Text className="text-base font-semibold text-surface-dark" numberOfLines={1}>
          {transaction.note ?? visual.name}
        </Text>
        <Text className="text-sm text-muted" numberOfLines={1}>
          {group.name}
        </Text>
      </View>

      <Text className={`text-base font-bold ${isIncome ? 'text-income' : 'text-surface-dark'}`}>
        {formatSigned(transaction)}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
    </Pressable>
  );
}
