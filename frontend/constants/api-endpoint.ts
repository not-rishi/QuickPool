import { Platform } from 'react-native';

const DEFAULT_HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_HOST;

console.log("ENV:", process.env.EXPO_PUBLIC_API_URL);

export const AUTH_STORAGE_KEYS = {
  token: 'quickpool_token',
  usn: 'quickpool_usn',
  user: 'quickpool_user',
} as const;
