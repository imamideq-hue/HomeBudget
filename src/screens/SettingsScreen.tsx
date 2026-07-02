import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill } from '@/components/CategoryPill';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { useAuth } from '@/context/AuthContext';
import { useBudget } from '@/hooks/useBudget';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, SUPPORTED_CURRENCIES } from '@/lib/format';
import { GOOGLE_CONFIGURED } from '@/lib/googleConfig';
import { ACCENT_CHOICES } from '@/lib/theme';

const SETUP_MESSAGE =
  'Add your Google OAuth client IDs (EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, etc.) — see the README. Then this button will sign you in.';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  );
}

export function SettingsScreen() {
  const router = useRouter();
  const { currentSpace, allAccounts: accounts, accountBalance, setCurrency } = useBudget();
  const { user, signOut } = useAuth();
  const { accent, setAccent, isDark, setDark, foreground } = useTheme();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-12 pt-2">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <Ionicons name="chevron-back" size={26} color={foreground} />
          </Pressable>
          <Text className="text-3xl font-extrabold text-surface-dark">Settings</Text>
        </View>

        {/* Account / Google sign-in */}
        <Section title="Account">
          {user ? (
            <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4">
              {user.picture ? (
                <Image source={{ uri: user.picture }} className="h-11 w-11 rounded-full" />
              ) : (
                <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                  <Text className="text-base font-bold text-white">
                    {user.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-base font-semibold text-surface-dark">{user.name}</Text>
                {user.email ? (
                  <Text className="text-sm text-muted">{user.email}</Text>
                ) : null}
              </View>
              <Pressable onPress={signOut} hitSlop={8} className="active:opacity-60">
                <Text className="text-sm font-medium text-expense">Sign out</Text>
              </Pressable>
            </View>
          ) : GOOGLE_CONFIGURED ? (
            <GoogleSignInButton />
          ) : (
            <>
              <Pressable
                onPress={() => Alert.alert('Google sign-in needs setup', SETUP_MESSAGE)}
                className="flex-row items-center justify-center gap-2 rounded-2xl border border-black/10 bg-surface px-4 py-4 active:opacity-80"
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text className="text-base font-semibold text-surface-dark">
                  Sign in with Google
                </Text>
              </Pressable>
              <Text className="px-1 text-xs text-muted">
                Setup required — add Google OAuth client IDs (see README).
              </Text>
            </>
          )}
        </Section>

        {/* Space → manage members */}
        {currentSpace ? (
          <Pressable
            onPress={() => router.push('/manage-space')}
            className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4 active:opacity-70"
          >
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
              <Ionicons name="people" size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-surface-dark">
                {currentSpace.name}
              </Text>
              <Text className="text-sm text-muted">
                {currentSpace.members.length} member
                {currentSpace.members.length === 1 ? '' : 's'} · Manage members
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
          </Pressable>
        ) : null}

        {/* Accounts */}
        <Section title="Accounts">
          {accounts.map((acc) => (
            <Pressable
              key={acc.id}
              onPress={() => router.push({ pathname: '/account/[id]', params: { id: acc.id } })}
              className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3 active:opacity-70"
            >
              <CategoryPill icon={acc.icon} color={acc.color} size={36} />
              <Text className="flex-1 text-lg text-surface-dark">{acc.name}</Text>
              <Text className="text-sm font-semibold text-surface-dark">
                {formatCurrency(accountBalance(acc.id))}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
            </Pressable>
          ))}
          <Pressable
            onPress={() => router.push('/add-account')}
            className="flex-row items-center gap-3 rounded-2xl border border-dashed border-muted/40 px-4 py-3 active:opacity-70"
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="add" size={20} color={accent} />
            </View>
            <Text className="flex-1 text-base font-medium text-primary">Add account</Text>
          </Pressable>
        </Section>

        {/* Categories */}
        <Section title="Categories">
          <Pressable
            onPress={() => router.push('/categories')}
            className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4 active:opacity-70"
          >
            <Ionicons name="pricetag-outline" size={22} color={accent} />
            <Text className="flex-1 text-lg text-surface-dark">Manage categories</Text>
            <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
          </Pressable>
        </Section>

        {/* App */}
        <Section title="App">
          <Pressable
            onPress={() => router.push('/customize-dashboard')}
            className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4 active:opacity-70"
          >
            <Ionicons name="options-outline" size={22} color={accent} />
            <Text className="flex-1 text-lg text-surface-dark">Customize dashboard</Text>
            <Ionicons name="chevron-forward" size={16} color="#8A8A9E" />
          </Pressable>

          <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4">
            <Ionicons name="cloud-offline-outline" size={22} color={accent} />
            <Text className="flex-1 text-lg text-surface-dark">Sync</Text>
            <Text className="text-sm text-muted">Local only</Text>
          </View>

          {/* Dark mode */}
          <View className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-4">
            <Ionicons name={isDark ? 'moon' : 'moon-outline'} size={22} color={accent} />
            <Text className="flex-1 text-lg text-surface-dark">Dark mode</Text>
            <ToggleSwitch value={isDark} onValueChange={setDark} activeColor={accent} />
          </View>
          <View className="rounded-2xl bg-card px-4 py-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="cash-outline" size={22} color={accent} />
              <Text className="flex-1 text-lg text-surface-dark">Currency</Text>
            </View>
            <View className="mt-3 flex-row gap-2">
              {SUPPORTED_CURRENCIES.map((c) => {
                const selected = currentSpace?.currency === c.code;
                return (
                  <Pressable
                    key={c.code}
                    onPress={() => setCurrency(c.code)}
                    className={`flex-1 flex-row items-center justify-center gap-1 rounded-xl border py-2 ${
                      selected ? 'border-primary bg-primary/10' : 'border-transparent bg-surface'
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${selected ? 'text-surface-dark' : 'text-muted'}`}
                    >
                      {c.symbol}
                    </Text>
                    <Text className={`text-sm ${selected ? 'text-surface-dark' : 'text-muted'}`}>
                      {c.code}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Accent color */}
          <View className="rounded-2xl bg-card px-4 py-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="color-palette-outline" size={22} color={accent} />
              <Text className="flex-1 text-lg text-surface-dark">Accent color</Text>
            </View>
            <View className="mt-3 flex-row flex-wrap gap-3">
              {ACCENT_CHOICES.map((c) => {
                const selected = accent.toLowerCase() === c.toLowerCase();
                return (
                  <Pressable
                    key={c}
                    onPress={() => setAccent(c)}
                    hitSlop={4}
                    accessibilityRole="button"
                    accessibilityLabel={`Accent ${c}`}
                    className="h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: c,
                      borderWidth: selected ? 3 : 0,
                      borderColor: '#FFFFFF',
                    }}
                  >
                    {selected ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Section>

        <Text className="mt-2 text-center text-xs text-muted">
          HomeBudget · Cashew-inspired shared budgets
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
