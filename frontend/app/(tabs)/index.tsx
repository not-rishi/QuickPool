import { BlurView } from "expo-blur";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuickPoolLogo } from "@/components/branding/quickpool-logo";
import { RouteCard } from "@/components/routes/route-card";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth-context";
import type { TravelRoute } from "@/types/route";

export default function HomeScreen() {
  const { token, user } = useAuth();
  const [routes, setRoutes] = useState<TravelRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.routes.base, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to load routes");
      }

      const data = await response.json();
      setRoutes(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadRoutes();
      setLoading(false);
    })();
  }, [loadRoutes]);

  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, [loadRoutes]),
  );

  const handleCreateRoute = useCallback(() => {
    router.push("/create-route");
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      {/* Background Image synced with Auth UI hierarchy */}
      <ImageBackground
        source={require("@/assets/images/background.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View pointerEvents="none" style={styles.backgroundOverlay} />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* Glassmorphic Header */}
        <BlurView intensity={30} tint="dark" style={styles.headerGlass}>
          <View style={styles.headerLeft}>
            <QuickPoolLogo size={42} />
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.name}>
                {user?.name ?? user?.usn ?? "Student"}
              </Text>
            </View>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>
              {user?.reputationScore ?? 100}
            </Text>
          </View>
        </BlurView>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTextBlock}>
              <Text style={styles.sectionTitle}>Available routes</Text>
              <Text style={styles.sectionSubtitle}>
                Join a route to get matched with students heading the same way.
              </Text>
              <Text style={styles.sectionMeta}>
                {routes.length} active routes
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={handleCreateRoute}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create route</Text>
            </Pressable>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            color="#6366f1"
            size="large"
          />
        ) : error ? (
          <BlurView intensity={30} tint="dark" style={styles.glassBox}>
            <Text style={styles.emptyTitle}>Could not load routes</Text>
            <Text style={styles.emptyText}>{error}</Text>
          </BlurView>
        ) : (
          <FlatList
            data={routes}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#6366f1"
                colors={["#6366f1"]}
              />
            }
            ListEmptyComponent={
              <BlurView intensity={30} tint="dark" style={styles.glassBox}>
                <Text style={styles.emptyTitle}>No routes yet</Text>
                <Text style={styles.emptyText}>
                  Routes created by students and the system will appear here.
                </Text>
              </BlurView>
            }
            renderItem={({ item }) => (
              <View style={styles.cardWrap}>
                <RouteCard
                  route={item}
                  onPress={() =>
                    router.push({
                      pathname: "/routes/[routeId]",
                      params: { routeId: item._id },
                    })
                  }
                />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  safe: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 5, 0.7)",
  },
  headerGlass: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.4)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    fontSize: 13,
    color: "#a1a1aa",
    fontWeight: "500",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 2,
    letterSpacing: -0.5,
  },
  scorePill: {
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  scoreLabel: {
    fontSize: 11,
    color: "#a1a1aa",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#6366f1", // Match auth accent color
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTextBlock: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#a1a1aa",
    marginTop: 4,
    lineHeight: 20,
  },
  sectionMeta: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: "rgba(10, 126, 164, 0.18)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.4)",
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E6F4FE",
    letterSpacing: 0.2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  cardWrap: {
    marginBottom: 4,
  },
  loader: {
    marginTop: 60,
  },
  glassBox: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.4)",
    overflow: "hidden",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  emptyText: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
    textAlign: "center",
  },
});
