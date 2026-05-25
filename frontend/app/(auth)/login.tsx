import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { QuickPoolLogo } from '@/components/branding/quickpool-logo';
import { AuthInput } from '@/components/ui/auth-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { BrandColors } from '@/constants/brand';
import { normalizeUsn, USN_LENGTH, USN_REGEX } from '@/constants/validation';
import { useAuth } from '@/context/auth-context';
import { ApiError } from '@/services/api';
import { sendOtp } from '@/services/auth';

export default function LoginScreen() {
  const { setPendingUsn } = useAuth();
  const [usn, setUsn] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalized = normalizeUsn(usn);
  const isValid = USN_REGEX.test(normalized);

  async function handleContinue() {
    setError(null);

    if (!isValid) {
      setError(`Enter a ${USN_LENGTH}-character alphanumeric USN`);
      return;
    }

    setLoading(true);
    try {
      await sendOtp(normalized);
      setPendingUsn(normalized);
      router.push({ pathname: '/otp', params: { usn: normalized } });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not send OTP. Check your connection.';
      setError(message);
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll centered>
      <View style={styles.content}>
        <QuickPoolLogo size={100} />
        <Text style={styles.heading}>Sign in with USN</Text>
        <Text style={styles.subheading}>
          Enter your college roll number. We will email a one-time password to your registered
          address.
        </Text>

        <AuthInput
          label="USN"
          value={usn}
          onChangeText={(text) => setUsn(normalizeUsn(text))}
          placeholder="e.g. 1MS22CS001"
          maxLength={USN_LENGTH}
          autoFocus
          error={error ?? undefined}
          hint={`${normalized.length}/${USN_LENGTH} characters`}
        />

        <PrimaryButton
          label="Send OTP"
          onPress={handleContinue}
          loading={loading}
          disabled={!isValid}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 420,
    gap: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.text,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    lineHeight: 22,
    color: BrandColors.muted,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
});
