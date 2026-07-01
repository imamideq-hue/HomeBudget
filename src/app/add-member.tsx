import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBudget } from '@/hooks/useBudget';
import { feedbackSuccess } from '@/lib/feedback';

const COLORS = [
  '#7C5CFC', '#34C77B', '#4DABF7', '#FF6B6B', '#FFA94D', '#F783AC',
  '#22B8CF', '#82C91E', '#845EF7', '#FF922B', '#20C997', '#868E96',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function AddMemberModal() {
  const router = useRouter();
  const { currentSpace, users, addMember, editUser } = useBudget();

  const params = useLocalSearchParams<{ memberId?: string }>();
  const editing = params.memberId ? users.find((u) => u.id === params.memberId) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [email, setEmail] = useState(editing?.email ?? '');
  const [color, setColor] = useState(editing?.color ?? COLORS[0]);

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    if (editing) {
      editUser(editing.id, { name: name.trim(), email: email.trim() || undefined, color });
    } else {
      addMember({ name, email, color });
    }
    feedbackSuccess();
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">
            {editing ? 'Edit member' : 'Add member'}
          </Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
            {/* Avatar preview */}
            <View className="items-center gap-2">
              <View
                className="h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <Text className="text-2xl font-bold text-white">
                  {initials(name || '?')}
                </Text>
              </View>
              {currentSpace ? (
                <Text className="text-sm text-muted">Joining {currentSpace.name}</Text>
              ) : null}
            </View>

            {/* Name */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Jordan"
                placeholderTextColor="#C4C4D0"
                className="rounded-2xl bg-card px-4 py-3 text-base text-surface-dark"
              />
            </View>

            {/* Email (optional) */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Email (optional)</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#C4C4D0"
                autoCapitalize="none"
                keyboardType="email-address"
                className="rounded-2xl bg-card px-4 py-3 text-base text-surface-dark"
              />
            </View>

            {/* Color */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Avatar color</Text>
              <View className="flex-row flex-wrap gap-3">
                {COLORS.map((c) => (
                  <Pressable key={c} onPress={() => setColor(c)} hitSlop={4}>
                    <View
                      className="h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: c }}
                    >
                      {c === color ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Save */}
            <Pressable
              onPress={save}
              disabled={!canSave}
              className={`mt-2 flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
                canSave ? 'bg-primary active:opacity-80' : 'bg-primary/40'
              }`}
            >
              <Ionicons name={editing ? 'checkmark' : 'person-add'} size={20} color="#FFFFFF" />
              <Text className="text-base font-semibold text-white">
                {editing ? 'Save changes' : 'Add member'}
              </Text>
            </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
