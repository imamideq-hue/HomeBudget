# HomeBudget

A shared budget tracking app inspired by [Cashew](https://cashewapp.web.app/), built with
**React Native (Expo)**, **Expo Router**, **TypeScript**, and **NativeWind** (Tailwind for
React Native).

> Current status: **scaffold**. The app runs with seeded local data so you can see the UI,
> charts, and navigation. Real multi-user sync/auth is intentionally deferred — data is stored
> locally for now (React Context + AsyncStorage).

## Getting started

```bash
npm install
npm start          # Expo dev server (press w for web, i / a for simulators)
# or target a platform directly:
npm run web
npm run ios
npm run android
```

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
