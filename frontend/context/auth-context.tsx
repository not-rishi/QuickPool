import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AUTH_STORAGE_KEYS } from '@/constants/api';
import { logout as logoutApi } from '@/services/auth';
import type { User } from '@/types/user';

type AuthContextValue = {
  token: string | null;
  usn: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, usn: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  setPendingUsn: (usn: string | null) => void;
  pendingUsn: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStoredSession(): Promise<{
  token: string | null;
  usn: string | null;
  user: User | null;
}> {
  const [token, usn, userJson] = await Promise.all([
    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.token),
    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.usn),
    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.user),
  ]);

  let user: User | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson) as User;
    } catch {
      user = null;
    }
  }

  return { token, usn, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usn, setUsn] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [pendingUsn, setPendingUsn] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const session = await readStoredSession();
      if (!mounted) return;
      setToken(session.token);
      setUsn(session.usn);
      setUser(session.user);
      setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (nextToken: string, nextUsn: string, nextUser: User) => {
    await Promise.all([
      SecureStore.setItemAsync(AUTH_STORAGE_KEYS.token, nextToken),
      SecureStore.setItemAsync(AUTH_STORAGE_KEYS.usn, nextUsn),
      SecureStore.setItemAsync(AUTH_STORAGE_KEYS.user, JSON.stringify(nextUser)),
    ]);
    setToken(nextToken);
    setUsn(nextUsn);
    setUser(nextUser);
    setPendingUsn(null);
  }, []);

  const signOut = useCallback(async () => {
    if (token) {
      try {
        await logoutApi(token);
      } catch {
        // JWT logout is client-side; ignore network errors
      }
    }
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.token),
      SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.usn),
      SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.user),
    ]);
    setToken(null);
    setUsn(null);
    setUser(null);
    setPendingUsn(null);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      usn,
      user,
      isLoading,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
      pendingUsn,
      setPendingUsn,
    }),
    [token, usn, user, isLoading, signIn, signOut, pendingUsn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
