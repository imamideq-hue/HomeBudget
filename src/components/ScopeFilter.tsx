import { ScrollView, Text, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { useScope } from '@/context/ScopeContext';
import { useTheme } from '@/hooks/useTheme';
import { feedbackTap } from '@/lib/feedback';
import { SCOPE_ALL, SCOPE_JOINT, type ScopeFilter as Scope } from '@/lib/scope';
import type { User } from '@/models';

interface Props {
  users: User[];
  currentUserId: string;
  /** `prominent` renders a big full-width segmented control (Dashboard). */
  variant?: 'chips' | 'prominent';
}

interface Chip {
  key: Scope;
  label: string;
  color?: string;
}

/**
 * Switches whose finances are in view: Everyone, Joint, or You. On the Dashboard
 * this also sets the default section for new entries.
 */
export function ScopeFilter({ users, currentUserId, variant = 'chips' }: Props) {
  const { scope, setScope } = useScope();
  const { accent } = useTheme();

  const me = users.find((u) => u.id === currentUserId);
  const chips: Chip[] = [
    { key: SCOPE_ALL, label: 'Everyone' },
    { key: SCOPE_JOINT, label: 'Joint' },
    ...(me ? [{ key: me.id, label: 'You', color: accent }] : []),
  ];

  const select = (key: Scope) => {
    if (key !== scope) feedbackTap();
    setScope(key);
  };

  if (variant === 'prominent') {
    return (
      <View className="flex-row gap-2">
        {chips.map((chip) => {
          const active = scope === chip.key;
          return (
            <PressableScale
              key={chip.key}
              onPress={() => select(chip.key)}
              className={`flex-1 items-center justify-center rounded-2xl py-3.5 ${
                active ? 'bg-primary' : 'bg-card'
              }`}
            >
              <Text
                className={`text-base font-bold ${active ? 'text-white' : 'text-surface-dark'}`}
              >
                {chip.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pr-2"
    >
      {chips.map((chip) => {
        const active = scope === chip.key;
        return (
          <PressableScale
            key={chip.key}
            onPress={() => select(chip.key)}
            className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
              active ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
            }`}
          >
            {chip.color ? (
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chip.color }} />
            ) : null}
            <Text className={`text-sm ${active ? 'font-semibold text-primary' : 'text-muted'}`}>
              {chip.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
