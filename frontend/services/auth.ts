import { apiRequest } from '@/services/api';
import type { User } from '@/types/user';

export async function sendOtp(usn: string): Promise<{ message: string }> {
  return apiRequest('/api/auth/send-otp', {
    method: 'POST',
    body: { usn },
  });
}

export async function verifyOtp(
  usn: string,
  otp: string,
): Promise<{ token: string; user: User }> {
  return apiRequest('/api/auth/verify-otp', {
    method: 'POST',
    body: { usn, otp },
  });
}

export async function logout(token: string): Promise<{ message: string }> {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    token,
  });
}
