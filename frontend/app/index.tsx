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
    color: "#ffffff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: BrandColors.muted,
    textAlign: "center",
  },
});

console.log(`
MdmmmmmmmmmmmmmmmmmmmmmpMWWWWWWMMWMWWWWW
or                     toWWWWWWWWWWWWWWW
or      .lvwbpzt,      toWMWWMWMWMWWWWWW
or    !wowzTi!vmabT    toWWWWMMWWWWMWWWW
or   zoY.        naC;  toMMWMWWWMWWWMMWM
or  von           lhY. toWWWWWWWWWWWWWWM
or .op.           .Ubi toWWWWWWWWMWWWWWW
or .op.           .Ybi toMWWWWMWWMWWWWMW
or  zax           lkU, toWWWWWWWWWMMMWWW
or   Xaz.        xaL;  toWMMWMWMWWWWWWWM
or    Tpowxi:;jLaaF..  toWWWWWMWWWWMWWWW
or       jLdkbwQQQQQLl toMWWWWWMMWWWWMMW
or                     TaMMMMMMMMMMMMMMM
MooooooooooooooooooooooQ,.............ra
MMWWMWWWMWWWMWWWMWWWWMMm.  .XqqwwX:   ja
MMWWMWMWWWWMMWWMWWMWWWWm.  ,Cr   Tb;  ja
MMWWMWWMWWWWWWWMMWWWWWWm.  ,Cr   !pi  ja
MMMWWMWMWWWWMWWWMWWWWWWm.  ,LpLLmLl   ja
MMWWMMWWWMWWWMWMWWWWWWWm.  ,Cr        ja
MMWMWMWWMWWWMWWMWWWWWWWm.  ,Cr        ja
MMMWMWWMMWWWWWWWMWWMWWWm.   i,        ja
MMMMMMMMMMMMMMMMMMMMMMMhmQQQQQQQQQQQQQpM
`);
