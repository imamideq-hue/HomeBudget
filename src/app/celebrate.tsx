import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { feedbackCelebrate } from '@/lib/feedback';

const CONFETTI_COLORS = ['#7C5CFC', '#4DABF7', '#34C77B', '#FFA94D', '#FF6B6B', '#F783AC'];
const { width, height } = Dimensions.get('window');

function ConfettiPiece({ index }: { index: number }) {
  const fall = useRef(new Animated.Value(0)).current;
  const startX = useMemo(() => Math.random() * width, []);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = useMemo(() => 8 + Math.random() * 8, []);
  const delay = useMemo(() => Math.random() * 600, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 120, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(fall, {
        toValue: 1,
        duration: 2200 + Math.random() * 1200,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [fall, delay]);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [-40, height + 40] });
  const translateX = fall.interpolate({ inputRange: [0, 1], outputRange: [0, drift] });
  const rotate = fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: startX,
        width: size,
        height: size * 1.4,
        borderRadius: 2,
        backgroundColor: color,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  );
}

export default function CelebrateModal() {
  const router = useRouter();
  const { accent } = useTheme();
  const { title, subtitle } = useLocalSearchParams<{ title?: string; subtitle?: string }>();

  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    feedbackCelebrate();
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [pop]);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      {/* Confetti */}
      {Array.from({ length: 28 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          style={{ transform: [{ scale: pop }] }}
          className="items-center gap-5"
        >
          <View
            className="h-28 w-28 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent}22` }}
          >
            <Ionicons name="trophy" size={60} color={accent} />
          </View>
          <Text className="text-3xl font-extrabold text-surface-dark">
            {title ?? 'Congrats! 🎉'}
          </Text>
          {subtitle ? (
            <Text className="text-center text-base text-muted">{subtitle}</Text>
          ) : null}
        </Animated.View>
      </View>

      <View className="px-5 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 active:opacity-80"
        >
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
          <Text className="text-base font-semibold text-white">Nice!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
