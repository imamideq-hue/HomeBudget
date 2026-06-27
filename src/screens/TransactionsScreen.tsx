import { Ionicons } from '@expo/vector-icons';
import { Pressable, SectionList, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTransactionButton } from '@/components/AddTransactionButton';
import { TransactionItem } from '@/components/TransactionItem';
import { useBudget } from '@/hooks/useBudget';
import { groupByDay } from '@/lib/format';
import type { Transaction } from '@/models';

export function TransactionsScreen() {
  const { transactions, deleteTransaction } = useBudget();
  const groups = groupByDay(transactions);

  const sections = groups.map((g) => ({ title: g.label, data: g.transactions }));

  const renderItem = ({ item }: { item: Transaction }) => (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={() => (
        <Pressable
          onPress={() => deleteTransaction(item.id)}
          className="w-20 items-center justify-center bg-expense active:opacity-80"
        >
          <Ionicons name="trash" size={20} color="#FFFFFF" />
          <Text className="mt-1 text-xs font-medium text-white">Delete</Text>
        </Pressable>
      )}
    >
      <TransactionItem transaction={item} />
    </ReanimatedSwipeable>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <Text className="px-5 pb-2 pt-2 text-2xl font-bold text-surface-dark">Transactions</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-12"
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text className="bg-white px-5 pb-1 pt-4 text-sm font-semibold text-muted">
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
