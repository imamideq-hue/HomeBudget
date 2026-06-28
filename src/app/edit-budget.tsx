import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { formatCurrency, getCurrency } from '@/lib/format';

export default function EditBudgetModal() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { getGroupBudget, setBudgetLimit } = useBudgetTracker();

  const budget = groupId ? getGroupBudget(groupId) : undefined;

  const [limit, setLimit] = useState(
    budget?.budgetLimit ? String(budget.budgetLimit) : '',
  );

  const parsedLimit = useMemo(() => {
    const n = parseFloat(limit.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [limit]);

  if (!budget) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-muted">Budget not found.</Text>
      </SafeAreaView>
    );
  }

  const save = () => {
    setBudgetLimit(budget.group.id, parsedLimit);
    router.back();
  };

  const remove = () => {
    setBudgetLimit(budget.group.id, 0);
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
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
              {formatCurrency(budget.totalSpent)} spent this month
            </Text>
          </View>

          {/* Limit input */}
          <View className="mt-8 items-center">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              Monthly limit ({getCurrency()})
            </Text>
            <TextInput
              value={limit}
              onChangeText={setLimit}
              placeholder="0.00"
              placeholderTextColor="#C4C4D0"
              keyboardType="decimal-pad"
              autoFocus
              className="text-center text-5xl font-bold text-surface-dark"
            />
            {parsedLimit > 0 ? (
              <Text className="mt-2 text-sm text-muted">
                {formatCurrency(Math.max(parsedLimit - budget.totalSpent, 0))} would remain
              </Text>
            ) : null}
          </View>

          {/* Actions */}
          <View className="mt-auto gap-3 pb-2">
            <Pressable
              onPress={save}
              disabled={parsedLimit <= 0}
              className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
                parsedLimit > 0 ? 'bg-primary active:opacity-80' : 'bg-primary/40'
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
