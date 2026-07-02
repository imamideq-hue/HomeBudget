import { useRouter } from 'expo-router';

import { Fab } from '@/components/Fab';

/** Floating action button that opens the add-transaction modal. */
export function AddTransactionButton() {
  const router = useRouter();
  return (
    <Fab
      onPress={() => router.push('/add-transaction')}
      accessibilityLabel="Add transaction"
    />
  );
}
