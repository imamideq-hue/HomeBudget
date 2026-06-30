import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useScope } from '@/context/ScopeContext';
import { useBudget } from '@/hooks/useBudget';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import { getCurrency } from '@/lib/format';
import { defaultOwnerForScope } from '@/lib/scope';

const ICONS = [
  'airplane', 'shield-checkmark', 'laptop', 'home', 'car-sport', 'gift',
  'school', 'heart', 'cash', 'wallet', 'bicycle', 'boat', 'fitness',
  'game-controller', 'camera', 'paw', 'phone-portrait', 'star',
];

export default function AddGoalModal() {
  const router = useRouter();
  const { addGoal, editGoal, deleteGoal, getGoal } = useGoals();
  const { users, currentUser } = useBudget();
  const { scope } = useScope();
  const { accent } = useTheme();

  const params = useLocalSearchParams<{ goalId?: string }>();
  const editing = params.goalId ? getGoal(params.goalId) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [target, setTarget] = useState(editing ? String(editing.targetAmount) : '');
  const [icon, setIcon] = useState(editing?.icon ?? ICONS[0]);
  // Goals follow the app accent theme, so there's no per-goal color picker.
  // Defaults to the section in view on the Dashboard (undefined = Joint).
  const [ownerId, setOwnerId] = useState<string | undefined>(
    editing ? editing.ownerId : defaultOwnerForScope(scope),
  );

  const targetAmount = useMemo(() => {
    const n = parseFloat(target.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [target]);

  const canSave = name.trim().length > 0 && targetAmount > 0;

  const save = () => {
    if (!canSave) return;
    if (editing) {
      editGoal(editing.id, { name: name.trim(), targetAmount, icon, color: accent, ownerId });
    } else {
      addGoal({ name, targetAmount, icon, color: accent, ownerId });
    }
    router.back();
  };

  const confirmDelete = () => {
    if (!editing) return;
    Alert.alert('Delete goal', `Delete "${editing.name}" and its contribution history?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteGoal(editing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">
            {editing ? 'Edit goal' : 'New goal'}
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
            <CategoryPill icon={icon} color={accent} size={64} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Goal name"
              placeholderTextColor="#C4C4D0"
              className="w-full rounded-2xl bg-card px-4 py-3 text-center text-lg font-semibold text-surface-dark"
            />
          </View>

          {/* Target amount */}
          <View className="items-center">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              Target ({getCurrency()})
            </Text>
            <TextInput
              value={target}
              onChangeText={setTarget}
              placeholder="0.00"
              placeholderTextColor="#C4C4D0"
              keyboardType="decimal-pad"
              className="text-center text-5xl font-bold text-surface-dark"
            />
          </View>

          {/* Owner: Joint or a specific person */}
          <View>
            <Text className="mb-2 text-sm font-semibold text-surface-dark">Belongs to</Text>
            <View className="flex-row flex-wrap gap-2">
              {[{ id: undefined, name: 'Joint', color: accent }, ...users].map((owner) => {
                const selected = ownerId === owner.id;
                const label = owner.id && owner.id === currentUser?.id ? 'You' : owner.name;
                return (
                  <Pressable
                    key={owner.id ?? 'joint'}
                    onPress={() => setOwnerId(owner.id)}
                    className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                      selected ? 'border-primary bg-primary/10' : 'border-transparent bg-card'
                    }`}
                  >
                    {owner.id ? (
                      <View
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: owner.color }}
                      />
                    ) : (
                      <Ionicons name="people" size={14} color={accent} />
                    )}
                    <Text
                      className={`text-sm ${selected ? 'font-semibold text-surface-dark' : 'text-muted'}`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
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
                    style={selected ? { borderWidth: 2, borderColor: accent } : undefined}
                  >
                    <Ionicons
                      name={i as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={selected ? accent : '#8A8A9E'}
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
            <Ionicons name={editing ? 'checkmark' : 'flag'} size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">
              {editing ? 'Save changes' : 'Create goal'}
            </Text>
          </Pressable>

          {/* Delete (edit mode only) */}
          {editing ? (
            <Pressable
              onPress={confirmDelete}
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-expense/40 py-4 active:opacity-70"
            >
              <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
              <Text className="text-base font-semibold text-expense">Delete goal</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
