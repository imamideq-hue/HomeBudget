import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { darken, lighten } from '@/lib/theme';

/** Floating action button that opens the add-transaction modal (Cashew squircle). */
export function AddTransactionButton() {
  const router = useRouter();
  const { accent } = useTheme();

  // Cashew's FAB: soft light-lavender squircle with a dark accent "+".
  const fill = lighten(accent, 0.72);
  const glyph = darken(accent, 0.35);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add transaction"
      onPress={() => router.push('/add-transaction')}
      className="absolute bottom-6 right-5 h-16 w-16 items-center justify-center rounded-[22px] active:opacity-80"
      style={{
        backgroundColor: fill,
        shadowColor: accent,
        shadowOpacity: 0.4,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <Ionicons name="add" size={32} color={glyph} />
    </Pressable>
  );
}
