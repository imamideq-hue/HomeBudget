import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { CURRENCY, formatCurrency } from '@/lib/format';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  );
}

export function SettingsScreen() {
  const router = useRouter();
  const { currentSpace, accounts, accountBalance } = useBudget();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-12 pt-2">
        <Text className="text-2xl font-bold text-surface-dark">Settings</Text>

        {/* Space */}
        {currentSpace ? (
          <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
              <Ionicons name="people" size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-surface-dark">
                {currentSpace.name}
              </Text>
              <Text className="text-sm text-muted">
                {currentSpace.members.length} member
                {currentSpace.members.length === 1 ? '' : 's'} · {currentSpace.currency}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Accounts */}
        <Section title="Accounts">
          {accounts.map((acc) => (
            <Pressable
              key={acc.id}
              onPress={() => router.push({ pathname: '/account/[id]', params: { id: acc.id } })}
              className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3 active:opacity-70"
            >
              <CategoryPill icon={acc.icon} color={acc.color} size={36} />
              <Text className="flex-1 text-base text-surface-dark">{acc.name}</Text>
              <Text className="text-sm font-semibold text-surface-dark">
                {formatCurrency(accountBalance(acc.id))}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
            </Pressable>
          ))}
        </Section>

        {/* Categories */}
        <Section title="Categories">
          <Pressable
            onPress={() => router.push('/add-category')}
            className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4 active:opacity-70"
          >
            <Ionicons name="pricetag-outline" size={22} color="#7C5CFC" />
            <Text className="flex-1 text-base text-surface-dark">Add a category</Text>
            <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
          </Pressable>
        </Section>

        {/* App */}
        <Section title="App">
          <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4">
            <Ionicons name="cloud-offline-outline" size={22} color="#7C5CFC" />
            <Text className="flex-1 text-base text-surface-dark">Sync</Text>
            <Text className="text-sm text-muted">Local only</Text>
          </View>
          <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4">
            <Ionicons name="cash-outline" size={22} color="#7C5CFC" />
            <Text className="flex-1 text-base text-surface-dark">Currency</Text>
            <Text className="text-sm text-muted">{CURRENCY}</Text>
          </View>
        </Section>

        <Text className="mt-2 text-center text-xs text-muted">
          HomeBudget · Cashew-inspired shared budgets
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
