import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBudget } from '@/hooks/useBudget';
import { useTheme } from '@/hooks/useTheme';
import { feedbackSuccess } from '@/lib/feedback';
import { formatCurrency, getCurrency } from '@/lib/format';

type Mode = 'set' | 'add';

export default function AdjustAccountModal() {
  const router = useRouter();
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const { allAccounts, accountBalance, setAccountBalance, addToAccountBalance } = useBudget();
  const { accent } = useTheme();

  const account = allAccounts.find((a) => a.id === accountId);
  const current = account ? accountBalance(account.id) : 0;

  const [mode, setMode] = useState<Mode>('set');
  const [value, setValue] = useState('');

  const parsed = useMemo(() => {
    const n = parseFloat(value.replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [value]);

  if (!account) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <Text className="text-base text-muted">Account not found.</Text>
      </SafeAreaView>
    );
  }

  const valid = Number.isFinite(parsed) && (mode === 'add' ? parsed !== 0 : true);
  const projected = mode === 'set' ? parsed : current + parsed;

  const save = () => {
    if (!valid) return;
    if (mode === 'set') setAccountBalance(account.id, parsed);
    else addToAccountBalance(account.id, parsed);
    feedbackSuccess();
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">Adjust balance</Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Account identity + current balance */}
          <View className="items-center gap-2">
            <View
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: `${account.color}22` }}
            >
              <Ionicons
                name={account.icon as keyof typeof Ionicons.glyphMap}
                size={26}
                color={account.color}
              />
            </View>
            <Text className="text-lg font-bold text-surface-dark">{account.name}</Text>
            <Text className="text-sm text-muted">Current {formatCurrency(current)}</Text>
          </View>

          {/* Mode toggle */}
          <View className="flex-row rounded-2xl bg-card p-1">
            {(
              [
                { key: 'set', label: 'Set balance' },
                { key: 'add', label: 'Add / remove' },
              ] as const
            ).map((opt) => {
              const active = mode === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setMode(opt.key)}
                  className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-surface shadow-sm' : ''}`}
                >
                  <Text
                    className={`text-sm font-semibold ${active ? 'text-primary' : 'text-muted'}`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Amount */}
          <View className="items-center py-2">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              {mode === 'set' ? `New balance (${getCurrency()})` : `Amount (${getCurrency()})`}
            </Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={mode === 'set' ? '0.00' : '+/- 0.00'}
              placeholderTextColor="#C4C4D0"
              keyboardType="numbers-and-punctuation"
              autoFocus
              className="text-center text-5xl font-bold text-surface-dark"
            />
            {valid ? (
              <Text className="mt-2 text-sm text-muted">
                New balance {formatCurrency(projected)}
              </Text>
            ) : (
              <Text className="mt-2 text-sm text-muted">
                {mode === 'add' ? 'Use a negative amount to remove money' : ' '}
              </Text>
            )}
          </View>

          <Text className="text-center text-xs text-muted">
            Balance corrections adjust the account only — they don't show up as income or
            expenses.
          </Text>

        </ScrollView>

        {/* Sticky action button — always visible at the bottom */}
        <View className="border-t border-line bg-surface px-5 pb-2 pt-3">
          <Pressable
            onPress={save}
            disabled={!valid}
            className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
              valid ? 'bg-primary active:opacity-80' : 'bg-primary/40'
            }`}
            style={valid ? { shadowColor: accent } : undefined}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">Save balance</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
