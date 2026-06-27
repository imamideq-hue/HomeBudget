import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { CATEGORIES } from '@/lib/categories';
import { CURRENCY } from '@/lib/format';
import { newId } from '@/lib/id';
import type { TransactionType } from '@/lib/types';

export default function AddTransactionModal() {
  const router = useRouter();
  const { addTransaction } = useBudget();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const parsedAmount = useMemo(() => {
    const n = parseFloat(amount.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canSave = parsedAmount > 0 && categoryId !== null;

  const handleSave = () => {
    if (!canSave || categoryId === null) return;
    addTransaction({
      id: newId(),
      amount: parsedAmount,
      type,
      categoryId,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
      member: 'You',
    });
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-3">
            <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
              <Text className="text-base text-muted">Cancel</Text>
            </Pressable>
            <Text className="text-base font-semibold text-surface-dark">New transaction</Text>
            <View className="w-14" />
          </View>

          <ScrollView
            contentContainerClassName="gap-6 px-5 pb-10 pt-2"
            keyboardShouldPersistTaps="handled"
          >
            {/* Type toggle */}
            <View className="flex-row rounded-2xl bg-card p-1">
              {(['expense', 'income'] as const).map((t) => {
                const active = type === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
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
                Amount ({CURRENCY})
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

            {/* Category picker */}
            <View>
              <Text className="mb-3 text-sm font-semibold text-surface-dark">Category</Text>
              <View className="flex-row flex-wrap gap-3">
                {CATEGORIES.map((c) => {
                  const selected = c.id === categoryId;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => setCategoryId(c.id)}
                      className="w-[22%] items-center gap-1"
                    >
                      <View
                        className="rounded-full"
                        style={selected ? { borderWidth: 2, borderColor: c.color } : undefined}
                      >
                        <CategoryPill category={c} size={48} />
                      </View>
                      <Text
                        numberOfLines={1}
                        className={`text-xs ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                      >
                        {c.name}
                      </Text>
                    </Pressable>
                  );
                })}
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
              <Text className="text-base font-semibold text-white">Save transaction</Text>
            </Pressable>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
