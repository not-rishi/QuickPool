import { router, useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { QuickPoolLogo } from "@/components/branding/quickpool-logo";
import { RouteCard } from "@/components/routes/route-card";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth-context";
import type { TravelRoute } from "@/types/route";

const MAP_PLACEHOLDER = require("@/assets/images/map-placeholder.png");
const ANIMATED_BANNER = require("@/assets/animated/travel.gif");

const AVATARS: Record<number, any> = {
  1: require("@/assets/images/avatars/avatar1.png"),
  2: require("@/assets/images/avatars/avatar2.png"),
  3: require("@/assets/images/avatars/avatar3.png"),
  4: require("@/assets/images/avatars/avatar4.png"),
  5: require("@/assets/images/avatars/avatar5.png"),
  6: require("@/assets/images/avatars/avatar6.png"),
  7: require("@/assets/images/avatars/avatar7.png"),
  8: require("@/assets/images/avatars/avatar8.png"),
  9: require("@/assets/images/avatars/avatar9.png"),
  10: require("@/assets/images/avatars/avatar10.png"),
};

const getAvatarForId = (id: string = "") => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  return AVATARS[(sum % 10) + 1] || AVATARS[1];
};

export default function HomeScreen() {
  const { token, user } = useAuth();

  // console.log("🏠 [HomeScreen:Render] Current State variables:", {
  //   hasToken: !!token,
  //   hasUser: !!user,
  //   userName: user?.name ?? "null",
  // });
  const [routes, setRoutes] = useState<TravelRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = useCallback(
    async (isBackgroundRefresh = false) => {
      if (!token) {
        console.log("⚠️ [HomeScreen:loadRoutes] Aborted: Token is missing.");
        setLoading(false);
        return;
      }

      if (!isBackgroundRefresh) setLoading(true);
      setError(null);

      try {
        // console.log(
        //   "🌐 [HomeScreen:loadRoutes] Initiating fetch request to central endpoint...",
        // );
        const response = await fetch(API_ENDPOINTS.routes.base, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to load routes");
        }

        const data: TravelRoute[] = await response.json();

        const now = Date.now();
        const activeRoutes = data.filter((route) => {
          if (route.routeType === "QUICK_ROUTE") return true;
          if (!route.timeSlots || route.timeSlots.length === 0) return true;
          if (!route.timeSlots || route.timeSlots.length === 0) return true;
          const latestEndTime = Math.max(
            ...route.timeSlots.map((slot) => new Date(slot.endTime).getTime()),
          );
          return latestEndTime > now;
        });

        setRoutes(activeRoutes);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    // console.log("🔄 [HomeScreen:useEffect] Token dependency changed:", {
    //   tokenExists: !!token,
    // });
    if (token) {
      loadRoutes();
    } else {
      setLoading(false);
    }
  }, [token, loadRoutes]);

  useFocusEffect(
    useCallback(() => {
      if (token && !loading) {
        loadRoutes(true);
      }
    }, [token, loading, loadRoutes]),
  );

  const handleCreateRoute = useCallback(() => {
    router.push("/create-route");
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRoutes(true);
    setRefreshing(false);
  }, [loadRoutes]);

  const userAvatar = getAvatarForId(user?._id || user?.usn || "default");

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      {/* NATIVE PROFILE BLOCK (No upper thick bar) */}
      <View style={styles.profileRow}>
        <View style={styles.profileLeft}>
          <Image source={userAvatar} style={styles.avatarImage} />
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>
              {user?.name ?? user?.usn ?? "Student"}
            </Text>
          </View>
        </View>
        <View style={styles.scorePill}>
          <Ionicons name="star" size={13} color="#A78BFA" />
          <Text style={styles.scoreValue}>{user?.reputationScore ?? 100}</Text>
        </View>
      </View>

      {/* FLOATING MAP PLACEHOLDER BANNER */}
      <View style={styles.mapBannerCard}>
        <ImageBackground
          source={ANIMATED_BANNER}
          style={styles.mapBannerImage}
          imageStyle={{ opacity: 0.35 }}
          resizeMode="cover"
        >
          <View style={styles.mapBannerOverlay}>
            <View>
              <Text style={styles.mapBannerTitle}>Find Your Ride Bunch</Text>
              <Text style={styles.mapBannerSubtitle}>
                Split fares, meet peers, save time
              </Text>
            </View>
            <View style={styles.mapBannerIconBox}>
              <Ionicons name="navigate" size={20} color="#8B5CF6" />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* SCREEN TITLE & APP LOGO SECTION */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleWithLogo}>
            <Image
              source={require("@/assets/images/icon.gif")}
              style={{ width: 35, height: 35 }}
            />
            <Text style={styles.sectionTitle}>Available Routes</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={handleCreateRoute}
            style={styles.createButton}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionSubtitle}>
          Join an existing commute pipeline to automatically split travel costs.
        </Text>
        <Text style={styles.sectionMeta}>
          {routes.length} active {routes.length === 1 ? "pool" : "pools"} nearby
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {loading && !refreshing ? (
          <ActivityIndicator
            style={styles.loader}
            color="#8B5CF6"
            size="large"
          />
        ) : error ? (
          <View style={{ flex: 1 }}>
            {renderHeader()}
            <View style={styles.glassBox}>
              <Ionicons name="warning-outline" size={32} color="#F87171" />
              <Text style={styles.emptyTitle}>Could not load routes</Text>
              <Text style={styles.emptyText}>{error}</Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={routes}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#8B5CF6"
                colors={["#8B5CF6"]}
              />
            }
            ListEmptyComponent={
              <View style={styles.glassBox}>
                <Ionicons
                  name="map-outline"
                  size={32}
                  color="#A78BFA"
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.emptyTitle}>No active pools</Text>
                <Text style={styles.emptyText}>
                  No routes created yet. Use the Create button above to setup
                  your destination route!
                </Text>
              </View>
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
    backgroundColor: "#0A0A0A",
  },
  safe: {
    flex: 1,
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#262626",
  },
  greeting: {
    fontSize: 12,
    color: "#71717A",
    fontWeight: "500",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 1,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.25)",
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E9D5FF",
  },
  mapBannerCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F1F23",
    backgroundColor: "#000000",
    marginBottom: 24,
  },
  mapBannerImage: {
    width: "100%",
    height: 150,
    justifyContent: "center",
  },
  mapBannerOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  mapBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mapBannerSubtitle: {
    fontSize: 12,
    color: "#A1A1AA",
    marginTop: 4,
  },
  mapBannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#171719",
    borderWidth: 1,
    borderColor: "#262629",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleWithLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#71717A",
    marginTop: 6,
    lineHeight: 18,
  },
  sectionMeta: {
    fontSize: 12,
    color: "#8B5CF6",
    marginTop: 10,
    fontWeight: "600",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  list: {
    paddingBottom: 100,
  },
  cardWrap: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassBox: {
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#262626",
    backgroundColor: "#171717",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#A1A1AA",
    lineHeight: 20,
    textAlign: "center",
  },
});
