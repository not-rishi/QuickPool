export const USN_LENGTH = 10;
export const USN_REGEX = /^[A-Za-z0-9]{10}$/;
export const OTP_LENGTH = 6;
export const OTP_REGEX = /^\d{6}$/;

export function normalizeUsn(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, USN_LENGTH);
}

export function normalizeOtp(value: string): string {
  return value.replace(/\D/g, '').slice(0, OTP_LENGTH);
}
