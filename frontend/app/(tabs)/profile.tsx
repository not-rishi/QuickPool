import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { PrimaryButton } from "@/components/ui/primary-button";
import { useAuth } from "@/context/auth-context";

const BACKGROUND_IMAGE = require("@/assets/images/background.png");
const ANIMATED_ICON = require("@/assets/images/icon_w.gif");
const ANIMATED_BANNER = require("@/assets/animated/profile.gif");

const AVATARS: Record<number, any> = {
  1: require("@/assets/images/avatars/avatar1.png"),
  2: require("@/assets/images/avatars/avatar2.png"),
  3: require("@/assets/images/avatars/avatar3.png"),
  4: require("@/assets/images/avatars/avatar4.png"),
  5: require("@/assets/images/avatars/avatar5.png"),
  6: require("@/assets/images/avatars/avatar6.png"),
  7: require("@/assets/images/avatars/avatar7.png"),
  8: require("@/assets/images/avatars/avatar8.png"),
  9: require("@/assets/images/avatars/avatar9.png"),
  10: require("@/assets/images/avatars/avatar10.png"),
};

const getAvatarForId = (id: string = "") => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  return AVATARS[(sum % 10) + 1] || AVATARS[1];
};

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.fieldIconBox}>
          <Ionicons name={icon} size={14} color="#A78BFA" />
        </View>
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowValue}>{value ?? "—"}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, usn, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  const userAvatar = getAvatarForId(user?._id || user?.usn || usn || "default");

  return (
    <View style={styles.container}>
       <ImageBackground
          source={require("../../assets/images/background.png")}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      <View style={styles.dimOverlay} />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* PREMIUM ACCOUNT PROFILE HEADER */}
        <View style={styles.glassHeaderCard}>
          <View style={styles.headerRow}>
            <Image source={userAvatar} style={styles.avatarImage} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{user?.name ?? "Student User"}</Text>
              <Text style={styles.subtitle}>
                {user?.usn ?? usn ?? "Identification pending"}
              </Text>
            </View>
          </View>
        </View>

        {/* FLOATING ACTION BANNER FEATURING THE ANIMATED GIF */}
        <View style={styles.mapBannerCard}>
          <ImageBackground
            source={ANIMATED_BANNER}
            style={styles.mapBannerImage}
            imageStyle={{ opacity: 0.4 }}
            resizeMode="cover"
          >
            <View style={styles.mapBannerOverlay}>
              <View style={styles.mapBannerLeft}>
                <View style={styles.gifContainer}>
                  <Image source={ANIMATED_ICON} style={styles.animatedGif} />
                </View>
                <View>
                  <Text style={styles.mapBannerTitle}>Trust Rating Status</Text>
                  <Text style={styles.mapBannerSubtitle}>
                    Verified ecosystem participant
                  </Text>
                </View>
              </View>

              <View style={styles.scorePill}>
                <Ionicons name="star" size={13} color="#ffffff" />
                <Text style={styles.scoreValue}>
                  {user?.reputationScore ?? 100}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* DETAILS DATA FIELDS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Account Credentials</Text>
          <View style={styles.divider} />

          <View style={styles.fieldsGrid}>
            <InfoRow
              label="Email Identity"
              value={user?.email}
              icon="mail-outline"
            />
            <InfoRow
              label="Phone Contact"
              value={user?.phone}
              icon="call-outline"
            />
            <InfoRow
              label="Division / Department"
              value={user?.department}
              icon="business-outline"
            />
            <InfoRow
              label="Gender Parameter"
              value={user?.gender}
              icon="person-outline"
            />
          </View>
        </View>

        {/* DISENGAGE BUTTON */}
        <PrimaryButton
          label="Terminate Session (Log Out)"
          variant="secondary"
          onPress={handleLogout}
          style={styles.logout}
          textStyle={{ color: "#fc286eba" }}
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
  dimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5, 5, 5, 0.88)",
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  glassHeaderCard: {
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#171717",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 2,
    fontWeight: "500",
  },
  mapBannerCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(23, 23, 26, 0.4)",
  },
  mapBannerImage: {
    width: "100%",
    height: 120,
    justifyContent: "center",
  },
  mapBannerOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  mapBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gifContainer: {
    width: 40,
    height: 40,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#171719",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  animatedGif: {
    width: "100%",
    height: "100%",
  },
  mapBannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mapBannerSubtitle: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 2,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.38)",
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#bdbcbe",
  },
  card: {
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    borderRadius: 22,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E5E7EB",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginVertical: -2,
  },
  fieldsGrid: {
    gap: 12,
  },
  row: {
    paddingVertical: 2,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fieldIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 11,
    color: "#71717A",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 15,
    color: "#F4F4F5",
    fontWeight: "600",
    marginTop: 1,
  },
  logout: {
    marginTop: "auto",
    marginBottom: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "#1f1f2377",
  },
});
