import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { formatCurrency } from '@/lib/format';

export function BudgetsScreen() {
  const { groupCategories, spendByGroup } = useBudget();

  const spentFor = (groupId: string) =>
    spendByGroup.find((s) => s.group.id === groupId)?.total ?? 0;

  const budgeted = groupCategories.filter((g) => g.budgetLimit && g.budgetLimit > 0);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-3 px-5 pb-12 pt-2">
        <Text className="mb-1 text-2xl font-bold text-surface-dark">Budgets</Text>

        {budgeted.map((group) => {
          const limit = group.budgetLimit ?? 0;
          const spent = spentFor(group.id);
          const ratio = limit > 0 ? Math.min(spent / limit, 1) : 0;
          const over = spent > limit;

          return (
            <View key={group.id} className="rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <CategoryPill icon={group.icon} color={group.color} size={36} />
                <Text className="flex-1 text-base font-medium text-surface-dark">
                  {group.name}
                </Text>
                <Text className={`text-sm font-semibold ${over ? 'text-expense' : 'text-muted'}`}>
                  {formatCurrency(spent)} / {formatCurrency(limit)}
                </Text>
              </View>

              <View className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${ratio * 100}%`,
                    backgroundColor: over ? '#FF6B6B' : group.color,
                  }}
                />
              </View>
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
