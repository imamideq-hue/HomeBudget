import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/AuthContext';
import { BudgetProvider } from '@/context/BudgetContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
        <BudgetProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-transaction" options={{ presentation: 'modal' }} />
            <Stack.Screen name="edit-budget" options={{ presentation: 'modal' }} />
            <Stack.Screen name="contribute-goal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add-category" options={{ presentation: 'modal' }} />
            <Stack.Screen name="goal-deadline" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add-member" options={{ presentation: 'modal' }} />
            <Stack.Screen name="categories" />
            <Stack.Screen name="account/[id]" />
          </Stack>
          <StatusBar style="auto" />
        </BudgetProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
