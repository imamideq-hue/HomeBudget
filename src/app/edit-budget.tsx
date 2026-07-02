import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { feedbackSuccess } from '@/lib/feedback';
import { formatCurrency, getCurrency } from '@/lib/format';

export default function EditBudgetModal() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { getGroupBudget, setBudgetLimit } = useBudgetTracker();

  const budget = groupId ? getGroupBudget(groupId) : undefined;

  const [mode, setMode] = useState<'set' | 'add'>('set');
  const [value, setValue] = useState(budget?.budgetLimit ? String(budget.budgetLimit) : '');

  const parsed = useMemo(() => {
    const n = parseFloat(value.replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [value]);

  const current = budget?.budgetLimit ?? 0;
  const projected = mode === 'set' ? parsed : current + parsed;
  const valid =
    mode === 'set' ? Number.isFinite(parsed) && parsed > 0 : Number.isFinite(parsed) && parsed !== 0 && projected > 0;

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 px-5">
          {/* Header */}
          <View className="flex-row items-center justify-between py-3">
            <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
              <Text className="text-base text-muted">Cancel</Text>
            </Pressable>
            <Text className="text-base font-semibold text-surface-dark">Edit budget</Text>
            <View className="w-14" />
          </View>

          {/* Group identity */}
          <View className="mt-4 items-center gap-2">
            <CategoryPill icon={budget.group.icon} color={budget.group.color} size={64} />
            <Text className="text-xl font-bold text-surface-dark">{budget.group.name}</Text>
            <Text className="text-sm text-muted">
              {budget.hasBudget
                ? `Limit ${formatCurrency(current)} · ${formatCurrency(budget.totalSpent)} spent`
                : `${formatCurrency(budget.totalSpent)} spent this month`}
            </Text>
          </View>

          {/* Mode toggle: set an absolute limit, or add / take away */}
          <View className="mt-6 flex-row rounded-2xl bg-card p-1">
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
          <View className="mt-6 items-center">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              {mode === 'set' ? `Monthly limit (${getCurrency()})` : `Amount (${getCurrency()})`}
            </Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={mode === 'set' ? '0.00' : '+/- 0.00'}
              placeholderTextColor="#C4C4D0"
              keyboardType="numbers-and-punctuation"
              autoFocus
              className="text-center text-5xl font-bold text-surface-dark"
            />
            {valid ? (
              <Text className="mt-2 text-sm text-muted">
                New limit {formatCurrency(projected)}
              </Text>
            ) : (
              <Text className="mt-2 text-sm text-muted">
                {mode === 'add' ? 'Use a negative amount to take away' : ' '}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View className="mt-auto gap-3 pb-2">
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
              <Pressable onPress={remove} className="items-center py-2 active:opacity-60">
                <Text className="text-sm font-medium text-expense">Remove budget</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
