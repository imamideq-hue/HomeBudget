import { Pressable, ScrollView, Text, View } from 'react-native';

import { useScope } from '@/context/ScopeContext';
import { useTheme } from '@/hooks/useTheme';
import { SCOPE_ALL, SCOPE_JOINT, type ScopeFilter as Scope } from '@/lib/scope';
import type { User } from '@/models';

interface Props {
  users: User[];
  currentUserId: string;
  /** `prominent` renders big segmented buttons (used on the Dashboard). */
  variant?: 'chips' | 'prominent';
}

interface Chip {
  key: Scope;
  label: string;
  color?: string;
}

/**
 * Switches whose finances are in view: Everyone, Joint, or a specific person.
 * On the Dashboard this also sets the default section for new entries, so Joint
 * and personal money stay separate in one app.
 */
export function ScopeFilter({ users, currentUserId, variant = 'chips' }: Props) {
  const { scope, setScope } = useScope();
  const { accent } = useTheme();

  const chips: Chip[] = [
    { key: SCOPE_ALL, label: 'Everyone' },
    { key: SCOPE_JOINT, label: 'Joint' },
    ...users.map((u) => ({
      key: u.id,
      label: u.id === currentUserId ? 'You' : u.name,
      // "You" follows the app accent; other people keep their own color.
      color: u.id === currentUserId ? accent : u.color,
    })),
  ];

  if (variant === 'prominent') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-1"
      >
        {chips.map((chip) => {
          const active = scope === chip.key;
          return (
            <Pressable
              key={chip.key}
              onPress={() => setScope(chip.key)}
              className={`flex-row items-center gap-2 rounded-2xl px-5 py-3 ${
                active ? 'bg-primary shadow-sm' : 'bg-card'
              }`}
            >
              {chip.color ? (
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: active ? '#FFFFFF' : chip.color }}
                />
              ) : null}
              <Text
                className={`text-base font-bold ${active ? 'text-white' : 'text-surface-dark'}`}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
          <Pressable
            key={chip.key}
            onPress={() => setScope(chip.key)}
            className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
              active ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
            }`}
          >
            {chip.color ? (
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: chip.color }}
              />
            ) : null}
            <Text
              className={`text-sm ${
                active ? 'font-semibold text-primary' : 'text-muted'
              }`}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
