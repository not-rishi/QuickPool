import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { BrandColors } from '@/constants/brand';
import { useAuth } from '@/context/auth-context';

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? '—'}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, usn, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <InfoRow label="USN" value={user?.usn ?? usn ?? undefined} />
        <InfoRow label="Name" value={user?.name} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Phone" value={user?.phone} />
        <InfoRow label="Department" value={user?.department} />
        <InfoRow label="Gender" value={user?.gender} />
        <InfoRow label="Reputation" value={user?.reputationScore ?? 100} />
      </View>

      <PrimaryButton label="Log out" variant="secondary" onPress={handleLogout} style={styles.logout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.surface,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.text,
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  row: {
    gap: 4,
  },
  rowLabel: {
    fontSize: 12,
    color: BrandColors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 16,
    color: BrandColors.text,
    fontWeight: '600',
  },
  logout: {
    marginTop: 24,
  },
});
