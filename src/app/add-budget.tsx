import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useCategories } from '@/hooks/useCategories';
import { feedbackSuccess } from '@/lib/feedback';
import { getCurrency } from '@/lib/format';

const ICONS = [
  'wallet', 'cart', 'restaurant', 'cafe', 'car-sport', 'home', 'flash', 'wifi',
  'game-controller', 'film', 'barbell', 'medkit', 'gift', 'bag-handle', 'shirt',
  'airplane', 'paw', 'school', 'card', 'phone-portrait', 'tv', 'ellipsis-horizontal',
];

const COLORS = [
  '#7C5CFC', '#4DABF7', '#22B8CF', '#34C77B', '#82C91E', '#FFA94D',
  '#FF922B', '#FF6B6B', '#F783AC', '#845EF7', '#20C997', '#868E96',
];

export default function AddBudgetModal() {
  const router = useRouter();
  const { addGroupCategory, addSubCategory } = useCategories();

  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const budgetLimit = useMemo(() => {
    const n = parseFloat(limit.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [limit]);

  const canSave = name.trim().length > 0 && budgetLimit > 0;

  const save = () => {
    if (!canSave) return;
    // A custom budget is a new expense group with a limit; we also create a
    // matching sub-category so transactions can be filed under it.
    const group = addGroupCategory({ name, icon, color, kind: 'expense', budgetLimit });
    addSubCategory({ groupId: group.id, name: name.trim(), icon, color });
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
          <Text className="text-base font-semibold text-surface-dark">New budget</Text>
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
              placeholder="Budget name"
              placeholderTextColor="#C4C4D0"
              className="w-full rounded-2xl bg-card px-4 py-3 text-center text-lg font-semibold text-surface-dark"
            />
          </View>

          {/* Monthly limit */}
          <View className="items-center">
            <Text className="mb-1 text-xs uppercase tracking-wide text-muted">
              Monthly limit ({getCurrency()})
            </Text>
            <TextInput
              value={limit}
              onChangeText={setLimit}
              placeholder="0.00"
              placeholderTextColor="#C4C4D0"
              keyboardType="decimal-pad"
              className="text-center text-5xl font-bold text-surface-dark"
            />
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
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text className="text-base font-semibold text-white">Create budget</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
