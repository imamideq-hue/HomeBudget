import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { Category } from '@/lib/types';

/** Small colored icon chip used in lists and budget rows. */
export function CategoryPill({ category, size = 40 }: { category: Category; size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: `${category.color}22` }}
    >
      <Ionicons
        name={category.icon as keyof typeof Ionicons.glyphMap}
        size={size * 0.5}
        color={category.color}
      />
    </View>
  );
}

export function CategoryLabel({ category }: { category: Category }) {
  return <Text className="text-base font-medium text-surface-dark">{category.name}</Text>;
}
