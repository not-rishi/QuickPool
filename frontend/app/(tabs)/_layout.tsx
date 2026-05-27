import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 25,
          right: 25,
          backgroundColor: "#000000b5",

          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.25)",

          borderRadius: 100,
          height: 65,

          borderTopWidth: 1,

          paddingBottom: 5,
          paddingTop: 5,

          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#a78bfa",
        tabBarInactiveTintColor: "#cfcfcf",
      }}
    >
      {/* ✅ CORRECT: Just use the 'name' that matches your filename, and 'options' for styling */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "planet" : "planet-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="group"
        options={{
          title: "Group",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "document" : "document-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
