import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { formatCurrency } from '@/lib/format';
import type { Account } from '@/models';

/** Compact account tile with its current (live) balance. */
export function AccountCard({ account, balance }: { account: Account; balance: number }) {
  return (
    <View className="w-40 rounded-2xl bg-card p-4">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${account.color}22` }}
      >
        <Ionicons
          name={account.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={account.color}
        />
      </View>
      <Text className="mt-3 text-sm text-muted" numberOfLines={1}>
        {account.name}
      </Text>
      <Text className="mt-0.5 text-lg font-bold text-surface-dark">
        {formatCurrency(balance)}
      </Text>
      <Text className="text-xs capitalize text-muted">{account.type}</Text>
    </View>
  );
}
