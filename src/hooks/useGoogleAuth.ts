import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { GOOGLE_CLIENT_IDS } from '@/lib/googleConfig';

// Dismisses the auth popup/redirect when it returns.
WebBrowser.maybeCompleteAuthSession();

/**
 * Google sign-in via expo-auth-session. Only call this when Google is
 * configured (GOOGLE_CONFIGURED) — Google.useAuthRequest requires a client id.
 * On success it stores the Google profile via AuthContext.
 */
export function useGoogleAuth() {
  const { signIn } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CLIENT_IDS.web,
    androidClientId: GOOGLE_CLIENT_IDS.android,
    iosClientId: GOOGLE_CLIENT_IDS.ios,
  });

  useEffect(() => {
    const token =
      response?.type === 'success' ? response.authentication?.accessToken : undefined;
    if (!token) return;
    fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((p: { name?: string; email?: string; picture?: string }) =>
        signIn({ name: p.name ?? 'Google account', email: p.email, picture: p.picture }),
      )
      .catch(() => {});
  }, [response, signIn]);

  return {
    ready: !!request,
    signInWithGoogle: () => promptAsync(),
  };
}
