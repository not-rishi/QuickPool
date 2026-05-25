import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthInput } from '@/components/ui/auth-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { BrandColors } from '@/constants/brand';
import { normalizeOtp, OTP_LENGTH, OTP_REGEX } from '@/constants/validation';
import { useAuth } from '@/context/auth-context';
import { ApiError } from '@/services/api';
import { sendOtp, verifyOtp } from '@/services/auth';

export default function OtpScreen() {
  const params = useLocalSearchParams<{ usn?: string }>();
  const { pendingUsn, setPendingUsn, signIn } = useAuth();
  const usn = useMemo(
    () => (typeof params.usn === 'string' ? params.usn : pendingUsn) ?? '',
    [params.usn, pendingUsn],
  );

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const normalizedOtp = normalizeOtp(otp);
  const isValid = OTP_REGEX.test(normalizedOtp);

  async function handleVerify() {
    if (!usn) {
      router.replace('/login');
      return;
    }

    setError(null);
    if (!isValid) {
      setError(`Enter the ${OTP_LENGTH}-digit OTP from your email`);
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await verifyOtp(usn, normalizedOtp);
      await signIn(token, usn, user);
      router.replace('/(tabs)');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Verification failed. Please try again.';
      setError(message);
      Alert.alert('OTP verification failed', message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!usn) return;
    setResending(true);
    setError(null);
    try {
      await sendOtp(usn);
      Alert.alert('OTP sent', 'A new code was sent to your registered email.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not resend OTP.';
      Alert.alert('Resend failed', message);
    } finally {
      setResending(false);
    }
  }

  return (
    <ScreenContainer scroll centered>
      <View style={styles.content}>
        <Text style={styles.heading}>Enter OTP</Text>
        <Text style={styles.subheading}>
          We sent a {OTP_LENGTH}-digit code to the email linked with{' '}
          <Text style={styles.usn}>{usn || 'your USN'}</Text>.
        </Text>

        <AuthInput
          label="One-time password"
          value={otp}
          onChangeText={(text) => setOtp(normalizeOtp(text))}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          autoFocus
          error={error ?? undefined}
          hint={`${normalizedOtp.length}/${OTP_LENGTH} digits`}
          style={styles.otpInput}
        />

        <PrimaryButton
          label="Verify & continue"
          onPress={handleVerify}
          loading={loading}
          disabled={!isValid}
          style={styles.button}
        />

        <Pressable onPress={handleResend} disabled={resending}>
          <Text style={styles.resend}>
            {resending ? 'Sending…' : 'Did not receive it? Resend OTP'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setPendingUsn(null);
            router.back();
          }}>
          <Text style={styles.back}>Change USN</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 420,
    gap: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.text,
  },
  subheading: {
    fontSize: 14,
    lineHeight: 22,
    color: BrandColors.muted,
  },
  usn: {
    fontWeight: '700',
    color: BrandColors.primary,
  },
  otpInput: {
    letterSpacing: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
  button: {
    width: '100%',
  },
  resend: {
    textAlign: 'center',
    color: BrandColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  back: {
    textAlign: 'center',
    color: BrandColors.muted,
    fontSize: 14,
  },
});
