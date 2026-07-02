import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBudget } from '@/hooks/useBudget';
import { feedbackSuccess } from '@/lib/feedback';
import { getCurrency } from '@/lib/format';
import type { AccountType } from '@/models';

const TYPES: { key: AccountType; label: string; icon: string }[] = [
  { key: 'checking', label: 'Checking', icon: 'card' },
  { key: 'savings', label: 'Savings', icon: 'wallet' },
  { key: 'cash', label: 'Cash', icon: 'cash' },
  { key: 'credit', label: 'Credit', icon: 'card-outline' },
  { key: 'investment', label: 'Investment', icon: 'trending-up' },
];

const ICONS = [
  'card', 'wallet', 'cash', 'business', 'trending-up', 'pie-chart',
  'card-outline', 'gift', 'briefcase', 'home', 'airplane', 'star',
];

const COLORS = [
  '#7C5CFC', '#4DABF7', '#22B8CF', '#34C77B', '#82C91E', '#FFA94D',
  '#FF922B', '#FF6B6B', '#F783AC', '#845EF7', '#20C997', '#868E96',
];

export default function AddAccountModal() {
  const router = useRouter();
  const { allAccounts, addAccount, editAccount, deleteAccount } = useBudget();

  const params = useLocalSearchParams<{ accountId?: string }>();
  const editing = params.accountId ? allAccounts.find((a) => a.id === params.accountId) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState<AccountType>(editing?.type ?? 'checking');
  const [icon, setIcon] = useState(editing?.icon ?? ICONS[0]);
  const [color, setColor] = useState(editing?.color ?? COLORS[0]);
  const [balance, setBalance] = useState('');

  const startingBalance = useMemo(() => {
    const n = parseFloat(balance.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }, [balance]);

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    if (editing) {
      editAccount(editing.id, { name: name.trim(), type, icon, color });
    } else {
      addAccount({ name, type, icon, color, startingBalance });
    }
    feedbackSuccess();
    router.back();
  };

  const confirmDelete = () => {
    if (!editing) return;
    Alert.alert(
      'Delete account',
      `Delete "${editing.name}"? Its transactions will be removed too.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAccount(editing.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">
            {editing ? 'Edit account' : 'New account'}
          </Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-6 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Preview + name */}
          <View className="items-center gap-3">
            <View
              className="h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${color}22` }}
            >
              <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={30} color={color} />
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Account name"
              placeholderTextColor="#C4C4D0"
              className="w-full rounded-2xl bg-card px-4 py-3 text-center text-lg font-semibold text-surface-dark"
            />
          </View>

          {/* Type */}
          <View>
            <Text className="mb-2 text-sm font-semibold text-surface-dark">Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {TYPES.map((t) => {
                const selected = type === t.key;
                return (
                  <Pressable
                    key={t.key}
                    onPress={() => {
                      setType(t.key);
                      if (!editing) setIcon(t.icon);
                    }}
                    className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                      selected ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
                    }`}
                  >
                    <Ionicons
                      name={t.icon as keyof typeof Ionicons.glyphMap}
                      size={15}
                      color={selected ? color : '#8A8A9E'}
                    />
                    <Text
                      className={`text-sm ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Starting balance (only when creating) */}
          {!editing ? (
            <View className="items-center">
              <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
                Starting balance ({getCurrency()})
              </Text>
              <TextInput
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor="#C4C4D0"
                keyboardType="numbers-and-punctuation"
                className="text-center text-4xl font-bold text-surface-dark"
              />
            </View>
          ) : null}

          {/* Color */}
          <View>
            <Text className="mb-2 text-sm font-semibold text-surface-dark">Color</Text>
            <View className="flex-row flex-wrap gap-3">
              {COLORS.map((c) => (
                <Pressable key={c} onPress={() => setColor(c)} hitSlop={4}>
                  <View
                    className="h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: c }}
                  >
                    {c === color ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Icon */}
          <View>
            <Text className="mb-2 text-sm font-semibold text-surface-dark">Icon</Text>
            <View className="flex-row flex-wrap gap-3">
              {ICONS.map((i) => {
                const selected = i === icon;
                return (
                  <Pressable
                    key={i}
                    onPress={() => setIcon(i)}
                    className={`h-11 w-11 items-center justify-center rounded-xl ${
                      selected ? 'bg-primary/15' : 'bg-card'
                    }`}
                    style={selected ? { borderWidth: 2, borderColor: color } : undefined}
                  >
                    <Ionicons
                      name={i as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={selected ? color : '#8A8A9E'}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Delete (edit mode) */}
          {editing ? (
            <Pressable
              onPress={confirmDelete}
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-expense/40 py-4 active:opacity-70"
            >
              <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
              <Text className="text-base font-semibold text-expense">Delete account</Text>
            </Pressable>
          ) : null}
        </ScrollView>

        {/* Sticky action button — always visible at the bottom */}
        <View className="border-t border-line bg-surface px-5 pb-2 pt-3">
          <Pressable
            onPress={save}
            disabled={!canSave}
            className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
              canSave ? 'bg-primary active:opacity-80' : 'bg-primary/40'
            }`}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">
              {editing ? 'Save changes' : 'Create account'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
