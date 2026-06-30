import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { formatCurrency, groupByDay } from '@/lib/format';

export function AccountDetailScreen({ accountId }: { accountId: string }) {
  const router = useRouter();
  const { allAccounts, allTransactions, accountBalance } = useBudget();

  const account = allAccounts.find((a) => a.id === accountId);

  const accountTx = useMemo(
    () => allTransactions.filter((t) => t.accountId === accountId),
    [allTransactions, accountId],
  );

  const flow = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of accountTx) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense };
  }, [accountTx]);

  const groups = groupByDay(accountTx);

  if (!account) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-muted">Account not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
          <Ionicons name="chevron-back" size={24} color="#15151B" />
        </Pressable>
        <Text className="text-lg font-semibold text-surface-dark">{account.name}</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 px-5 pb-12 pt-2">
        {/* Balance card */}
        <View className="rounded-3xl bg-card p-5">
          <View className="flex-row items-center gap-3">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${account.color}22` }}
            >
              <Ionicons
                name={account.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={account.color}
              />
            </View>
            <Text className="text-sm capitalize text-muted">{account.type}</Text>
          </View>

          <Text className="mt-3 text-sm text-muted">Current balance</Text>
          <Text className="text-4xl font-bold text-surface-dark">
            {formatCurrency(accountBalance(account.id))}
          </Text>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white px-4 py-3">
              <Text className="text-xs text-muted">In</Text>
              <Text className="mt-0.5 text-base font-semibold text-income">
                {formatCurrency(flow.income)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white px-4 py-3">
              <Text className="text-xs text-muted">Out</Text>
              <Text className="mt-0.5 text-base font-semibold text-expense">
                {formatCurrency(flow.expense)}
              </Text>
            </View>
          </View>

          {/* Add money / correct the balance (not logged as a transaction) */}
          <Pressable
            onPress={() =>
              router.push({ pathname: '/adjust-account', params: { accountId: account.id } })
            }
            className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3 active:opacity-80"
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">Add money / adjust balance</Text>
          </Pressable>
        </View>

        {/* Activity for this account */}
        <View>
          <Text className="mb-1 text-lg font-semibold text-surface-dark">Activity</Text>
          {groups.length > 0 ? (
            groups.map((g) => (
              <View key={g.key}>
                <Text className="px-4 pb-1 pt-4 text-sm font-semibold text-muted">{g.label}</Text>
                {g.transactions.map((t) => (
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
              </View>
            ))
          ) : (
            <Text className="px-4 pt-2 text-sm text-muted">No transactions for this account.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
