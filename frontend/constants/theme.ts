import { StyleSheet, Platform } from 'react-native';

export const DarkTheme = {
  colors: {
    background: '#09090B', // Rich zinc/off-black
    surfaceGlass: 'rgba(255, 255, 255, 0.03)', // Subtle white light for true glass
    surfaceLevel1: '#18181B', // Elevated input backgrounds
    borderGhost: 'rgba(255, 255, 255, 0.08)', // Crisp, subtle edges
    text: '#FDFCFD', // Pure high-contrast white
    textMuted: '#A1A1AA', // Elegant zinc-400 for secondary text
    primary: '#7C3AED', // Deep, vibrant violet 
    gradient: ['#7C3AED', '#DB2777'], // Premium Violet to Magenta shift
  },
  radii: {
    card: 28, // Slightly rounder for a friendlier, modern feel
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 12,
    base: 16,
    md: 24,
    lg: 40,
    xl: 64,
  }
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
    overflow: 'hidden', 
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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