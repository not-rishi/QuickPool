import { View, ScrollView } from "react-native";
import type { ReactNode } from "react";
import { DarkTheme, globalStyles } from "@/constants/theme"; // Import the theme

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  centered?: boolean;
};

export function ScreenContainer({
  children,
  scroll,
  centered,
}: ScreenContainerProps) {
  const content = (
    <View
      style={[
        globalStyles.container, // This applies our #09090B background
        centered && { justifyContent: "center", alignItems: "center" },
      ]}
    >
      {children}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        style={globalStyles.container} // Apply here too for the scroll view itself
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}
