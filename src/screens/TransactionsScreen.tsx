import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, SectionList, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTransactionButton } from '@/components/AddTransactionButton';
import { ScopeFilter } from '@/components/ScopeFilter';
import { SummaryPill } from '@/components/SummaryPill';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { groupByDay } from '@/lib/format';
import type { Transaction } from '@/models';

export function TransactionsScreen() {
  const router = useRouter();
  const { transactions, deleteTransaction, users, currentUser, totals } = useBudget();
  const groups = groupByDay(transactions);

  const sections = groups.map((g) => ({ title: g.label, data: g.transactions }));

  const renderItem = ({ item }: { item: Transaction }) => (
    <View className="px-5 pb-3">
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={40}
        renderRightActions={() => (
          <Pressable
            onPress={() => deleteTransaction(item.id)}
            className="ml-2 w-20 items-center justify-center rounded-2xl bg-expense active:opacity-80"
          >
            <Ionicons name="trash" size={20} color="#FFFFFF" />
            <Text className="mt-1 text-xs font-medium text-white">Delete</Text>
          </Pressable>
        )}
      >
        <TransactionItem
          transaction={item}
          onPress={(t) =>
            router.push({ pathname: '/add-transaction', params: { transactionId: t.id } })
          }
        />
      </ReanimatedSwipeable>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <Text className="px-5 pb-3 pt-2 text-3xl font-extrabold text-surface-dark">
        Transactions
      </Text>
      <View className="px-5 pb-3">
        <ScopeFilter users={users} currentUserId={currentUser?.id ?? ''} />
      </View>
      {transactions.length > 0 ? (
        <View className="px-5 pb-2">
          <SummaryPill income={totals.income} expense={totals.expense} />
        </View>
      ) : null}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-12"
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text className="bg-surface px-5 pb-1 pt-4 text-sm font-semibold text-muted">
            {section.title}
          </Text>
        )}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="items-center px-5 pt-16">
            <Text className="text-base text-muted">No transactions yet.</Text>
          </View>
        }
      />
      <AddTransactionButton />
    </SafeAreaView>
  );
}
