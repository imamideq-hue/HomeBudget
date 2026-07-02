import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { useCategories } from '@/hooks/useCategories';
import { feedbackSuccess } from '@/lib/feedback';
import { formatCurrency, getCurrency } from '@/lib/format';

export default function EditBudgetModal() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { getGroupBudget, setBudgetLimit } = useBudgetTracker();
  const { transactions } = useBudget();
  const { getGroupForSub } = useCategories();

  const budget = groupId ? getGroupBudget(groupId) : undefined;

  const [mode, setMode] = useState<'set' | 'add'>('set');
  const [value, setValue] = useState(budget?.budgetLimit ? String(budget.budgetLimit) : '');

  const parsed = useMemo(() => {
    const n = parseFloat(value.replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [value]);

  // Transactions that count toward this budget (this category, this view).
  const history = useMemo(() => {
    if (!groupId) return [];
    return transactions
      .filter((t) => t.type === 'expense' && getGroupForSub(t.subCategoryId).id === groupId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, groupId, getGroupForSub]);

  const current = budget?.budgetLimit ?? 0;
  const projected = mode === 'set' ? parsed : current + parsed;
  const valid =
    mode === 'set'
      ? Number.isFinite(parsed) && parsed > 0
      : Number.isFinite(parsed) && parsed !== 0 && projected > 0;

  if (!budget) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <Text className="text-base text-muted">Budget not found.</Text>
      </SafeAreaView>
    );
  }

  const save = () => {
    if (!valid) return;
    setBudgetLimit(budget.group.id, projected > 0 ? projected : 0);
    feedbackSuccess();
    router.back();
  };

  const remove = () => {
    setBudgetLimit(budget.group.id, 0);
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">Edit budget</Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-6 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Group identity */}
          <View className="items-center gap-2">
            <CategoryPill icon={budget.group.icon} color={budget.group.color} size={64} />
            <Text className="text-xl font-bold text-surface-dark">{budget.group.name}</Text>
            <Text className="text-sm text-muted">
              {budget.hasBudget
                ? `Limit ${formatCurrency(current)} · ${formatCurrency(budget.totalSpent)} spent`
                : `${formatCurrency(budget.totalSpent)} spent this month`}
            </Text>
          </View>

          {/* Mode toggle: set an absolute limit, or add / take away */}
          <View className="flex-row rounded-2xl bg-card p-1">
            {(
              [
                { key: 'set', label: 'Set limit' },
                { key: 'add', label: 'Add / take away' },
              ] as const
            ).map((opt) => {
              const active = mode === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    setMode(opt.key);
                    setValue('');
                  }}
                  className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-surface shadow-sm' : ''}`}
                >
                  <Text className={`text-sm font-semibold ${active ? 'text-primary' : 'text-muted'}`}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Amount input */}
          <View className="items-center">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              {mode === 'set' ? `Monthly limit (${getCurrency()})` : `Amount (${getCurrency()})`}
            </Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={mode === 'set' ? '0.00' : '+/- 0.00'}
              placeholderTextColor="#C4C4D0"
              keyboardType="numbers-and-punctuation"
              className="text-center text-5xl font-bold text-surface-dark"
            />
            {valid ? (
              <Text className="mt-2 text-sm text-muted">New limit {formatCurrency(projected)}</Text>
            ) : (
              <Text className="mt-2 text-sm text-muted">
                {mode === 'add' ? 'Use a negative amount to take away' : ' '}
              </Text>
            )}
          </View>

          {/* History for this category */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-surface-dark">History</Text>
            {history.length > 0 ? (
              history.map((t) => (
                <TransactionItem
                  key={t.id}
                  transaction={t}
                  onPress={(tx) =>
                    router.push({ pathname: '/add-transaction', params: { transactionId: tx.id } })
                  }
                />
              ))
            ) : (
              <Text className="text-sm text-muted">No spending in this category yet.</Text>
            )}
          </View>
        </ScrollView>

        {/* Sticky actions */}
        <View className="border-t border-line bg-surface px-5 pb-2 pt-3">
          <Pressable
            onPress={save}
            disabled={!valid}
            className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
              valid ? 'bg-primary active:opacity-80' : 'bg-primary/40'
            }`}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">Save budget</Text>
          </Pressable>
          {budget.hasBudget ? (
            <Pressable onPress={remove} className="items-center py-3 active:opacity-60">
              <Text className="text-sm font-medium text-expense">Remove budget</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
