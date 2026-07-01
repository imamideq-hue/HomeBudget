import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  size?: number;
  stroke?: number;
  centerLabel?: string;
  centerValue?: string;
}

/** Minimal ring/donut chart (dependency-light, works on web + native). */
export function DonutChart({ data, size = 168, stroke = 20, centerLabel, centerValue }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gap = 0.012 * c; // tiny separation between slices

  let acc = 0;
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#8A8A9E"
          strokeOpacity={0.15}
          strokeWidth={stroke}
          fill="none"
        />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = Math.max(frac * c - gap, 0.0001);
          const rot = acc * 360 - 90;
          acc += frac;
          return (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={d.color}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              transform={`rotate(${rot} ${size / 2} ${size / 2})`}
            />
          );
        })}
      </Svg>
      <View className="items-center">
        {centerLabel ? <Text className="text-xs text-muted">{centerLabel}</Text> : null}
        {centerValue ? (
          <Text className="text-xl font-bold text-surface-dark">{centerValue}</Text>
        ) : null}
      </View>
    </View>
  );
}
