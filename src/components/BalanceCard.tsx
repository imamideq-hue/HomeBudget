import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { darken } from '@/lib/theme';
import { formatCurrency } from '@/lib/format';

interface Props {
  balance: number;
  income: number;
  expense: number;
}

/** Cashew-style hero card: a soft accent panel with the running balance and
 *  income/expense split marked with directional arrows. */
export function BalanceCard({ balance, income, expense }: Props) {
  const { accent } = useTheme();
  // A gentle, restrained gradient (Cashew leans soft rather than high-contrast).
  const top = darken(accent, 0.04);
  const bottom = darken(accent, 0.24);

  return (
    <LinearGradient
      colors={[top, bottom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 32, padding: 28 }}
    >
      <Text className="text-base font-medium text-white/75">Total balance</Text>
      <Text className="mt-1.5 text-5xl font-extrabold text-white">{formatCurrency(balance)}</Text>

      <View className="mt-7 flex-row gap-4">
        <View className="flex-1 rounded-3xl bg-white/15 px-5 py-4">
          <View className="flex-row items-center gap-1.5">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-white/25">
              <Ionicons name="arrow-down" size={14} color="#FFFFFF" />
            </View>
            <Text className="text-sm text-white/80">Income</Text>
          </View>
          <Text className="mt-1.5 text-xl font-bold text-white">{formatCurrency(income)}</Text>
        </View>
        <View className="flex-1 rounded-3xl bg-white/15 px-5 py-4">
          <View className="flex-row items-center gap-1.5">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-white/25">
              <Ionicons name="arrow-up" size={14} color="#FFFFFF" />
            </View>
            <Text className="text-sm text-white/80">Expenses</Text>
          </View>
          <Text className="mt-1.5 text-xl font-bold text-white">{formatCurrency(expense)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
