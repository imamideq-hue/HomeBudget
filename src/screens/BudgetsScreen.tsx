import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetProgressRow } from '@/components/BudgetProgressRow';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';

const MONTH = new Date().toLocaleDateString('en-US', { month: 'long' });

export function BudgetsScreen() {
  const { groupBudgets } = useBudgetTracker();
  const budgeted = groupBudgets.filter((b) => b.hasBudget);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-3 px-5 pb-12 pt-2">
        <Text className="text-2xl font-bold text-surface-dark">Budgets</Text>
        <Text className="mb-1 text-sm text-muted">Monthly · {MONTH}</Text>

        {budgeted.map((budget) => (
          <BudgetProgressRow key={budget.group.id} budget={budget} />
        ))}

        {budgeted.length === 0 ? (
          <Text className="text-sm text-muted">No budgets set yet.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
