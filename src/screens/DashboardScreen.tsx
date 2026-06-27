import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountCard } from '@/components/AccountCard';
import { AddTransactionButton } from '@/components/AddTransactionButton';
import { BalanceCard } from '@/components/BalanceCard';
import { BudgetProgressRow } from '@/components/BudgetProgressRow';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { resolveSubVisual } from '@/lib/categories';

/** Common sub-categories surfaced as one-tap shortcuts. */
const QUICK_ADD = ['sub_groceries', 'sub_dining', 'sub_transit', 'sub_coffee', 'sub_shopping'];

export function DashboardScreen() {
  const router = useRouter();
  const { accounts, accountBalance, totals, transactions, currentUser } = useBudget();
  const { groupBudgets } = useBudgetTracker();

  const budgeted = groupBudgets.filter((b) => b.hasBudget);
  const recent = transactions.slice(0, 3);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-24 pt-2">
        {/* Header + quick add */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted">Welcome back</Text>
            <Text className="text-2xl font-bold text-surface-dark">
              {currentUser?.name ?? 'Dashboard'}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/add-transaction')}
            accessibilityRole="button"
            accessibilityLabel="Quick add transaction"
            className="flex-row items-center gap-1 rounded-full bg-primary px-4 py-2 active:opacity-80"
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">Add</Text>
          </Pressable>
        </View>

        {/* Balance hero */}
        <BalanceCard balance={totals.balance} income={totals.income} expense={totals.expense} />

        {/* Quick add shortcuts */}
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
                  className="w-20 items-center gap-1 active:opacity-70"
                >
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${visual.color}22` }}
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
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Accounts */}
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
              />
            ))}
          </ScrollView>
        </View>

        {/* Budgets (group categories) */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-surface-dark">This month</Text>
            <Pressable onPress={() => router.push('/budgets')} hitSlop={8}>
              <Text className="text-sm font-medium text-primary">See all</Text>
            </Pressable>
          </View>
          {budgeted.length > 0 ? (
            <View className="gap-3">
              {budgeted.map((budget) => (
                <BudgetProgressRow key={budget.group.id} budget={budget} />
              ))}
            </View>
          ) : (
            <Text className="text-sm text-muted">No budgets set yet.</Text>
          )}
        </View>

        {/* Recent activity */}
        <View className="gap-1">
          <Text className="text-lg font-semibold text-surface-dark">Recent activity</Text>
          {recent.length > 0 ? (
            recent.map((t) => <TransactionItem key={t.id} transaction={t} />)
          ) : (
            <Text className="text-sm text-muted">No transactions yet.</Text>
          )}
        </View>
      </ScrollView>

      <AddTransactionButton />
    </SafeAreaView>
  );
}
