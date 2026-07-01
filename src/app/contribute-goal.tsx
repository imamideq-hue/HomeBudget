import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import { feedbackSuccess } from '@/lib/feedback';
import { formatCurrency, formatFullDate, getCurrency } from '@/lib/format';

export default function ContributeGoalModal() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { getGoal, progressFor, contribute, contributionsFor } = useGoals();
  const { users, currentUser } = useBudget();
  const { accent } = useTheme();

  const goal = goalId ? getGoal(goalId) : undefined;
  const [amount, setAmount] = useState('');
  const [fromId, setFromId] = useState<string | undefined>(currentUser?.id);

  const parsed = useMemo(() => {
    const n = parseFloat(amount.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [amount]);

  const history = goal ? contributionsFor(goal.id) : [];
  const nameOf = (userId: string) =>
    userId === currentUser?.id ? 'You' : users.find((u) => u.id === userId)?.name ?? 'Someone';

  if (!goal) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <Text className="text-base text-muted">Goal not found.</Text>
      </SafeAreaView>
    );
  }

  const { remaining } = progressFor(goal);
  const projected = Math.min(goal.currentAmount + parsed, goal.targetAmount);

  const save = () => {
    const reachedNow =
      goal.currentAmount < goal.targetAmount && goal.currentAmount + parsed >= goal.targetAmount;
    contribute(goal.id, parsed, fromId);
    if (reachedNow) {
      router.replace({
        pathname: '/celebrate',
        params: { title: 'Goal reached! 🎉', subtitle: `You hit your "${goal.name}" goal.` },
      });
    } else {
      feedbackSuccess();
      router.back();
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">Contribute</Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="px-5 pb-4"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Goal identity */}
          <View className="mt-2 items-center gap-2">
            <CategoryPill icon={goal.icon} color={accent} size={64} />
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

          {/* From: who is contributing */}
          <View className="mt-8">
            <Text className="mb-2 text-sm font-semibold text-surface-dark">From</Text>
            <View className="flex-row flex-wrap gap-2">
              {users.map((u) => {
                const selected = fromId === u.id;
                return (
                  <Pressable
                    key={u.id}
                    onPress={() => setFromId(u.id)}
                    className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                      selected ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
                    }`}
                  >
                    <View
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: u.color }}
                    />
                    <Text
                      className={`text-sm ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                    >
                      {u.id === currentUser?.id ? 'You' : u.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* History: who added how much, and when */}
          {history.length > 0 ? (
            <View className="mt-8">
              <Text className="mb-2 text-sm font-semibold text-surface-dark">History</Text>
              <View className="gap-1">
                {history.map((c) => (
                  <View
                    key={c.id}
                    className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-3"
                  >
                    <View>
                      <Text className="text-sm font-medium text-surface-dark">
                        {nameOf(c.userId)}
                      </Text>
                      <Text className="text-xs text-muted">{formatFullDate(c.createdAt)}</Text>
                    </View>
                    <Text className="text-sm font-semibold text-income">
                      +{formatCurrency(c.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Sticky action button — always visible at the bottom */}
        <View className="border-t border-line bg-surface px-5 pb-2 pt-3">
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
    </SafeAreaView>
  );
}
