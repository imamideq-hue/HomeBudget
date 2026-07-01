import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDashboard } from '@/hooks/useDashboard';
import { useTheme } from '@/hooks/useTheme';
import { DASHBOARD_SECTIONS } from '@/lib/dashboard';

export default function CustomizeDashboardModal() {
  const router = useRouter();
  const { sections, setSection } = useDashboard();
  const { accent } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Done</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">Customize dashboard</Text>
          <View className="w-14" />
        </View>

        <ScrollView contentContainerClassName="gap-3 px-5 pb-10 pt-2">
          <Text className="px-1 pb-1 text-sm text-muted">
            Choose which sections show on your home screen.
          </Text>

          {DASHBOARD_SECTIONS.map((section) => {
            const visible = sections[section.key];
            return (
              <View
                key={section.key}
                className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${accent}22` }}
                >
                  <Ionicons
                    name={section.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={accent}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-surface-dark">
                    {section.label}
                  </Text>
                  <Text className="text-xs text-muted">{section.description}</Text>
                </View>
                <Switch
                  value={visible}
                  onValueChange={(v) => setSection(section.key, v)}
                  trackColor={{ false: '#C4C4D0', true: accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
