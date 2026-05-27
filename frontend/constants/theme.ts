import { StyleSheet, Platform } from "react-native";

export const DarkTheme = {
  colors: {
    background: "#09090B",
    surfaceGlass: "rgba(255, 255, 255, 0.03)",
    surfaceLevel1: "#18181B",
    borderGhost: "rgba(255, 255, 255, 0.08)",
    text: "#FDFCFD",
    textMuted: "#A1A1AA",
    primary: "#7C3AED",
    gradient: ["#7C3AED", "#DB2777"],
  },
  radii: {
    card: 28,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 12,
    base: 16,
    md: 24,
    lg: 40,
    xl: 64,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.colors.background,
  },
  glassCard: {
    backgroundColor: DarkTheme.colors.surfaceGlass,
    borderColor: DarkTheme.colors.borderGhost,
    borderWidth: 1,
    borderRadius: DarkTheme.radii.card,
    padding: DarkTheme.spacing.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
