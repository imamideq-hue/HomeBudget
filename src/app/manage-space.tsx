import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBudget } from '@/hooks/useBudget';
import { useTheme } from '@/hooks/useTheme';
import { feedbackTap } from '@/lib/feedback';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function ManageSpaceModal() {
  const router = useRouter();
  const { users, currentUser, currentSpace, removeMember, renameUser } = useBudget();
  const { accent } = useTheme();

  const [myName, setMyName] = useState(currentUser?.name ?? 'You');

  const commitName = () => {
    if (currentUser) renameUser(currentUser.id, myName);
  };

  const confirmRemove = (userId: string, name: string) => {
    Alert.alert('Remove member', `Remove ${name} from ${currentSpace?.name ?? 'this space'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          feedbackTap();
          removeMember(userId);
        },
      },
    ]);
  };

  const others = users.filter((u) => u.id !== currentUser?.id);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Done</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">
            {currentSpace?.name ?? 'Household'}
          </Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Your profile (rename) */}
          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-muted">You</Text>
            <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3">
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: accent }}
              >
                <Text className="text-base font-bold text-white">{initials(myName)}</Text>
              </View>
              <TextInput
                value={myName}
                onChangeText={setMyName}
                onEndEditing={commitName}
                onBlur={commitName}
                placeholder="Your name"
                placeholderTextColor="#C4C4D0"
                className="flex-1 text-base font-semibold text-surface-dark"
              />
              <Ionicons name="create-outline" size={18} color="#8A8A9E" />
            </View>
            <Text className="px-1 text-xs text-muted">
              This is your personal section on the dashboard.
            </Text>
          </View>

          {/* Other members */}
          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-muted">
              Household members
            </Text>
            {others.length > 0 ? (
              others.map((u) => (
                <View
                  key={u.id}
                  className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3"
                >
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/add-member', params: { memberId: u.id } })
                    }
                    className="flex-1 flex-row items-center gap-3 active:opacity-70"
                  >
                    <View
                      className="h-11 w-11 items-center justify-center rounded-full"
                      style={{ backgroundColor: u.color }}
                    >
                      <Text className="text-base font-bold text-white">{initials(u.name)}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-surface-dark">{u.name}</Text>
                      {u.email ? <Text className="text-sm text-muted">{u.email}</Text> : null}
                    </View>
                    <Ionicons name="create-outline" size={16} color="#8A8A9E" />
                  </Pressable>
                  <Pressable
                    onPress={() => confirmRemove(u.id, u.name)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${u.name}`}
                    className="h-9 w-9 items-center justify-center rounded-full bg-expense/10 active:opacity-70"
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </Pressable>
                </View>
              ))
            ) : (
              <Text className="px-1 text-sm text-muted">
                No other members yet. Everyone you add shares the Joint section.
              </Text>
            )}
          </View>

          {/* Add member */}
          <Pressable
            onPress={() => router.push('/add-member')}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 active:opacity-80"
          >
            <Ionicons name="person-add" size={18} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">Add a member</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
