import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useBudget } from '@/hooks/useBudget';
import { useGoals } from '@/hooks/useGoals';
import { getCurrency } from '@/lib/format';

const ICONS = [
  'airplane', 'shield-checkmark', 'laptop', 'home', 'car-sport', 'gift',
  'school', 'heart', 'cash', 'wallet', 'bicycle', 'boat', 'fitness',
  'game-controller', 'camera', 'paw', 'phone-portrait', 'star',
];

const COLORS = [
  '#22B8CF', '#7C5CFC', '#FFA94D', '#34C77B', '#FF6B6B', '#F783AC',
  '#4DABF7', '#82C91E', '#845EF7', '#FF922B', '#20C997', '#868E96',
];

export default function AddGoalModal() {
  const router = useRouter();
  const { addGoal } = useGoals();
  const { users, currentUser } = useBudget();

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined); // undefined = Joint

  const targetAmount = useMemo(() => {
    const n = parseFloat(target.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [target]);

  const canSave = name.trim().length > 0 && targetAmount > 0;

  const save = () => {
    if (!canSave) return;
    addGoal({ name, targetAmount, icon, color, ownerId });
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Text className="text-base text-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-surface-dark">New goal</Text>
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
              {[{ id: undefined, name: 'Joint', color: '#7C5CFC' }, ...users].map((owner) => {
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
                      <Ionicons name="people" size={14} color="#7C5CFC" />
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
            <Ionicons name="flag" size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">Create goal</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
