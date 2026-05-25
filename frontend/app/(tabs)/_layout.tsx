import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      {/* ✅ CORRECT: Just use the 'name' that matches your filename, and 'options' for styling */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name="group"
        options={{
          title: "Group",
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
