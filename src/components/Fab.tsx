import { Ionicons } from '@expo/vector-icons';

import { GlassButton } from '@/components/GlassButton';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
}

/** Liquid-glass squircle floating action button. */
export function Fab({ onPress, icon = 'add', accessibilityLabel }: Props) {
  const { accent } = useTheme();
  return (
    <GlassButton
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      tint={accent}
      intensity={40}
      className="absolute bottom-6 right-5 h-16 w-16 items-center justify-center rounded-[22px]"
      style={{
        shadowColor: accent,
        shadowOpacity: 0.4,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <Ionicons name={icon} size={32} color="#FFFFFF" />
    </GlassButton>
  );
}
