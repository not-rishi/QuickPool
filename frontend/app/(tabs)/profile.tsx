import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuickPoolLogo } from "@/components/branding/quickpool-logo";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useAuth } from "@/context/auth-context";

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? "—"}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, usn, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/background.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View pointerEvents="none" style={styles.backgroundOverlay} />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <BlurView intensity={30} tint="dark" style={styles.headerGlass}>
          <QuickPoolLogo size={46} />
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Your account details and score.</Text>
          </View>
        </BlurView>

        <BlurView intensity={26} tint="dark" style={styles.card}>
          <InfoRow label="USN" value={user?.usn ?? usn ?? undefined} />
          <InfoRow label="Name" value={user?.name} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Phone" value={user?.phone} />
          <InfoRow label="Department" value={user?.department} />
          <InfoRow label="Gender" value={user?.gender} />
          <InfoRow label="Reputation" value={user?.reputationScore ?? 100} />
        </BlurView>

        <PrimaryButton
          label="Log out"
          variant="secondary"
          onPress={handleLogout}
          style={styles.logout}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 5, 0.72)",
  },
  headerGlass: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.4)",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#A1A1AA",
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.45)",
    gap: 14,
  },
  row: {
    gap: 4,
  },
  rowLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 16,
    color: "#F8FAFC",
    fontWeight: "600",
  },
  logout: {
    marginTop: 8,
  },
});
