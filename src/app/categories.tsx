import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { useCategories } from '@/hooks/useCategories';

export default function CategoriesScreen() {
  const router = useRouter();
  const { groupCategories, getSubsForGroup } = useCategories();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Ionicons name="chevron-back" size={24} color="#15151B" />
          </Pressable>
          <Text className="text-lg font-semibold text-surface-dark">Categories</Text>
        </View>
        <Pressable
          onPress={() => router.push('/add-category')}
          hitSlop={8}
          className="flex-row items-center gap-1 rounded-full bg-primary px-3 py-2 active:opacity-80"
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text className="text-sm font-semibold text-white">New</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="gap-5 px-5 pb-12 pt-2">
        <Text className="text-sm text-muted">Tap a category to edit it.</Text>

        {groupCategories.map((group) => {
          const subs = getSubsForGroup(group.id);
          if (subs.length === 0) return null;
          return (
            <View key={group.id} className="gap-2">
              <Text className="text-xs font-semibold uppercase tracking-wide text-muted">
                {group.name}
              </Text>
              {subs.map((sub) => (
                <Pressable
                  key={sub.id}
                  onPress={() =>
                    router.push({ pathname: '/add-category', params: { categoryId: sub.id } })
                  }
                  className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3 active:opacity-70"
                >
                  <CategoryPill icon={sub.icon ?? group.icon} color={sub.color ?? group.color} size={36} />
                  <Text className="flex-1 text-base text-surface-dark">{sub.name}</Text>
                  <Ionicons name="create-outline" size={18} color="#8A8A9E" />
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
