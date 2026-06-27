import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
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
  const { currentSpace, accounts, goals, loans, accountBalance } = useBudget();

  const activeGoals = goals.filter((g) => g.status === 'active');
  const openLoans = loans.filter((l) => l.status === 'open');

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
            <View
              key={acc.id}
              className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3"
            >
              <CategoryPill icon={acc.icon} color={acc.color} size={36} />
              <Text className="flex-1 text-base text-surface-dark">{acc.name}</Text>
              <Text className="text-sm font-semibold text-surface-dark">
                {formatCurrency(accountBalance(acc.id))}
              </Text>
            </View>
          ))}
        </Section>

        {/* Goals */}
        <Section title="Goals">
          {activeGoals.map((goal) => {
            const ratio = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
            return (
              <View key={goal.id} className="rounded-2xl bg-card px-4 py-3">
                <View className="flex-row items-center gap-3">
                  <CategoryPill icon={goal.icon} color={goal.color} size={36} />
                  <Text className="flex-1 text-base text-surface-dark">{goal.name}</Text>
                  <Text className="text-sm text-muted">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </Text>
                </View>
                <View className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(ratio, 1) * 100}%`, backgroundColor: goal.color }}
                  />
                </View>
              </View>
            );
          })}
        </Section>

        {/* Loans */}
        <Section title="Loans">
          {openLoans.map((loan) => (
            <View
              key={loan.id}
              className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3"
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-black/5">
                <Ionicons
                  name={loan.direction === 'borrowed' ? 'arrow-down' : 'arrow-up'}
                  size={18}
                  color={loan.direction === 'borrowed' ? '#FF6B6B' : '#34C77B'}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base text-surface-dark">{loan.name}</Text>
                <Text className="text-xs text-muted capitalize">
                  {loan.direction} · {loan.counterparty}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-surface-dark">
                {formatCurrency(loan.outstanding)}
              </Text>
            </View>
          ))}
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
