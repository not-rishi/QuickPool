import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
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

import { AuthInput } from "@/components/ui/auth-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { normalizeOtp, OTP_LENGTH, OTP_REGEX } from "@/constants/validation";
import { useAuth } from "@/context/auth-context";
import { API_ENDPOINTS } from "@/config/api"; // Importing global endpoint config

export default function OtpScreen() {
  const params = useLocalSearchParams<{ usn?: string }>();
  const { pendingUsn, setPendingUsn, signIn } = useAuth();
  const usn = useMemo(
    () => (typeof params.usn === "string" ? params.usn : pendingUsn) ?? "",
    [params.usn, pendingUsn],
  );

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const normalizedOtp = normalizeOtp(otp);
  const isValid = OTP_REGEX.test(normalizedOtp);

  async function handleVerify() {
    if (!usn) {
      router.replace("/login");
      return;
    }

    setError(null);
    if (!isValid) {
      setError(`Enter the ${OTP_LENGTH}-digit OTP from your email`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.verifyOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ usn, otp: normalizedOtp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid verification code");
      }

      const { token, user } = await response.json();
      console.log(
        "📩 [OTP:handleVerify] API verified OTP successfully. Triggering signIn()...",
      );

      await signIn(token, usn, user);
      console.log(
        "⏱️ [OTP:handleVerify] Scheduling router switch via setTimeout...",
      );

      // ⚙️ DEVELOPMENT INTERCEPT
      if (__DEV__ && usn === "RISHISMART") {
        setOtp("");
        Alert.alert("✨ Dev Success!", "The Magic OTP worked perfectly!");
        return;
      }

      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err.message || "Verification failed. Please try again.";
      setError(message);
      Alert.alert("OTP Verification Failed", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!usn) return;
    setResending(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.auth.sendOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ usn }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Could not resend code");
      }

      Alert.alert(
        "OTP Sent",
        "A new code was sent to your registered college email.",
      );
    } catch (err: any) {
      const message = err.message || "Could not resend OTP.";
      Alert.alert("Resend Failed", message);
    } finally {
      setResending(false);
    }
  }

  return (
    <ScreenContainer scroll centered>
      <View style={styles.container}>
        {/* Background Image Asset synced with Login UI hierarchy */}
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
                <Text style={styles.heading}>Verify Identity</Text>
                <Text style={styles.subheading}>
                  We sent a {OTP_LENGTH}-digit code to your email linked with{" "}
                  <Text style={styles.usnHallmark}>{usn || "your USN"}</Text>
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.elevatedLabel}>Enter Code</Text>
                  <AuthInput
                    label=""
                    value={otp}
                    onChangeText={(text) => setOtp(normalizeOtp(text))}
                    placeholder="000000"
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    autoFocus
                    error={error ?? undefined}
                    hint={`${normalizedOtp.length}/${OTP_LENGTH} digits`}
                    style={styles.otpInput}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <PrimaryButton
                    label={loading ? "Verifying..." : "Verify & Continue"}
                    onPress={handleVerify}
                    style={styles.loginButton}
                    disabled={!isValid || loading}
                  >
                    {loading && (
                      <ActivityIndicator
                        color="#fff"
                        style={{ marginRight: 8 }}
                      />
                    )}
                  </PrimaryButton>

                  <Pressable
                    onPress={handleResend}
                    disabled={resending}
                    style={styles.linkPressable}
                  >
                    <Text style={styles.resend}>
                      {resending
                        ? "Sending new code…"
                        : "Didn't receive it? Resend OTP"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setPendingUsn(null);
                      router.back();
                    }}
                    style={styles.linkPressable}
                  >
                    <Text style={styles.back}>Change USN</Text>
                  </Pressable>
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
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 15,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 22,
  },
  usnHallmark: {
    fontWeight: "700",
    color: "#a78bfa", // Updated from #6366f1
  },
  form: {
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  elevatedLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#a78bfa", // Updated from #6366f1
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textShadowColor: "rgba(167, 139, 250, 0.4)", // Updated shadow to match
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    paddingLeft: 4,
  },
  otpInput: {
    letterSpacing: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    backgroundColor: "#00000065",
    color: "#b8b8b8",
    borderColor: "#ffffff3a",
  },
  buttonContainer: {
    gap: 16,
    marginTop: 8,
  },
  linkPressable: {
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  resend: {
    textAlign: "center",
    color: "#a78bfa", // Updated from #6366f1
    fontWeight: "600",
    fontSize: 14,
  },
  back: {
    textAlign: "center",
    color: "#71717a",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#a78bfa",
    // You can also add shadows or specific purple shades here
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
