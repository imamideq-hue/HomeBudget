import { Pressable, ScrollView, Text, View } from 'react-native';

import { useScope } from '@/context/ScopeContext';
import { useTheme } from '@/hooks/useTheme';
import { SCOPE_ALL, SCOPE_JOINT, type ScopeFilter as Scope } from '@/lib/scope';
import type { User } from '@/models';

interface Props {
  users: User[];
  currentUserId: string;
  /** `prominent` (default) renders big segmented buttons; `chips` is compact. */
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
export function ScopeFilter({ users, currentUserId, variant = 'prominent' }: Props) {
  const { scope, setScope } = useScope();
  const { accent } = useTheme();

  // Only "You" (this device's owner) has a personal section; everyone else
  // added to the household rolls into Joint.
  const me = users.find((u) => u.id === currentUserId);
  const chips: Chip[] = [
    { key: SCOPE_ALL, label: 'Everyone' },
    { key: SCOPE_JOINT, label: 'Joint' },
    ...(me ? [{ key: me.id, label: 'You', color: accent }] : []),
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
              className={`flex-row items-center gap-2 rounded-2xl px-7 py-4 ${
                active ? 'bg-primary shadow-sm' : 'bg-card'
              }`}
            >
              {chip.color ? (
                <View
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: active ? '#FFFFFF' : chip.color }}
                />
              ) : null}
              <Text
                className={`text-lg font-bold ${active ? 'text-white' : 'text-surface-dark'}`}
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
