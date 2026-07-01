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
        <View className="flex-row items-center justify-between px-5 pt-2">
          <Text className="text-3xl font-extrabold text-surface-dark">Edit home</Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="rounded-full bg-primary px-6 py-3 active:opacity-80"
          >
            <Text className="text-base font-semibold text-white">Done</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerClassName="gap-3 px-5 pb-10 pt-4">
          <Text className="px-1 pb-1 text-sm text-muted">
            Choose which sections show on your home screen.
          </Text>

          {DASHBOARD_SECTIONS.map((section) => {
            const visible = sections[section.key];
            return (
              <View
                key={section.key}
                className="flex-row items-center gap-4 rounded-2xl bg-card px-5 py-4"
              >
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${accent}22` }}
                >
                  <Ionicons
                    name={section.icon as keyof typeof Ionicons.glyphMap}
                    size={26}
                    color={accent}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-surface-dark">
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
