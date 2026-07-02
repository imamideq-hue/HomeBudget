import { ScrollView, Text } from 'react-native';

import { GlassButton } from '@/components/GlassButton';
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
            <GlassButton
              key={chip.key}
              onPress={() => setScope(chip.key)}
              tint={active ? chip.color : undefined}
              intensity={active ? 45 : 22}
              className="rounded-2xl px-7 py-4"
            >
              <Text
                className={`text-lg font-bold ${active ? 'text-white' : 'text-surface-dark'}`}
              >
                {chip.label}
              </Text>
            </GlassButton>
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
          <GlassButton
            key={chip.key}
            onPress={() => setScope(chip.key)}
            tint={active ? chip.color : undefined}
            intensity={active ? 40 : 20}
            className="rounded-full px-3.5 py-2"
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: active ? '#FFFFFF' : '#8A8A9E' }}
            >
              {chip.label}
            </Text>
          </GlassButton>
        );
      })}
    </ScrollView>
  );
}
