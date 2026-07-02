import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

interface Tile {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
}

const GRID: Tile[] = [
  { label: 'Goals', icon: 'flag', href: '/goals' },
  { label: 'Accounts', icon: 'card', href: '/add-account' },
  { label: 'Categories', icon: 'pricetags', href: '/categories' },
  { label: 'Members', icon: 'people', href: '/manage-space' },
  { label: 'Budgets', icon: 'stats-chart', href: '/budgets' },
  { label: 'Transactions', icon: 'list', href: '/transactions' },
];

export function MoreScreen() {
  const router = useRouter();
  const { accent } = useTheme();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 px-5 pb-12 pt-2">
        <Text className="text-4xl font-extrabold text-surface-dark">More</Text>

        {/* Settings & Customization (big) */}
        <Pressable
          onPress={() => router.push('/settings')}
          className="flex-row items-center gap-4 rounded-3xl border border-line bg-card p-5 active:opacity-80"
        >
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accent}22` }}
          >
            <Ionicons name="settings-outline" size={24} color={accent} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-surface-dark">Settings &amp; Customization</Text>
            <Text className="text-sm text-muted">Theme, currency, accounts, sync</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8A8A98" />
        </Pressable>

        {/* Customize home (big) */}
        <Pressable
          onPress={() => router.push('/customize-dashboard')}
          className="flex-row items-center gap-4 rounded-3xl border border-line bg-card p-5 active:opacity-80"
        >
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accent}22` }}
          >
            <Ionicons name="options-outline" size={24} color={accent} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-surface-dark">Edit home</Text>
            <Text className="text-sm text-muted">Show, hide and arrange dashboard sections</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8A8A98" />
        </Pressable>

        {/* Grid */}
        <View className="flex-row flex-wrap gap-3">
          {GRID.map((t) => (
            <Pressable
              key={t.label}
              onPress={() => router.push(t.href)}
              className="w-[48%] gap-3 rounded-2xl border border-line bg-card px-4 py-4 active:opacity-80"
            >
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${accent}22` }}
              >
                <Ionicons name={t.icon} size={22} color={accent} />
              </View>
              <Text className="text-base font-semibold text-surface-dark" numberOfLines={1}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-2 text-center text-xs text-muted">
          HomeBudget · Cashew-inspired shared budgets
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
