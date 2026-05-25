import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { BrandColors } from '@/constants/brand';

type AuthInputProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export function AuthInput({ label, hint, error, style, ...rest }: AuthInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={BrandColors.muted}
        style={[styles.input, error && styles.inputError, style]}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D7DE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: BrandColors.text,
    backgroundColor: BrandColors.surface,
    letterSpacing: 2,
  },
  inputError: {
    borderColor: BrandColors.danger,
  },
  hint: {
    fontSize: 12,
    color: BrandColors.muted,
  },
  error: {
    fontSize: 12,
    color: BrandColors.danger,
  },
});
