import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Calendar } from '@/components/Calendar';
import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetTracker } from '@/hooks/useBudgetTracker';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency, formatDayLabel, getCurrency } from '@/lib/format';
import type { TransactionType } from '@/models';

export default function AddTransactionModal() {
  const router = useRouter();
  const { allAccounts: accounts, allTransactions: transactions } = useBudget();
  const { addTransaction, editTransaction } = useBudgetTracker();
  const { groupCategories, getSubsForGroup, getSubCategory } = useCategories();

  // Optional pre-fill from a quick-add shortcut, or full prefill when editing.
  const params = useLocalSearchParams<{
    subCategoryId?: string;
    type?: string;
    transactionId?: string;
  }>();
  const editing = params.transactionId
    ? transactions.find((t) => t.id === params.transactionId)
    : undefined;

  const presetSub =
    params.subCategoryId && getSubCategory(params.subCategoryId) ? params.subCategoryId : null;
  const presetType: TransactionType = params.type === 'income' ? 'income' : 'expense';

  const [type, setType] = useState<TransactionType>(editing?.type ?? presetType);
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [subCategoryId, setSubCategoryId] = useState<string | null>(
    editing?.subCategoryId ?? presetSub,
  );
  const [accountId, setAccountId] = useState<string | null>(
    editing?.accountId ?? accounts[0]?.id ?? null,
  );
  const [note, setNote] = useState(editing?.note ?? '');
  const [date, setDate] = useState(() => (editing ? new Date(editing.date) : new Date()));
  const [showCalendar, setShowCalendar] = useState(false);

  const parsedAmount = useMemo(() => {
    const n = parseFloat(amount.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  // Only show category groups that match the selected direction.
  const groups = useMemo(
    () => groupCategories.filter((g) => g.kind === type),
    [groupCategories, type],
  );

  const canSave =
    parsedAmount > 0 && subCategoryId !== null && accountId !== null;

  const handleSave = () => {
    if (!canSave || subCategoryId === null || accountId === null) return;

    const input = {
      subCategoryId,
      accountId,
      amount: parsedAmount,
      type,
      note,
      date: date.toISOString(),
    };

    if (editing) {
      // Correct the existing item (account, amount, category, date, note).
      editTransaction(editing.id, input);
      router.back();
      return;
    }

    // Adding the item rolls up into its parent group and recalculates that
    // group's monthly budget; `groupBudget` reflects the new total/remaining.
    const { groupBudget } = addTransaction(input);

    if (groupBudget.isOverBudget) {
      Alert.alert(
        'Over budget',
        `This puts ${groupBudget.group.name} ${formatCurrency(
          Math.abs(groupBudget.remaining),
        )} over its ${formatCurrency(groupBudget.budgetLimit)} monthly budget.`,
      );
    }

    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">
            {editing ? 'Edit transaction' : 'New transaction'}
          </Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
            {/* Type toggle */}
            <View className="flex-row rounded-2xl bg-card p-1">
              {(['expense', 'income'] as const).map((t) => {
                const active = type === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => {
                      setType(t);
                      setSubCategoryId(null);
                    }}
                    className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Text
                      className={`text-sm font-semibold capitalize ${
                        active ? (t === 'income' ? 'text-income' : 'text-expense') : 'text-muted'
                      }`}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Amount */}
            <View className="items-center py-2">
              <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
                Amount ({getCurrency()})
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#C4C4D0"
                keyboardType="decimal-pad"
                className="text-center text-5xl font-bold text-surface-dark"
              />
            </View>

            {/* Account selector */}
            {accounts.length > 0 ? (
              <View>
                <Text className="mb-2 text-sm font-semibold text-surface-dark">Account</Text>
                <View className="flex-row flex-wrap gap-2">
                  {accounts.map((acc) => {
                    const selected = acc.id === accountId;
                    return (
                      <Pressable
                        key={acc.id}
                        onPress={() => setAccountId(acc.id)}
                        className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                          selected ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
                        }`}
                      >
                        <Ionicons
                          name={acc.icon as keyof typeof Ionicons.glyphMap}
                          size={16}
                          color={acc.color}
                        />
                        <Text
                          className={`text-sm ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                        >
                          {acc.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {/* Date — tap to open a calendar */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Date</Text>
              <Pressable
                onPress={() => setShowCalendar((v) => !v)}
                className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-3 active:opacity-70"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={18} color="#7C5CFC" />
                  <Text className="text-base text-surface-dark">
                    {formatDayLabel(date.toISOString())}
                  </Text>
                </View>
                <Ionicons
                  name={showCalendar ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#8A8A9E"
                />
              </Pressable>
              {showCalendar ? (
                <View className="mt-2">
                  <Calendar
                    value={date}
                    maxDate={new Date()}
                    onChange={(d) => {
                      setDate(d);
                      setShowCalendar(false);
                    }}
                  />
                </View>
              ) : null}
            </View>

            {/* Category picker (sub-categories grouped by group) */}
            <View>
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-surface-dark">Category</Text>
                <Pressable
                  onPress={() => router.push({ pathname: '/add-category', params: { kind: type } })}
                  hitSlop={8}
                  className="flex-row items-center gap-1 active:opacity-60"
                >
                  <Ionicons name="add-circle-outline" size={16} color="#7C5CFC" />
                  <Text className="text-sm font-medium text-primary">New</Text>
                </Pressable>
              </View>
              <View className="gap-4">
                {groups.map((group) => (
                  <View key={group.id}>
                    <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      {group.name}
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                      {getSubsForGroup(group.id).map((sub) => {
                        const selected = sub.id === subCategoryId;
                        const color = sub.color ?? group.color;
                        return (
                          <Pressable
                            key={sub.id}
                            onPress={() => setSubCategoryId(sub.id)}
                            className="w-[22%] items-center gap-1"
                          >
                            <View
                              className="rounded-full"
                              style={selected ? { borderWidth: 2, borderColor: color } : undefined}
                            >
                              <CategoryPill icon={sub.icon ?? group.icon} color={color} size={48} />
                            </View>
                            <Text
                              numberOfLines={1}
                              className={`text-xs ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                            >
                              {sub.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Note */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Note</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Optional note"
                placeholderTextColor="#8A8A9E"
                className="rounded-2xl bg-card px-4 py-3 text-base text-surface-dark"
              />
            </View>

            {/* Save */}
            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              className={`mt-2 flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
                canSave ? 'bg-primary active:opacity-80' : 'bg-primary/40'
              }`}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text className="text-base font-semibold text-white">
                {editing ? 'Save changes' : 'Save transaction'}
              </Text>
            </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
