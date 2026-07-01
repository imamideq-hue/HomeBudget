import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/AuthContext';
import { BudgetProvider } from '@/context/BudgetContext';
import { ScopeProvider } from '@/context/ScopeContext';
import { useTheme } from '@/hooks/useTheme';
import { BACKGROUND, hexToRgbTriplet, THEME_VARS } from '@/lib/theme';

/** Applies the accent + light/dark surfaces as CSS variables for the whole app. */
function ThemedApp() {
  const { accent, isDark } = useTheme();
  const themeVars = vars({
    ...THEME_VARS[isDark ? 'dark' : 'light'],
    '--color-primary': hexToRgbTriplet(accent),
  });
  return (
    <View
      style={[{ flex: 1, backgroundColor: isDark ? BACKGROUND.dark : BACKGROUND.light }, themeVars]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-transaction" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-budget" options={{ presentation: 'modal' }} />
        <Stack.Screen name="contribute-goal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-category" options={{ presentation: 'modal' }} />
        <Stack.Screen name="goal-deadline" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-goal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-budget" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-member" options={{ presentation: 'modal' }} />
        <Stack.Screen name="adjust-account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="manage-space" options={{ presentation: 'modal' }} />
        <Stack.Screen name="customize-dashboard" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="celebrate"
          options={{ presentation: 'transparentModal', animation: 'fade' }}
        />
        <Stack.Screen name="categories" />
        <Stack.Screen name="account/[id]" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <BudgetProvider>
            <ScopeProvider>
              <ThemedApp />
            </ScopeProvider>
          </BudgetProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
