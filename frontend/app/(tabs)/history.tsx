import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuickPoolLogo } from "@/components/branding/quickpool-logo";
import { API_ENDPOINTS } from "@/config/api";
import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";
import type { RideHistory } from "@/types/history";
import type { TravelRoute } from "@/types/route";

function getRouteLabel(route: TravelRoute | string | undefined) {
  if (!route || typeof route === "string") return "Route details unavailable";
  return `${route.start} to ${route.destination}`;
}

export default function HistoryScreen() {
  const { token } = useAuth();
  const [history, setHistory] = useState<RideHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
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
    } catch (err: any) {
      setError(err.message || "Failed to load ride history.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <ActivityIndicator
            style={styles.loader}
            color="#6366f1"
            size="large"
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <BlurView intensity={30} tint="dark" style={styles.headerGlass}>
            <View style={styles.headerRow}>
              <QuickPoolLogo size={40} />
              <Text style={styles.headerTitle}>Ride history</Text>
            </View>
            <Text style={styles.subtitle}>
              Your past routes and group sizes.
            </Text>
          </BlurView>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {history.length === 0 ? (
            <BlurView intensity={30} tint="dark" style={styles.glassBox}>
              <Text style={styles.emptyTitle}>No rides yet</Text>
              <Text style={styles.emptyText}>
                Your completed trips will appear here.
              </Text>
            </BlurView>
          ) : (
            history.map((item) => (
              <BlurView
                key={item._id}
                intensity={26}
                tint="dark"
                style={styles.card}
              >
                <Text style={styles.routeTitle}>
                  {getRouteLabel(item.routeId)}
                </Text>
                <Text style={styles.metaText}>
                  {item.rideDate
                    ? new Date(item.rideDate).toLocaleString()
                    : "Date pending"}
                </Text>
                <Text style={styles.metaText}>
                  Group size: {item.groupSize ?? "-"}
                </Text>
              </BlurView>
            ))
          )}
        </ScrollView>
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
  content: {
    padding: 20,
    gap: 16,
  },
  headerGlass: {
    borderRadius: 22,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.4)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#a1a1aa",
  },
  card: {
    borderRadius: 22,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.45)",
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  metaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  error: {
    color: BrandColors.danger,
    fontSize: 12,
  },
  glassBox: {
    marginHorizontal: 8,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.4)",
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
  loader: {
    marginTop: 60,
  },
});
