import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

/**
 * Replace assets/images/icon.png with your animated logo.gif when ready.
 * expo-image plays GIF animations automatically.
 */
const LOGO_SOURCE = require('@/assets/images/icon.png');

type QuickPoolLogoProps = {
  size?: number;
};

export function QuickPoolLogo({ size = 140 }: QuickPoolLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={LOGO_SOURCE} style={{ width: size, height: size }} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
