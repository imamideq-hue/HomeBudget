import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BudgetProvider } from '@/context/BudgetContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BudgetProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-transaction" options={{ presentation: 'modal' }} />
            <Stack.Screen name="edit-budget" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </BudgetProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
