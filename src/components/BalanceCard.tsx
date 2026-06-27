import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { formatCurrency } from '@/lib/format';

interface Props {
  balance: number;
  income: number;
  expense: number;
}

/** Cashew-style hero card showing the running balance for the period. */
export function BalanceCard({ balance, income, expense }: Props) {
  return (
    <LinearGradient
      colors={['#7C5CFC', '#5B3FD9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, padding: 24 }}
    >
      <Text className="text-sm font-medium text-white/70">Total balance</Text>
      <Text className="mt-1 text-4xl font-bold text-white">{formatCurrency(balance)}</Text>

      <View className="mt-5 flex-row gap-4">
        <View className="flex-1 rounded-2xl bg-white/15 px-4 py-3">
          <Text className="text-xs text-white/70">Income</Text>
          <Text className="mt-0.5 text-lg font-semibold text-white">
            {formatCurrency(income)}
          </Text>
        </View>
        <View className="flex-1 rounded-2xl bg-white/15 px-4 py-3">
          <Text className="text-xs text-white/70">Expenses</Text>
          <Text className="mt-0.5 text-lg font-semibold text-white">
            {formatCurrency(expense)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
