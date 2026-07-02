import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { darken, lighten } from '@/lib/theme';

interface Props {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
}

/** Cashew-style squircle floating action button (light-lavender + dark glyph). */
export function Fab({ onPress, icon = 'add', accessibilityLabel }: Props) {
  const { accent } = useTheme();
  const fill = lighten(accent, 0.72);
  const glyph = darken(accent, 0.35);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
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
      <Ionicons name={icon} size={32} color={glyph} />
    </Pressable>
  );
}
