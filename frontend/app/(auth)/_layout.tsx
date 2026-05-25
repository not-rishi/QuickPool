import { Slot, Stack } from "expo-router";
import { AuthProvider } from "@/context/auth-context"; // Verify this points to your file path

export default function RootLayout() {
  return (
    // 👑 The global provider MUST sit out here at the absolute peak of the application
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Assumes your group layout folder structure names match below */}
        <Stack.Screen name="(auth)" /> 
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}