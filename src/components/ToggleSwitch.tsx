import { Pressable, View } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  /** Track color when on (defaults to the app accent set by the caller). */
  activeColor?: string;
}

/**
 * An iOS-style toggle we render ourselves so it looks identical on web and
 * device (the RN `Switch` ignores thumb/track colors on web). Off is a neutral
 * grey; on uses the caller's accent color with a white knob.
 */
export function ToggleSwitch({ value, onValueChange, activeColor = '#7C5CFC' }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={{
        width: 52,
        height: 32,
        borderRadius: 16,
        padding: 3,
        justifyContent: 'center',
        alignItems: value ? 'flex-end' : 'flex-start',
        backgroundColor: value ? activeColor : '#3A3A3E',
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: '#FFFFFF',
        }}
      />
    </Pressable>
  );
}
