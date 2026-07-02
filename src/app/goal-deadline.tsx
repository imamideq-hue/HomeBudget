import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import { formatDeadline, formatFullDate } from '@/lib/format';

function addMonths(months: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() + months);
  return d;
}

const PRESETS: { label: string; months: number }[] = [
  { label: '1 month', months: 1 },
  { label: '3 months', months: 3 },
  { label: '6 months', months: 6 },
  { label: '1 year', months: 12 },
];

export default function GoalDeadlineModal() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { getGoal, setDeadline } = useGoals();
  const { accent } = useTheme();

  const goal = goalId ? getGoal(goalId) : undefined;

  const [date, setDate] = useState<Date>(() => {
    if (goal?.targetDate) {
      const d = new Date(goal.targetDate);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return addMonths(3);
  });

  if (!goal) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <Text className="text-base text-muted">Goal not found.</Text>
      </SafeAreaView>
    );
  }

  const shift = (days: number) =>
    setDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + days);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return next < today ? today : next; // don't allow the past
    });

  const save = () => {
    setDeadline(goal.id, date.toISOString());
    router.back();
  };

  const clear = () => {
    setDeadline(goal.id, undefined);
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-center justify-between py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">Deadline</Text>
          <View className="w-14" />
        </View>

        <ScrollView contentContainerClassName="gap-6 pb-6 pt-2">
          {/* Goal identity */}
          <View className="mt-2 items-center gap-2">
            <CategoryPill icon={goal.icon} color={accent} size={56} />
            <Text className="text-xl font-bold text-surface-dark">{goal.name}</Text>
          </View>

          {/* Selected date */}
          <View className="items-center rounded-3xl bg-card py-6">
            <Text className="text-xs uppercase tracking-wide text-muted">Target date</Text>
            <Text className="mt-1 text-2xl font-bold text-surface-dark">
              {formatFullDate(date.toISOString())}
            </Text>
            <Text className="mt-1 text-sm text-primary">{formatDeadline(date.toISOString())}</Text>

            {/* Fine-tune stepper */}
            <View className="mt-4 flex-row items-center gap-3">
              <Pressable
                onPress={() => shift(-7)}
                className="rounded-xl bg-surface px-3 py-2 active:opacity-70"
              >
                <Text className="text-sm font-semibold text-surface-dark">-1w</Text>
              </Pressable>
              <Pressable
                onPress={() => shift(-1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-70"
              >
                <Ionicons name="remove" size={18} color={accent} />
              </Pressable>
              <Pressable
                onPress={() => shift(1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-70"
              >
                <Ionicons name="add" size={18} color={accent} />
              </Pressable>
              <Pressable
                onPress={() => shift(7)}
                className="rounded-xl bg-surface px-3 py-2 active:opacity-70"
              >
                <Text className="text-sm font-semibold text-surface-dark">+1w</Text>
              </Pressable>
            </View>
          </View>

          {/* Presets */}
          <View>
            <Text className="mb-2 text-sm font-semibold text-surface-dark">Quick set</Text>
            <View className="flex-row flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Pressable
                  key={p.label}
                  onPress={() => setDate(addMonths(p.months))}
                  className="rounded-full bg-card px-4 py-2 active:opacity-70"
                >
                  <Text className="text-sm font-medium text-surface-dark">{p.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky actions — always visible at the bottom */}
        <View className="gap-3 border-t border-line pb-2 pt-3">
          <Pressable
            onPress={save}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 active:opacity-80"
          >
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">Save deadline</Text>
          </Pressable>
          {goal.targetDate ? (
            <Pressable onPress={clear} className="items-center py-2 active:opacity-60">
              <Text className="text-sm font-medium text-expense">Remove deadline</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
