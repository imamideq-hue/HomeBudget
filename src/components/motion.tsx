import { cssInterop } from 'nativewind';
import { forwardRef } from 'react';
import { Pressable, type PressableProps, type View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// Let NativeWind's `className` flow into these animated components' styles.
cssInterop(Animated.View, { className: 'style' });
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
cssInterop(AnimatedPressable, { className: 'style' });

/** `Animated.View` with `className` support — use with `entering`/`layout`. */
export const MotionView = Animated.View;

const SPRING = { damping: 18, stiffness: 320, mass: 0.5 };

interface PressableScaleProps extends PressableProps {
  className?: string;
  /** How far to shrink while pressed. */
  scaleTo?: number;
}

/** A Pressable that springs down slightly while pressed for tactile feedback. */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  { scaleTo = 0.95, onPressIn, onPressOut, style, ...rest },
  ref,
) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      ref={ref}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, SPRING);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING);
        onPressOut?.(e);
      }}
      {...rest}
    />
  );
});
