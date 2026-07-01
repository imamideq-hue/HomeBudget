import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountCard } from '@/components/AccountCard';
import { AddTransactionButton } from '@/components/AddTransactionButton';
import { BalanceCard } from '@/components/BalanceCard';
import { BudgetRing } from '@/components/BudgetRing';
import { CategoryPill } from '@/components/CategoryPill';
import { DonutChart } from '@/components/DonutChart';
import { ScopeFilter } from '@/components/ScopeFilter';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { useCategories } from '@/hooks/useCategories';
import { useDashboard } from '@/hooks/useDashboard';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/lib/format';

/** Common sub-categories surfaced as one-tap shortcuts. */
const QUICK_ADD = ['sub_groceries', 'sub_dining', 'sub_transit', 'sub_coffee', 'sub_shopping'];

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-surface-dark">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-sm font-medium text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function DashboardScreen() {
  const router = useRouter();
  const {
    accounts,
    accountBalance,
    totals,
    accountsTotal,
    transactions,
    spendByGroup,
    currentUser,
    users,
  } = useBudget();
  const { groupBudgets } = useBudgetTracker();
  const { resolveSubVisual } = useCategories();
  const { progress: goalProgress } = useGoals();
  const { sections } = useDashboard();
  const { accent } = useTheme();

  const budgeted = groupBudgets.filter((b) => b.hasBudget);
  const recent = transactions.slice(0, 3);
  const slices = spendByGroup.slice(0, 5).map((s) => ({
    label: s.group.name,
    value: s.total,
    color: s.group.color,
  }));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-24 pt-2">
        {/* Header */}
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-sm text-muted">Welcome back</Text>
            <Text className="text-2xl font-bold text-surface-dark" numberOfLines={1}>
              {currentUser?.name ?? 'Dashboard'}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => router.push('/add-member')}
              accessibilityRole="button"
              accessibilityLabel="Add member"
              className="h-14 w-14 items-center justify-center rounded-full bg-card active:opacity-70"
            >
              <Ionicons name="person-add-outline" size={24} color={accent} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/customize-dashboard')}
              accessibilityRole="button"
              accessibilityLabel="Customize dashboard"
              className="h-14 w-14 items-center justify-center rounded-full bg-card active:opacity-70"
            >
              <Ionicons name="options-outline" size={26} color={accent} />
            </Pressable>
          </View>
        </View>

        {/* Section selector (always visible) */}
        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted">Showing</Text>
          <ScopeFilter users={users} currentUserId={currentUser?.id ?? ''} variant="prominent" />
        </View>

        {/* Balance */}
        {sections.balance ? (
          <BalanceCard balance={accountsTotal} income={totals.income} expense={totals.expense} />
        ) : null}

        {/* Spending overview */}
        {sections.spending ? (
          <View className="gap-3">
            <SectionHeader title="Spending" />
            {slices.length > 0 ? (
              <View className="flex-row items-center gap-5 rounded-3xl bg-card p-5">
                <DonutChart
                  data={slices}
                  centerLabel="Spent"
                  centerValue={formatCurrency(totals.expense)}
                />
                <View className="flex-1 gap-2">
                  {slices.map((s) => (
                    <View key={s.label} className="flex-row items-center gap-2">
                      <View
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <Text className="flex-1 text-sm text-surface-dark" numberOfLines={1}>
                        {s.label}
                      </Text>
                      <Text className="text-sm font-medium text-muted">
                        {formatCurrency(s.value)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text className="text-sm text-muted">No spending yet.</Text>
            )}
          </View>
        ) : null}

        {/* Quick add */}
        {sections.quickAdd ? (
          <View className="gap-3">
            <Text className="text-lg font-semibold text-surface-dark">Quick add</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 pr-2"
            >
              {QUICK_ADD.map((subId) => {
                const visual = resolveSubVisual(subId);
                return (
                  <Pressable
                    key={subId}
                    onPress={() =>
                      router.push({
                        pathname: '/add-transaction',
                        params: { subCategoryId: subId, type: 'expense' },
                      })
                    }
                    className="w-24 items-center gap-1.5 active:opacity-70"
                  >
                    <View
                      className="h-20 w-20 items-center justify-center rounded-3xl"
                      style={{ backgroundColor: `${accent}22` }}
                    >
                      <Ionicons
                        name={visual.icon as keyof typeof Ionicons.glyphMap}
                        size={34}
                        color={accent}
                      />
                    </View>
                    <Text className="text-xs text-muted" numberOfLines={1}>
                      {visual.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {/* Accounts */}
        {sections.accounts ? (
          <View className="gap-3">
            <Text className="text-lg font-semibold text-surface-dark">Accounts</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 pr-2"
            >
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  balance={accountBalance(account.id)}
                  onPress={() =>
                    router.push({ pathname: '/account/[id]', params: { id: account.id } })
                  }
                />
              ))}
              <Pressable
                onPress={() => router.push('/add-account')}
                className="w-32 items-center justify-center gap-2 rounded-2xl border border-dashed border-muted/40 p-4 active:opacity-70"
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Ionicons name="add" size={26} color={accent} />
                </View>
                <Text className="text-sm font-medium text-primary">Add</Text>
              </Pressable>
            </ScrollView>
          </View>
        ) : null}

        {/* Budgets */}
        {sections.budgets ? (
          <View className="gap-3">
            <SectionHeader
              title="This month"
              actionLabel="See all"
              onAction={() => router.push('/budgets')}
            />
            {budgeted.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 pr-2"
              >
                {budgeted.map((budget) => (
                  <BudgetRing
                    key={budget.group.id}
                    budget={budget}
                    onPress={() =>
                      router.push({ pathname: '/edit-budget', params: { groupId: budget.group.id } })
                    }
                  />
                ))}
              </ScrollView>
            ) : (
              <Text className="text-sm text-muted">No budgets set yet.</Text>
            )}
          </View>
        ) : null}

        {/* Goals */}
        {sections.goals ? (
          <View className="gap-3">
            <SectionHeader
              title="Goals"
              actionLabel="See all"
              onAction={() => router.push('/goals')}
            />
            {goalProgress.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-3 pr-2"
              >
                {goalProgress.map(({ goal, ratio }) => (
                  <Pressable
                    key={goal.id}
                    onPress={() =>
                      router.push({ pathname: '/contribute-goal', params: { goalId: goal.id } })
                    }
                    className="w-48 gap-3 rounded-2xl bg-card p-4 active:opacity-70"
                  >
                    <View className="flex-row items-center gap-2">
                      <CategoryPill icon={goal.icon} color={accent} size={32} />
                      <Text
                        className="flex-1 text-sm font-semibold text-surface-dark"
                        numberOfLines={1}
                      >
                        {goal.name}
                      </Text>
                    </View>
                    <View className="h-2 overflow-hidden rounded-full bg-black/10">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${ratio * 100}%`, backgroundColor: accent }}
                      />
                    </View>
                    <Text className="text-xs text-muted" numberOfLines={1}>
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-sm text-muted">No goals yet.</Text>
            )}
          </View>
        ) : null}

        {/* Recent activity */}
        {sections.recent ? (
          <View className="gap-1">
            <Text className="text-lg font-semibold text-surface-dark">Recent activity</Text>
            {recent.length > 0 ? (
              <>
                {recent.map((t) => (
                  <TransactionItem
                    key={t.id}
                    transaction={t}
                    onPress={(tx) =>
                      router.push({
                        pathname: '/add-transaction',
                        params: { transactionId: tx.id },
                      })
                    }
                  />
                ))}
                <Pressable
                  onPress={() => router.push('/transactions')}
                  className="mt-2 items-center rounded-full bg-card py-3.5 active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-primary">
                    View all transactions
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text className="text-sm text-muted">No transactions yet.</Text>
            )}
          </View>
        ) : null}
      </ScrollView>

      <AddTransactionButton />
    </SafeAreaView>
  );
}
