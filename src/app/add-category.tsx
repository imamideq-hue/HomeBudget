import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useCategories } from '@/hooks/useCategories';
import { feedbackSuccess } from '@/lib/feedback';
import type { TransactionType } from '@/models';

const ICONS = [
  'cart', 'restaurant', 'cafe', 'fast-food', 'pizza', 'beer', 'wine', 'nutrition',
  'car-sport', 'bus', 'airplane', 'bicycle', 'boat', 'train',
  'home', 'bed', 'flash', 'water', 'wifi', 'hammer', 'build', 'leaf',
  'game-controller', 'football', 'barbell', 'musical-notes', 'film', 'book', 'school',
  'medkit', 'fitness', 'heart', 'paw', 'gift', 'bag-handle', 'shirt',
  'cash', 'card', 'wallet', 'briefcase', 'phone-portrait', 'tv', 'cloud', 'ellipsis-horizontal',
];

const COLORS = [
  '#7C5CFC', '#5B3FD9', '#4DABF7', '#22B8CF', '#34C77B', '#82C91E',
  '#FFA94D', '#FF922B', '#FF6B6B', '#F783AC', '#845EF7', '#868E96',
];

export default function AddCategoryModal() {
  const router = useRouter();
  const {
    groupCategories,
    getSubCategory,
    getGroupForSub,
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
  } = useCategories();
  const params = useLocalSearchParams<{ groupId?: string; kind?: string; categoryId?: string }>();

  const editing = params.categoryId ? getSubCategory(params.categoryId) : undefined;

  // When editing, derive the kind from the category's current group.
  const kind: TransactionType = editing
    ? getGroupForSub(editing.id).kind
    : params.kind === 'income'
      ? 'income'
      : 'expense';
  const groupsForKind = useMemo(
    () => groupCategories.filter((g) => g.kind === kind),
    [groupCategories, kind],
  );

  const [name, setName] = useState(editing?.name ?? '');
  const [groupId, setGroupId] = useState<string>(
    editing?.groupId ?? params.groupId ?? groupsForKind[0]?.id ?? groupCategories[0]?.id ?? '',
  );
  const [icon, setIcon] = useState(editing?.icon ?? ICONS[0]);
  const [color, setColor] = useState(editing?.color ?? COLORS[0]);

  const canSave = name.trim().length > 0 && groupId.length > 0;

  const save = () => {
    if (!canSave) return;
    if (editing) {
      editSubCategory(editing.id, { groupId, name: name.trim(), icon, color });
    } else {
      addSubCategory({ groupId, name, icon, color });
    }
    feedbackSuccess();
    router.back();
  };

  const confirmDelete = () => {
    if (!editing) return;
    Alert.alert('Delete category', `Delete "${editing.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteSubCategory(editing.id);
          router.back();
        },
      },
    ]);
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
            {editing ? 'Edit category' : 'New category'}
          </Text>
          <View className="w-14" />
        </View>

        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
            {/* Preview + name */}
            <View className="items-center gap-3">
              <CategoryPill icon={icon} color={color} size={64} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Category name"
                placeholderTextColor="#C4C4D0"
                className="w-full rounded-2xl bg-card px-4 py-3 text-center text-lg font-semibold text-surface-dark"
              />
            </View>

            {/* Parent group */}
            {groupsForKind.length > 0 ? (
              <View>
                <Text className="mb-2 text-sm font-semibold text-surface-dark">Group</Text>
                <View className="flex-row flex-wrap gap-2">
                  {groupsForKind.map((g) => {
                    const selected = g.id === groupId;
                    return (
                      <Pressable
                        key={g.id}
                        onPress={() => setGroupId(g.id)}
                        className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                          selected ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
                        }`}
                      >
                        <Ionicons
                          name={g.icon as keyof typeof Ionicons.glyphMap}
                          size={16}
                          color={g.color}
                        />
                        <Text
                          className={`text-sm ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                        >
                          {g.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {/* Color */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Color</Text>
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

            {/* Icon */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-surface-dark">Icon</Text>
              <View className="flex-row flex-wrap gap-3">
                {ICONS.map((i) => {
                  const selected = i === icon;
                  return (
                    <Pressable
                      key={i}
                      onPress={() => setIcon(i)}
                      className={`h-11 w-11 items-center justify-center rounded-xl ${
                        selected ? 'bg-primary/15' : 'bg-card'
                      }`}
                      style={selected ? { borderWidth: 2, borderColor: color } : undefined}
                    >
                      <Ionicons
                        name={i as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={selected ? color : '#8A8A9E'}
                      />
                    </Pressable>
                  );
                })}
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
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text className="text-base font-semibold text-white">
                {editing ? 'Save changes' : 'Create category'}
              </Text>
            </Pressable>

            {/* Delete (edit mode) */}
            {editing ? (
              <Pressable
                onPress={confirmDelete}
                className="flex-row items-center justify-center gap-2 rounded-2xl border border-expense/40 py-4 active:opacity-70"
              >
                <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                <Text className="text-base font-semibold text-expense">Delete category</Text>
              </Pressable>
            ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
