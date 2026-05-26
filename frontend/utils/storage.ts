import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const getAuthToken = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }
  return await SecureStore.getItemAsync(key);
};

export const setAuthToken = async (
  key: string,
  value: string,
): Promise<void> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

export const removeAuthToken = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
};
