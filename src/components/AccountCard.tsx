import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/models';

interface Props {
  account: Account;
  balance: number;
  onPress?: () => void;
}

/** Compact account tile with its current (live) balance. */
export function AccountCard({ account, balance, onPress }: Props) {
  const { accent } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="w-40 items-center rounded-2xl bg-card p-4 active:opacity-70"
    >
      <View className="h-12 w-12 items-center justify-center">
        <Ionicons
          name={account.icon as keyof typeof Ionicons.glyphMap}
          size={30}
          color={accent}
        />
      </View>
      <Text className="mt-3 text-sm text-muted" numberOfLines={1}>
        {account.name}
      </Text>
      <Text className="mt-0.5 text-lg font-bold text-surface-dark">
        {formatCurrency(balance)}
      </Text>
      <Text className="text-xs capitalize text-muted">{account.type}</Text>
    </Pressable>
  );
}
