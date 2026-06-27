import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetProgressRow } from '@/components/BudgetProgressRow';
import { CategoryPill } from '@/components/CategoryPill';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';

const MONTH = new Date().toLocaleDateString('en-US', { month: 'long' });

export function BudgetsScreen() {
  const router = useRouter();
  const { groupBudgets } = useBudgetTracker();

  const expense = groupBudgets.filter((b) => b.group.kind === 'expense');
  const budgeted = expense.filter((b) => b.hasBudget);
  const unbudgeted = expense.filter((b) => !b.hasBudget);

  const edit = (groupId: string) =>
    router.push({ pathname: '/edit-budget', params: { groupId } });

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-3 px-5 pb-12 pt-2">
        <Text className="text-2xl font-bold text-surface-dark">Budgets</Text>
        <Text className="mb-1 text-sm text-muted">Monthly · {MONTH} · tap to edit</Text>

        {budgeted.map((budget) => (
          <BudgetProgressRow
            key={budget.group.id}
            budget={budget}
            onPress={() => edit(budget.group.id)}
          />
        ))}

        {unbudgeted.length > 0 ? (
          <Text className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
            No budget yet
          </Text>
        ) : null}

        {unbudgeted.map((budget) => (
          <Pressable
            key={budget.group.id}
            onPress={() => edit(budget.group.id)}
            className="flex-row items-center gap-3 rounded-2xl bg-card p-4 active:opacity-70"
          >
            <CategoryPill icon={budget.group.icon} color={budget.group.color} size={36} />
            <Text className="flex-1 text-base font-medium text-surface-dark">
              {budget.group.name}
            </Text>
            <Text className="text-sm font-medium text-primary">Set budget</Text>
            <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
