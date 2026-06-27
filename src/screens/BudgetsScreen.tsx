import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { formatCurrency } from '@/lib/format';

const MONTH = new Date().toLocaleDateString('en-US', { month: 'long' });

export function BudgetsScreen() {
  const { groupBudgets } = useBudgetTracker();
  const budgeted = groupBudgets.filter((b) => b.hasBudget);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-3 px-5 pb-12 pt-2">
        <Text className="text-2xl font-bold text-surface-dark">Budgets</Text>
        <Text className="mb-1 text-sm text-muted">Monthly · {MONTH}</Text>

        {budgeted.map((b) => {
          const ratio = Math.min(b.percentUsed, 1);
          return (
            <View key={b.group.id} className="rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <CategoryPill icon={b.group.icon} color={b.group.color} size={36} />
                <Text className="flex-1 text-base font-medium text-surface-dark">
                  {b.group.name}
                </Text>
                <Text className={`text-sm font-semibold ${b.isOverBudget ? 'text-expense' : 'text-muted'}`}>
                  {formatCurrency(b.totalSpent)} / {formatCurrency(b.budgetLimit)}
                </Text>
              </View>

              <View className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${ratio * 100}%`,
                    backgroundColor: b.isOverBudget ? '#FF6B6B' : b.group.color,
                  }}
                />
              </View>

              <Text
                className={`mt-2 text-xs ${b.isOverBudget ? 'text-expense' : 'text-muted'}`}
              >
                {b.isOverBudget
                  ? `${formatCurrency(Math.abs(b.remaining))} over budget`
                  : `${formatCurrency(b.remaining)} remaining`}
              </Text>
            </View>
          );
        })}

        {budgeted.length === 0 ? (
          <Text className="text-sm text-muted">No budgets set yet.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
