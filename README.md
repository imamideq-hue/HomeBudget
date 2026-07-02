# HomeBudget

A shared budget tracking app inspired by [Cashew](https://cashewapp.web.app/), built with
**React Native (Expo)**, **Expo Router**, **TypeScript**, and **NativeWind** (Tailwind for
React Native).

> Current status: **working web app**. Dashboard with budget rings, transaction entry,
> month-scoped budgets (with editing), account details, and savings goals — all running on
> seeded local data (React Context + AsyncStorage). Real multi-user sync/auth is deferred;
> native iOS/Android come later from this same codebase.

## Getting started

```bash
npm install
npm start          # Expo dev server (press w for web, i / a for simulators)
# or target a platform directly:
npm run web
npm run ios
npm run android
```

## Deploying the web app (Vercel)

The web build is a single-page app (`web.output: "single"` in `app.json`), and
`vercel.json` is preconfigured:

- **Build command:** `npx expo export --platform web` (also `npm run build:web`)
- **Output directory:** `dist`
- **Rewrites:** all paths → `/` so client-side deep links (e.g. `/account/123`) work

To go live:

```bash
# one-time
npm i -g vercel

# from the repo root
vercel          # preview deploy → gives you a URL
vercel --prod   # production deploy
```

Or connect the GitHub repo at vercel.com → "New Project" and it picks up
`vercel.json` automatically; every push then publishes a deploy.

To preview the production build locally:

```bash
npm run build:web
npx serve dist   # or any static file server
```

## Mobile app (iOS / Android) — same codebase, later

This is one Expo codebase: the same screens/logic that run on web compile to
native iOS and Android with no rewrite. When we're ready:

```bash
npx expo run:ios       # local dev build (needs macOS/Xcode)
npx expo run:android   # local dev build (needs Android SDK)
# or cloud builds + store submission via EAS:
npx eas build --platform ios
npx eas build --platform android
```

## Sign in with Google (optional)

The Settings → Account section has a **Sign in with Google** button. It's
gated behind config: until you add Google OAuth client IDs it shows a
"Setup required" hint and doesn't attempt the flow.

To enable it:

1. In the [Google Cloud Console](https://console.cloud.google.com) → **APIs &
   Services → Credentials**, create OAuth client IDs (a **Web** client, and
   **Android**/**iOS** clients if you build those). Register the redirect URIs
   Expo prints (and the app scheme `homebudget://` for native).
2. Copy `.env.example` to `.env` and fill in:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
   ```
3. Rebuild. The button now runs the Google flow (`expo-auth-session`) and
   stores the profile locally.

> Note: this is **identity only** — it signs you in but budget data still lives
> locally per device. Real shared/synced budgets need a backend (e.g. Supabase
> or Firebase); Google sign-in is the first piece of that.

## Tech stack

| Concern      | Choice                                             |
| ------------ | -------------------------------------------------- |
| Framework    | Expo (SDK 56) + Expo Router (file-based routing)   |
| Language     | TypeScript                                         |
| Styling      | NativeWind v4 (Tailwind CSS)                        |
| State        | React Context + `useReducer`                       |
| Persistence  | `@react-native-async-storage/async-storage` (local)|
| Charts       | `react-native-gifted-charts` + `react-native-svg`  |
| Icons        | `@expo/vector-icons` (Ionicons)                    |

## Project structure

```
src/
  app/                  # Expo Router routes (navigation only)
    _layout.tsx         # Root: providers (Budget, SafeArea, GestureHandler) + global.css
    (tabs)/
      _layout.tsx       # Bottom tab navigator (Overview, Activity, Budgets, Settings)
      index.tsx         # -> OverviewScreen
      transactions.tsx  # -> TransactionsScreen
      budgets.tsx       # -> BudgetsScreen
      settings.tsx      # -> SettingsScreen
  screens/              # Screen-level UI (one component per tab)
  components/           # Reusable UI: BalanceCard, TransactionItem, CategoryPill
  context/              # BudgetContext — reducer + AsyncStorage persistence
  hooks/                # useBudget (store + derived totals), theme hooks
  lib/                  # types, default categories, currency/date formatting
  constants/            # theme tokens (colors, spacing, fonts)
  global.css            # Tailwind directives (NativeWind input)
tailwind.config.js      # Cashew-inspired palette + content globs
```

The `@/` path alias maps to `src/` (see `tsconfig.json`).

## Where state lives

- `src/context/BudgetContext.tsx` holds `transactions` and `budgets`, reduces over
  `ADD_TRANSACTION` / `DELETE_TRANSACTION` / `SET_BUDGET`, and persists to AsyncStorage.
- `src/hooks/useBudget.ts` is the consumer hook — it exposes the state, action helpers, and
  derived selectors (`totals`, `spendByCategory`).

## Next steps (not yet implemented)

- Add-transaction form and category management UI
- Real shared/multi-user sync + auth (e.g. Supabase/Firebase)
- Recurring transactions, multi-currency, CSV import/export
