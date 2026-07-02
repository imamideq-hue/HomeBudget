import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

const INACTIVE = '#8A8A9E';

type IconName = keyof typeof Ionicons.glyphMap;

/** A tab icon that gets a rounded pill highlight behind it when active (Cashew). */
function TabIcon({
  name,
  color,
  focused,
  accent,
}: {
  name: IconName;
  color: ColorValue;
  focused: boolean;
  accent: string;
}) {
  return (
    <View
      style={{
        width: 56,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? `${accent}26` : 'transparent',
      }}
    >
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  const { accent, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  // Reserve room for the device's bottom inset (gesture pill / nav bar) so the
  // tab bar never sits under the system navigation.
  const bottomInset = Math.max(insets.bottom, 8);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: isDark ? '#121218' : '#FFFFFF',
          borderTopColor: isDark ? '#26262E' : '#ECECF2',
          height: 60 + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} accent={accent} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="swap-vertical" color={color} focused={focused} accent={accent} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="wallet" color={color} focused={focused} accent={accent} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="ellipsis-horizontal" color={color} focused={focused} accent={accent} />
          ),
        }}
      />
    </Tabs>
  );
}
