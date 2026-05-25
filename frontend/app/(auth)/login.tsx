import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

import { AuthInput } from "@/components/ui/auth-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { normalizeUsn, USN_LENGTH, USN_REGEX } from "@/constants/validation";
import { useAuth } from "@/context/auth-context";
import { API_ENDPOINTS } from "@/config/api"; // Importing global endpoint config

export default function LoginScreen() {
  const { setPendingUsn } = useAuth();
  const [usn, setUsn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalized = normalizeUsn(usn);
  const isValid = USN_REGEX.test(normalized);

  async function handleContinue() {
    setError(null);

    if (!isValid) {
      setError(`Enter a ${USN_LENGTH}-character alphanumeric USN`);
      return;
    }

    setLoading(true);
    try {
      // Using the central global path definition
      const response = await fetch(API_ENDPOINTS.auth.sendOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ usn: normalized }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      setPendingUsn(normalized);
      router.push({ pathname: "/otp", params: { usn: normalized } });
    } catch (err: any) {
      const message =
        err.message || "Could not send OTP. Check your connection.";
      setError(message);
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll centered>
      <View style={styles.container}>
        <ImageBackground
          source={require("@/assets/images/background.png")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.cardContainer}>
            <BlurView intensity={30} tint="dark" style={styles.glassCard}>
              <View style={styles.header}>
                <LinearGradient
                  colors={["#6366f1", "#a855f7", "#ec4899"]}
                  style={styles.logoMarker}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.logoImage}
                    contentFit="contain"
                  />
                </LinearGradient>

                <Text style={styles.heading}>QuickPool</Text>
                <Text style={styles.subheading}>
                  Find BMSCE students traveling your way !
                </Text>
              </View>

              <View style={styles.form}>
                {/* Elevated wrapper block specifically to spotlight the Input details */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.elevatedLabel}>Enter Your USN</Text>
                  <AuthInput
                    label="" // Pass empty if your component natively renders its own internally, or adapt your component to ingest styles below
                    value={usn}
                    onChangeText={(text) => setUsn(normalizeUsn(text))}
                    placeholder="e.g. 1BM24CS001"
                    maxLength={USN_LENGTH}
                    autoFocus
                    error={error ?? undefined}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <PrimaryButton
                    label={loading ? "Sending..." : "Send OTP"}
                    onPress={handleContinue}
                    disabled={!isValid || loading}
                  >
                    {loading && (
                      <ActivityIndicator
                        color="#fff"
                        style={{ marginRight: 8 }}
                      />
                    )}
                  </PrimaryButton>

                  <Text style={styles.hintText}>
                    OTP will be sent to your registered college email
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#050505",
    flex: 1,
    width: "100%",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  glassCard: {
    borderRadius: 28,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.4)",
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoMarker: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  elevatedLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff", // Vibrant Purple tint to draw immediate attention
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textShadowColor: "rgba(168, 85, 247, 0.4)", // Soft glow underlying the label text
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    paddingLeft: 4,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 16,
    marginTop: 8,
  },
  hintText: {
    fontSize: 13,
    color: "#71717a",
    textAlign: "center",
    fontWeight: "500",
  },
  logoImage: {
    width: 72,
    height: 72,
    borderRadius: 24,
  },
});
