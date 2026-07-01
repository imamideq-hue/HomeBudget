import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { PressableScale } from '@/components/motion';
import type { GroupBudgetSummary } from '@/lib/budget';
import { formatCurrency } from '@/lib/format';

const SIZE = 96;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Cashew-style circular budget progress ring with the category icon centered. */
export function BudgetRing({
  budget,
  onPress,
}: {
  budget: GroupBudgetSummary;
  onPress?: () => void;
}) {
  const pct = Math.min(budget.percentUsed, 1);
  const color = budget.isOverBudget ? '#FF6B6B' : budget.group.color;
  const dashOffset = CIRCUMFERENCE * (1 - pct);

  return (
    <PressableScale onPress={onPress} className="w-28 items-center gap-2">
      <View style={{ width: SIZE, height: SIZE }} className="items-center justify-center">
        <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#8A8A9E"
            strokeOpacity={0.15}
            strokeWidth={STROKE}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <Ionicons
          name={budget.group.icon as keyof typeof Ionicons.glyphMap}
          size={26}
          color={color}
        />
      </View>

      <Text numberOfLines={1} className="text-sm font-medium text-surface-dark">
        {budget.group.name}
      </Text>
      <Text
        numberOfLines={1}
        className={`text-xs ${budget.isOverBudget ? 'text-expense' : 'text-muted'}`}
      >
        {formatCurrency(budget.totalSpent)} / {formatCurrency(budget.budgetLimit)}
      </Text>
    </PressableScale>
  );
}
