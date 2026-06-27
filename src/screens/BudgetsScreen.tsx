import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { getCategory } from '@/lib/categories';
import { formatCurrency } from '@/lib/format';

export function BudgetsScreen() {
  const { budgets, spendByCategory } = useBudget();

  const spendFor = (categoryId: string) =>
    spendByCategory.find((s) => s.categoryId === categoryId)?.total ?? 0;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-3 px-5 pb-12 pt-2">
        <Text className="mb-1 text-2xl font-bold text-surface-dark">Budgets</Text>

        {budgets.map((b) => {
          const category = getCategory(b.categoryId);
          const spent = spendFor(b.categoryId);
          const ratio = b.limit > 0 ? Math.min(spent / b.limit, 1) : 0;
          const over = spent > b.limit;

          return (
            <View key={b.categoryId} className="rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <CategoryPill category={category} size={36} />
                <Text className="flex-1 text-base font-medium text-surface-dark">
                  {category.name}
                </Text>
                <Text className={`text-sm font-semibold ${over ? 'text-expense' : 'text-muted'}`}>
                  {formatCurrency(spent)} / {formatCurrency(b.limit)}
                </Text>
              </View>

              <View className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${ratio * 100}%`,
                    backgroundColor: over ? '#FF6B6B' : category.color,
                  }}
                />
              </View>
            </View>
          );
        })}

        {budgets.length === 0 ? (
          <Text className="text-sm text-muted">No budgets set yet.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
