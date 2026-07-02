import { useLocalSearchParams } from 'expo-router';

import { AccountDetailScreen } from '@/screens/AccountDetailScreen';

export default function AccountRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AccountDetailScreen accountId={id ?? ''} />;
}
