import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";

const SPLASH_DURATION_MS = 2200;
const LOGO_SOURCE = require("@/assets/images/icon.png");
const GIF_SOURCE = require("@/assets/images/icon.gif");

export default function LoadingScreen() {
  const { isLoading, isAuthenticated } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (isLoading || hasNavigated.current) return;

    const timer = setTimeout(() => {
      hasNavigated.current = true;
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Image source={GIF_SOURCE} style={styles.logo} contentFit="contain" />
      <Text style={styles.title}>QuickPool</Text>
      <Text style={styles.subtitle}>Ride Sharing Made Simple Enough</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    gap: 12,
    paddingHorizontal: 32,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: BrandColors.primary,
    letterSpacing: 1,
    // textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    color: BrandColors.muted,
    textAlign: "center",
  },
});
