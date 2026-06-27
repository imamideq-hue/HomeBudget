import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENCY } from '@/lib/format';

const ROWS: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string }[] = [
  { icon: 'people-outline', label: 'Shared members', value: 'Just you' },
  { icon: 'cash-outline', label: 'Currency', value: CURRENCY },
  { icon: 'color-palette-outline', label: 'Appearance', value: 'System' },
  { icon: 'cloud-upload-outline', label: 'Sync', value: 'Local only' },
];

export function SettingsScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-2 px-5 pb-12 pt-2">
        <Text className="mb-2 text-2xl font-bold text-surface-dark">Settings</Text>

        {ROWS.map((row) => (
          <View
            key={row.label}
            className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4"
          >
            <Ionicons name={row.icon} size={22} color="#7C5CFC" />
            <Text className="flex-1 text-base text-surface-dark">{row.label}</Text>
            {row.value ? <Text className="text-sm text-muted">{row.value}</Text> : null}
          </View>
        ))}

        <Text className="mt-6 text-center text-xs text-muted">
          HomeBudget · Cashew-inspired shared budgets
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
