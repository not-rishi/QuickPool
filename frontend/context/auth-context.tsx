import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

import { AUTH_STORAGE_KEYS } from "@/constants/api-endpoint";
import { logout as logoutApi } from "@/services/auth";
import type { User } from "@/types/user";

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

const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }
  return await SecureStore.getItemAsync(key);
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const deleteStorageItem = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

async function readStoredSession(): Promise<{
  token: string | null;
  usn: string | null;
  user: User | null;
}> {
  const [token, usn, userJson] = await Promise.all([
    getStorageItem(AUTH_STORAGE_KEYS.token),
    getStorageItem(AUTH_STORAGE_KEYS.usn),
    getStorageItem(AUTH_STORAGE_KEYS.user),
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
    // console.log("🔑 token:", token);
    // console.log("👤 user:", user?.name);
  }, [token, user]);

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

  const signIn = useCallback(
    async (nextToken: string, nextUsn: string, nextUser: User) => {
      await Promise.all([
        setStorageItem(AUTH_STORAGE_KEYS.token, nextToken),
        setStorageItem(AUTH_STORAGE_KEYS.usn, nextUsn),
        setStorageItem(AUTH_STORAGE_KEYS.user, JSON.stringify(nextUser)),
      ]);
      setToken(nextToken);
      setUsn(nextUsn);
      setUser(nextUser);
      setPendingUsn(null);
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (token) {
      try {
        await logoutApi(token);
      } catch {}
    }
    await Promise.all([
      deleteStorageItem(AUTH_STORAGE_KEYS.token),
      deleteStorageItem(AUTH_STORAGE_KEYS.usn),
      deleteStorageItem(AUTH_STORAGE_KEYS.user),
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
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
