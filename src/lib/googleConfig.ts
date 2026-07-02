/**
 * Google OAuth client IDs, read from public env vars at build time.
 * Create them in a Google Cloud project (APIs & Services → Credentials) and
 * set them via a .env file or your host's env. See the README.
 *
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
 *   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
 *   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
 */
export const GOOGLE_CLIENT_IDS = {
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

/** True once at least one client ID is configured. */
export const GOOGLE_CONFIGURED = Boolean(
  GOOGLE_CLIENT_IDS.web || GOOGLE_CLIENT_IDS.android || GOOGLE_CLIENT_IDS.ios,
);
