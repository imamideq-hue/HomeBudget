import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountCard } from '@/components/AccountCard';
import { AddTransactionButton } from '@/components/AddTransactionButton';
import { BalanceCard } from '@/components/BalanceCard';
import { BudgetRing } from '@/components/BudgetRing';
import { DonutChart } from '@/components/DonutChart';
import { MotionView, PressableScale } from '@/components/motion';
import { ScopeFilter } from '@/components/ScopeFilter';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/format';

/** Common sub-categories surfaced as one-tap shortcuts. */
const QUICK_ADD = ['sub_groceries', 'sub_dining', 'sub_transit', 'sub_coffee', 'sub_shopping'];

/** Fade/slide a dashboard section in, staggered by its position. */
function Section({ index, children, className }: { index: number; children: React.ReactNode; className?: string }) {
  return (
    <MotionView entering={FadeInDown.duration(380).delay(index * 55)} className={className}>
      {children}
    </MotionView>
  );
}

export function DashboardScreen() {
  const router = useRouter();
  const { accounts, accountBalance, totals, transactions, spendByGroup, currentUser, users } =
    useBudget();
  const { groupBudgets } = useBudgetTracker();
  const { resolveSubVisual } = useCategories();

  const budgeted = groupBudgets.filter((b) => b.hasBudget);
  const recent = transactions.slice(0, 3);
  const slices = spendByGroup.slice(0, 6).map((s) => ({
    label: s.group.name,
    value: s.total,
    color: s.group.color,
  }));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-24 pt-2">
        {/* Header */}
        <Section index={0}>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-sm text-muted">Welcome back</Text>
              <Text className="text-2xl font-bold text-surface-dark" numberOfLines={1}>
                {currentUser?.name ?? 'Dashboard'}
              </Text>
            </View>
            <PressableScale
              onPress={() => router.push('/add-member')}
              accessibilityRole="button"
              accessibilityLabel="Add member"
              className="shrink-0 flex-row items-center gap-1.5 rounded-full bg-primary px-4 py-2.5"
            >
              <Ionicons name="person-add" size={16} color="#FFFFFF" />
              <Text className="text-sm font-semibold text-white">Add user</Text>
            </PressableScale>
          </View>
        </Section>

        {/* Active section */}
        <Section index={1}>
          <ScopeFilter users={users} currentUserId={currentUser?.id ?? ''} variant="prominent" />
        </Section>

        {/* Balance hero */}
        <Section index={2}>
          <BalanceCard balance={totals.balance} income={totals.income} expense={totals.expense} />
        </Section>

        {/* Spending diagram */}
        {slices.length > 0 ? (
          <Section index={3} className="gap-3">
            <Text className="text-lg font-semibold text-surface-dark">Where it goes</Text>
            <View className="flex-row items-center gap-5 rounded-3xl bg-card p-5">
              <DonutChart
                data={slices}
                size={132}
                stroke={18}
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
          </Section>
        ) : null}

        {/* Quick add shortcuts */}
        <Section index={4} className="gap-3">
          <Text className="text-lg font-semibold text-surface-dark">Quick add</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 pr-2"
          >
            {QUICK_ADD.map((subId) => {
              const visual = resolveSubVisual(subId);
              return (
                <PressableScale
                  key={subId}
                  onPress={() =>
                    router.push({
                      pathname: '/add-transaction',
                      params: { subCategoryId: subId, type: 'expense' },
                    })
                  }
                  className="w-20 items-center gap-1"
                >
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${visual.color}1A` }}
                  >
                    <Ionicons
                      name={visual.icon as keyof typeof Ionicons.glyphMap}
                      size={24}
                      color={visual.color}
                    />
                  </View>
                  <Text className="text-xs text-muted" numberOfLines={1}>
                    {visual.name}
                  </Text>
                </PressableScale>
              );
            })}
          </ScrollView>
        </Section>

        {/* Accounts */}
        <Section index={5} className="gap-3">
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
                onPress={() => router.push({ pathname: '/account/[id]', params: { id: account.id } })}
              />
            ))}
          </ScrollView>
        </Section>

        {/* Budgets */}
        <Section index={6} className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-surface-dark">This month</Text>
            <Pressable onPress={() => router.push('/budgets')} hitSlop={8}>
              <Text className="text-sm font-medium text-primary">See all</Text>
            </Pressable>
          </View>
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
        </Section>

        {/* Recent activity */}
        <Section index={7} className="gap-1">
          <Text className="text-lg font-semibold text-surface-dark">Recent activity</Text>
          {recent.length > 0 ? (
            recent.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onPress={(tx) =>
                  router.push({ pathname: '/add-transaction', params: { transactionId: tx.id } })
                }
              />
            ))
          ) : (
            <Text className="text-sm text-muted">No transactions yet.</Text>
          )}
        </Section>
      </ScrollView>

      <AddTransactionButton />
    </SafeAreaView>
  );
}
