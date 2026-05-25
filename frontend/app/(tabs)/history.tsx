// app/history.tsx
import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { API_ENDPOINTS } from "@/config/api";
import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";
import type { RideHistory } from "@/types/history";
import type { TravelRoute } from "@/types/route";

const BACKGROUND_IMAGE = require("@/assets/images/background.png");
const ANIMATED_ICON = require("@/assets/images/icon.gif");
const MAP_PLACEHOLDER = require("@/assets/images/map-placeholder.png");

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

function getRouteLabel(route: TravelRoute | string | undefined) {
  if (!route || typeof route === "string") return "Route details unavailable";
  return `${route.start} to ${route.destination}`;
}

export default function HistoryScreen() {
  const { token, user } = useAuth();
  const [history, setHistory] = useState<RideHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(API_ENDPOINTS.users.history, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to load history");
      }

      const data = (await response.json()) as RideHistory[];
      setHistory(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load ride history.");
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      (async () => {
        if (isMounted) setLoading(true);
        await loadHistory();
        if (isMounted) setLoading(false);
      })();

      return () => {
        isMounted = false;
      };
    }, [loadHistory]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  // Derive current user avatar icon
  const currentUserAvatar = getAvatarForId(user?._id || user?.usn || "default");

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.dimOverlay} />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
              colors={["#8B5CF6"]}
            />
          }
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              {/* GLASS HEADER BLOCK WITH PERSONAL USER AVATAR */}
              <View style={styles.glassHeaderCard}>
                <View style={styles.headerRow}>
                  <Image source={currentUserAvatar} style={styles.headerAvatarImage} />
                  <Text style={styles.headerTitle}>Ride History</Text>
                </View>
                <Text style={styles.subtitle}>
                  Review your completed pipelines and pool cluster analytics.
                </Text>
              </View>

              {/* FLOATING MAP LAYOUT BANNER */}
              <View style={styles.mapBannerCard}>
                <ImageBackground 
                  source={MAP_PLACEHOLDER} 
                  style={styles.mapBannerImage}
                  imageStyle={{ opacity: 0.35 }}
                  resizeMode="cover"
                >
                  <View style={styles.mapBannerOverlay}>
                    <View>
                      <Text style={styles.mapBannerTitle}>Commute Archive</Text>
                      <Text style={styles.mapBannerSubtitle}>Total verified trip files logged: {history.length}</Text>
                    </View>
                    <View style={styles.mapBannerIconBox}>
                      <Ionicons name="folder-open-outline" size={18} color="#8B5CF6" />
                    </View>
                  </View>
                </ImageBackground>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
              
              {loading && !refreshing ? (
                <ActivityIndicator
                  style={styles.loader}
                  color="#8B5CF6"
                  size="large"
                />
              ) : null}
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.glassBox}>
                <View style={styles.gifContainer}>
                  <Image source={ANIMATED_ICON} style={styles.animatedGif} />
                </View>
                <Text style={styles.emptyTitle}>No rides yet</Text>
                <Text style={styles.emptyText}>
                  Your completed pooling transactions will appear here systematically.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const itemAvatarSource = getAvatarForId(item._id);
            return (
              <View style={styles.cardWrap}>
                <View style={styles.card}>
                  <View style={styles.cardLeft}>
                    <Image source={itemAvatarSource} style={styles.avatarImage} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.routeTitle} numberOfLines={1}>
                        {getRouteLabel(item.routeId)}
                      </Text>
                      <View style={styles.metaRow}>
                        <Ionicons name="calendar-outline" size={12} color="#71717A" />
                        <Text style={styles.metaText}>
                          {item.rideDate
                            ? new Date(item.rideDate).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Timestamp unavailable"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.badgeColumn}>
                    <View style={styles.groupSizeBadge}>
                      <Ionicons name="people-outline" size={12} color="#E9D5FF" />
                      <Text style={styles.groupSizeText}>
                        Size {item.groupSize ?? "-"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 5, 0.88)",
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
    marginBottom: 12,
  },
  glassHeaderCard: {
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 8,
    lineHeight: 18,
  },
  mapBannerCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(23, 23, 26, 0.4)",
  },
  mapBannerImage: {
    width: "100%",
    height: 90,
    justifyContent: "center",
  },
  mapBannerOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  mapBannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mapBannerSubtitle: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 4,
  },
  mapBannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#171719",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrap: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    gap: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 5,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#71717A",
  },
  badgeColumn: {
    alignItems: "flex-end",
  },
  groupSizeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  groupSizeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#E9D5FF",
  },
  error: {
    color: BrandColors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  loader: {
    marginVertical: 20,
  },
  glassBox: {
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    alignItems: "center",
    gap: 12,
  },
  gifContainer: {
    width: 64,
    height: 64,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#171719",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  animatedGif: {
    width: "100%",
    height: "100%",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 13,
    color: "#A1A1AA",
    lineHeight: 20,
    textAlign: "center",
  },
});