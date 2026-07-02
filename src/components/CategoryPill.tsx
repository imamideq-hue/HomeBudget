import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

/** Small colored icon chip used in lists, pickers and budget rows. */
export function CategoryPill({
  icon,
  color,
  size = 40,
}: {
  icon: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.32),
        backgroundColor: `${color}22`,
      }}
    >
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size * 0.5} color={color} />
    </View>
  );
}
