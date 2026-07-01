import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/** Floating action button that opens the add-transaction modal. */
export function AddTransactionButton() {
  const router = useRouter();
  const { accent } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add transaction"
      onPress={() => router.push('/add-transaction')}
      className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-80"
      style={{
        shadowColor: accent,
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <Ionicons name="add" size={30} color="#FFFFFF" />
    </Pressable>
  );
}
