import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /** Sizing/rounding/padding utility classes for the button box. */
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Blur strength (0–100). */
  intensity?: number;
  /** Optional accent tint (hex) to give the glass a colored cast. */
  tint?: string;
  children: React.ReactNode;
}

/**
 * An Apple-style "liquid glass" button: a translucent, blurred panel with a
 * faint highlight border. Works on web (backdrop blur) and native.
 */
export function GlassButton({
  onPress,
  disabled,
  accessibilityLabel,
  className,
  style,
  intensity = 28,
  tint,
  children,
}: Props) {
  const { isDark } = useTheme();
  const border = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)';
  const sheen = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`overflow-hidden active:opacity-80 ${className ?? ''}`}
      style={[{ borderWidth: 1, borderColor: border, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <BlurView
        intensity={intensity}
        tint={isDark ? 'light' : 'default'}
        style={StyleSheet.absoluteFill}
      />
      {/* Frost sheen + optional colored cast */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: sheen }]} />
      {tint ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: `${tint}55` }]} />
      ) : null}
      {children}
    </Pressable>
  );
}
