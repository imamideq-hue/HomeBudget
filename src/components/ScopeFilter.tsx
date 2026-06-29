import { Pressable, ScrollView, Text, View } from 'react-native';

import { useScope } from '@/context/ScopeContext';
import { SCOPE_ALL, SCOPE_JOINT, type ScopeFilter as Scope } from '@/lib/scope';
import type { User } from '@/models';

interface Props {
  users: User[];
  currentUserId: string;
}

interface Chip {
  key: Scope;
  label: string;
  color?: string;
}

/**
 * Row of chips that switches whose finances are in view: Everyone, Joint, or a
 * specific person. Lets joint and personal money stay separate in one app.
 */
export function ScopeFilter({ users, currentUserId }: Props) {
  const { scope, setScope } = useScope();

  const chips: Chip[] = [
    { key: SCOPE_ALL, label: 'Everyone' },
    { key: SCOPE_JOINT, label: 'Joint' },
    ...users.map((u) => ({
      key: u.id,
      label: u.id === currentUserId ? 'You' : u.name,
      color: u.color,
    })),
  ];

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
