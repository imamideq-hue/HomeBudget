import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';

import { AddTransactionButton } from '@/components/AddTransactionButton';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { formatCurrency } from '@/lib/format';

export function OverviewScreen() {
  const { totals, spendByGroup, transactions } = useBudget();

  const pieData = spendByGroup.map((s) => ({
    value: s.total,
    color: s.group.color,
  }));

  const recent = transactions.slice(0, 4);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-12 pt-2">
        <Text className="text-2xl font-bold text-surface-dark">Overview</Text>

        <BalanceCard
          balance={totals.balance}
          income={totals.income}
          expense={totals.expense}
        />

        <View className="rounded-3xl bg-card p-5">
          <Text className="mb-4 text-lg font-semibold text-surface-dark">Spending by category</Text>
          {pieData.length > 0 ? (
            <View className="items-center">
              <PieChart
                data={pieData}
                donut
                radius={90}
                innerRadius={58}
                centerLabelComponent={() => (
                  <View className="items-center">
                    <Text className="text-xs text-muted">Spent</Text>
                    <Text className="text-lg font-bold text-surface-dark">
                      {formatCurrency(totals.expense)}
                    </Text>
                  </View>
                )}
              />
              <View className="mt-5 w-full gap-2">
                {spendByGroup.map((s) => (
                  <View key={s.group.id} className="flex-row items-center gap-2">
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: s.group.color }}
                    />
                    <Text className="flex-1 text-sm text-surface-dark">{s.group.name}</Text>
                    <Text className="text-sm font-medium text-muted">
                      {formatCurrency(s.total)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text className="text-sm text-muted">No spending recorded yet.</Text>
          )}
        </View>

        <View>
          <Text className="mb-1 text-lg font-semibold text-surface-dark">Recent activity</Text>
          {recent.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </View>
      </ScrollView>
      <AddTransactionButton />
    </SafeAreaView>
  );
}
