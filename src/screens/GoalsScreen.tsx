import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { PressableScale } from '@/components/motion';
import { ScopeFilter } from '@/components/ScopeFilter';
import { useBudget } from '@/hooks/useBudget';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import { daysUntil, formatCurrency, formatDeadline } from '@/lib/format';

export function GoalsScreen() {
  const router = useRouter();
  const { progress } = useGoals();
  const { users, currentUser } = useBudget();
  const { accent } = useTheme();

  const ownerLabel = (ownerId?: string) => {
    if (!ownerId) return 'Joint';
    if (ownerId === currentUser?.id) return 'You';
    return users.find((u) => u.id === ownerId)?.name ?? 'Personal';
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-12 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-surface-dark">Goals</Text>
          <PressableScale
            onPress={() => router.push('/add-goal')}
            hitSlop={8}
            className="flex-row items-center gap-1 rounded-full bg-primary px-3 py-2"
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">New</Text>
          </PressableScale>
        </View>

        <ScopeFilter users={users} currentUserId={currentUser?.id ?? ''} />

        {progress.map(({ goal, ratio, remaining, isReached }) => (
          <View key={goal.id} className="rounded-3xl bg-card p-5">
            {/* Tap the goal to edit (or delete) it */}
            <PressableScale
              scaleTo={0.98}
              onPress={() => router.push({ pathname: '/add-goal', params: { goalId: goal.id } })}
              className="flex-row items-center gap-3"
            >
              <CategoryPill icon={goal.icon} color={accent} size={44} />
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-semibold text-surface-dark">{goal.name}</Text>
                  <View className="flex-row items-center gap-1 rounded-full bg-black/5 px-2 py-0.5">
                    <Ionicons
                      name={goal.ownerId ? 'person' : 'people'}
                      size={11}
                      color="#8A8A9E"
                    />
                    <Text className="text-[11px] font-medium text-muted">
                      {ownerLabel(goal.ownerId)}
                    </Text>
                  </View>
                </View>
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
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-semibold text-muted">
                    {Math.round(ratio * 100)}%
                  </Text>
                  <Ionicons name="pencil" size={13} color="#8A8A9E" />
                </View>
              )}
            </PressableScale>

            <View className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
              <View
                className="h-full rounded-full"
                style={{ width: `${ratio * 100}%`, backgroundColor: accent }}
              />
            </View>

            {/* Deadline — prominent pill */}
            {(() => {
              const overdue = goal.targetDate ? daysUntil(goal.targetDate) < 0 : false;
              return (
                <Pressable
                  onPress={() =>
                    router.push({ pathname: '/goal-deadline', params: { goalId: goal.id } })
                  }
                  className={`mt-4 flex-row items-center gap-2 self-start rounded-full border px-4 py-2 active:opacity-70 ${
                    overdue
                      ? 'border-expense/40 bg-expense/10'
                      : goal.targetDate
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-primary/40 bg-primary/5'
                  }`}
                >
                  <Ionicons
                    name={goal.targetDate ? 'calendar' : 'calendar-outline'}
                    size={16}
                    color={overdue ? '#FF6B6B' : accent}
                  />
                  <Text
                    className={`text-sm font-semibold ${
                      overdue ? 'text-expense' : 'text-primary'
                    }`}
                  >
                    {goal.targetDate ? formatDeadline(goal.targetDate) : 'Set a deadline'}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color={overdue ? '#FF6B6B' : accent}
                  />
                </Pressable>
              );
            })()}

            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-sm text-muted">
                {isReached ? 'Goal complete 🎉' : `${formatCurrency(remaining)} to go`}
              </Text>
              <PressableScale
                onPress={() =>
                  router.push({ pathname: '/contribute-goal', params: { goalId: goal.id } })
                }
                className="flex-row items-center gap-1 rounded-full bg-primary px-4 py-2"
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text className="text-sm font-semibold text-white">Contribute</Text>
              </PressableScale>
            </View>
          </View>
        ))}

        {progress.length === 0 ? (
          <View className="items-center gap-3 pt-16">
            <Ionicons name="flag-outline" size={40} color="#C4C4D0" />
            <Text className="text-base text-muted">No goals yet</Text>
            <PressableScale
              onPress={() => router.push('/add-goal')}
              className="flex-row items-center gap-1 rounded-full bg-primary px-4 py-2"
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text className="text-sm font-semibold text-white">Create a goal</Text>
            </PressableScale>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
