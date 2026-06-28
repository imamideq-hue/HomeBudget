import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useGoals } from '@/hooks/useGoals';
import { formatCurrency, getCurrency } from '@/lib/format';

export default function ContributeGoalModal() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { getGoal, progressFor, contribute } = useGoals();

  const goal = goalId ? getGoal(goalId) : undefined;
  const [amount, setAmount] = useState('');

  const parsed = useMemo(() => {
    const n = parseFloat(amount.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [amount]);

  if (!goal) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-muted">Goal not found.</Text>
      </SafeAreaView>
    );
  }

  const { remaining } = progressFor(goal);
  const projected = Math.min(goal.currentAmount + parsed, goal.targetAmount);

  const save = () => {
    contribute(goal.id, parsed);
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
            <Text className="text-base font-semibold text-surface-dark">Contribute</Text>
            <View className="w-14" />
          </View>

          {/* Goal identity */}
          <View className="mt-4 items-center gap-2">
            <CategoryPill icon={goal.icon} color={goal.color} size={64} />
            <Text className="text-xl font-bold text-surface-dark">{goal.name}</Text>
            <Text className="text-sm text-muted">
              {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} ·{' '}
              {formatCurrency(remaining)} to go
            </Text>
          </View>

          {/* Amount */}
          <View className="mt-8 items-center">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              Add amount ({getCurrency()})
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#C4C4D0"
              keyboardType="decimal-pad"
              autoFocus
              className="text-center text-5xl font-bold text-surface-dark"
            />
            {parsed > 0 ? (
              <Text className="mt-2 text-sm text-muted">
                New total {formatCurrency(projected)}
              </Text>
            ) : null}
          </View>

          {/* Save */}
          <View className="mt-auto pb-2">
            <Pressable
              onPress={save}
              disabled={parsed <= 0}
              className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
                parsed > 0 ? 'bg-primary active:opacity-80' : 'bg-primary/40'
              }`}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text className="text-base font-semibold text-white">Add contribution</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
