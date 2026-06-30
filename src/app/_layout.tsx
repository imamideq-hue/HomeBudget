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
import { hexToRgbTriplet } from '@/lib/theme';

/** Applies the user's accent as a CSS variable so `*-primary` styles follow it. */
function ThemedApp() {
  const { accent } = useTheme();
  return (
    <View style={[{ flex: 1 }, vars({ '--color-primary': hexToRgbTriplet(accent) })]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-transaction" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-budget" options={{ presentation: 'modal' }} />
        <Stack.Screen name="contribute-goal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-category" options={{ presentation: 'modal' }} />
        <Stack.Screen name="goal-deadline" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-goal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-member" options={{ presentation: 'modal' }} />
        <Stack.Screen name="categories" />
        <Stack.Screen name="account/[id]" />
      </Stack>
      <StatusBar style="auto" />
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
