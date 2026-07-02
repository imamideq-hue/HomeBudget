import { Pressable, ScrollView, Text } from 'react-native';

import { useScope } from '@/context/ScopeContext';
import { useTheme } from '@/hooks/useTheme';
import { SCOPE_JOINT, type ScopeFilter as Scope } from '@/lib/scope';
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
  color: string;
}

/**
 * Switches whose finances are in view: Joint (shared) or You (personal).
 * Each section has its own color so the current selection is unmistakable.
 * On the Dashboard this also sets the default section for new entries.
 */
export function ScopeFilter({ users, currentUserId, variant = 'prominent' }: Props) {
  const { scope, setScope } = useScope();
  const { jointColor, accent } = useTheme();

  // Only "You" (this device's owner) has a personal section; everyone else
  // added to the household rolls into Joint.
  const me = users.find((u) => u.id === currentUserId);
  const chips: Chip[] = [
    { key: SCOPE_JOINT, label: 'Joint', color: jointColor },
    ...(me ? [{ key: me.id, label: 'You', color: me.color ?? accent }] : []),
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
              className={`rounded-2xl px-7 py-4 ${active ? '' : 'bg-card'}`}
              style={active ? { backgroundColor: chip.color } : undefined}
            >
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
            className={`rounded-full border px-3.5 py-2 ${active ? '' : 'border-transparent bg-card'}`}
            style={active ? { borderColor: chip.color, backgroundColor: `${chip.color}22` } : undefined}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: active ? chip.color : '#8A8A9E' }}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
