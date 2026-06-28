import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

/**
 * Renders the Google sign-in button. Mount this only when Google is configured
 * (it holds the auth request hook, which needs a client id).
 */
export function GoogleSignInButton() {
  const { signInWithGoogle } = useGoogleAuth();
  return (
    <Pressable
      onPress={signInWithGoogle}
      className="flex-row items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-4 active:opacity-80"
    >
      <Ionicons name="logo-google" size={18} color="#EA4335" />
      <Text className="text-base font-semibold text-surface-dark">Sign in with Google</Text>
    </Pressable>
  );
}
