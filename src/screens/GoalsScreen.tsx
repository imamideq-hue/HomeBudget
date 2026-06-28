import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useGoals } from '@/hooks/useGoals';
import { daysUntil, formatCurrency, formatDeadline } from '@/lib/format';

export function GoalsScreen() {
  const router = useRouter();
  const { progress } = useGoals();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-12 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-surface-dark">Goals</Text>
          <Pressable
            onPress={() => router.push('/add-goal')}
            hitSlop={8}
            className="flex-row items-center gap-1 rounded-full bg-primary px-3 py-2 active:opacity-80"
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">New</Text>
          </Pressable>
        </View>

        {progress.map(({ goal, ratio, remaining, isReached }) => (
          <View key={goal.id} className="rounded-3xl bg-card p-5">
            <View className="flex-row items-center gap-3">
              <CategoryPill icon={goal.icon} color={goal.color} size={44} />
              <View className="flex-1">
                <Text className="text-base font-semibold text-surface-dark">{goal.name}</Text>
                <Text className="text-sm text-muted">
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                </Text>
              </View>
              {isReached ? (
                <View className="flex-row items-center gap-1 rounded-full bg-income/15 px-3 py-1">
                  <Ionicons name="checkmark-circle" size={14} color="#34C77B" />
                  <Text className="text-xs font-semibold text-income">Reached</Text>
                </View>
              ) : (
                <Text className="text-sm font-semibold text-muted">
                  {Math.round(ratio * 100)}%
                </Text>
              )}
            </View>

            <View className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
              <View
                className="h-full rounded-full"
                style={{ width: `${ratio * 100}%`, backgroundColor: goal.color }}
              />
            </View>

            {/* Deadline (optional) */}
            <Pressable
              onPress={() =>
                router.push({ pathname: '/goal-deadline', params: { goalId: goal.id } })
              }
              className="mt-3 flex-row items-center gap-2 active:opacity-60"
            >
              <Ionicons
                name={goal.targetDate ? 'calendar' : 'calendar-outline'}
                size={15}
                color={goal.targetDate && daysUntil(goal.targetDate) < 0 ? '#FF6B6B' : '#8A8A9E'}
              />
              <Text
                className={`text-sm ${
                  goal.targetDate && daysUntil(goal.targetDate) < 0
                    ? 'text-expense'
                    : 'text-muted'
                }`}
              >
                {goal.targetDate ? formatDeadline(goal.targetDate) : 'Set a deadline'}
              </Text>
            </Pressable>

            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-sm text-muted">
                {isReached ? 'Goal complete 🎉' : `${formatCurrency(remaining)} to go`}
              </Text>
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/contribute-goal', params: { goalId: goal.id } })
                }
                className="flex-row items-center gap-1 rounded-full bg-primary px-4 py-2 active:opacity-80"
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text className="text-sm font-semibold text-white">Contribute</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {progress.length === 0 ? (
          <View className="items-center gap-3 pt-16">
            <Ionicons name="flag-outline" size={40} color="#C4C4D0" />
            <Text className="text-base text-muted">No goals yet</Text>
            <Pressable
              onPress={() => router.push('/add-goal')}
              className="flex-row items-center gap-1 rounded-full bg-primary px-4 py-2 active:opacity-80"
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text className="text-sm font-semibold text-white">Create a goal</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
