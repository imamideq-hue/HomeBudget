import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  /** Earliest selectable day (inclusive). */
  minDate?: Date;
  /** Latest selectable day (inclusive). */
  maxDate?: Date;
}

/** Lightweight, dependency-free month calendar (works on web + native). */
export function Calendar({ value, onChange, minDate, maxDate }: Props) {
  const [view, setView] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isDisabled = (day: number) => {
    const t = startOfDay(new Date(year, month, day));
    if (minDate && t < startOfDay(minDate)) return true;
    if (maxDate && t > startOfDay(maxDate)) return true;
    return false;
  };

  const today = startOfDay(new Date());

  return (
    <View className="rounded-2xl bg-card p-3">
      {/* Month nav */}
      <View className="flex-row items-center justify-between px-1 pb-2">
        <Pressable
          onPress={() => setView(new Date(year, month - 1, 1))}
          hitSlop={8}
          className="h-8 w-8 items-center justify-center rounded-full bg-white active:opacity-70"
        >
          <Ionicons name="chevron-back" size={16} color="#7C5CFC" />
        </Pressable>
        <Text className="text-sm font-semibold text-surface-dark">
          {MONTHS[month]} {year}
        </Text>
        <Pressable
          onPress={() => setView(new Date(year, month + 1, 1))}
          hitSlop={8}
          className="h-8 w-8 items-center justify-center rounded-full bg-white active:opacity-70"
        >
          <Ionicons name="chevron-forward" size={16} color="#7C5CFC" />
        </Pressable>
      </View>

      {/* Weekday labels */}
      <View className="flex-row">
        {WEEKDAYS.map((w, i) => (
          <Text key={i} className="flex-1 text-center text-xs font-medium text-muted">
            {w}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View className="mt-1 flex-row flex-wrap">
        {cells.map((day, i) => {
          if (day === null) {
            return <View key={`b${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
          }
          const cellTime = startOfDay(new Date(year, month, day));
          const selected = cellTime === startOfDay(value);
          const isToday = cellTime === today;
          const disabled = isDisabled(day);
          return (
            <View
              key={`d${i}`}
              className="items-center justify-center"
              style={{ width: `${100 / 7}%`, aspectRatio: 1 }}
            >
              <Pressable
                disabled={disabled}
                onPress={() => onChange(new Date(year, month, day))}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={selected ? { backgroundColor: '#7C5CFC' } : undefined}
              >
                <Text
                  className={
                    selected
                      ? 'text-sm font-bold text-white'
                      : disabled
                        ? 'text-sm text-muted/40'
                        : isToday
                          ? 'text-sm font-bold text-primary'
                          : 'text-sm text-surface-dark'
                  }
                >
                  {day}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
