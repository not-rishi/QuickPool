import { BlurView } from "expo-blur";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
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
import type { QueueEntry } from "@/types/queue";
import type { RouteTimeSlot, TravelRoute } from "@/types/route";

function formatSlot(slot?: RouteTimeSlot) {
  if (!slot?.startTime || !slot?.endTime) return "Schedule pending";
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Schedule pending";
  }
  const date = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} | ${startTime} - ${endTime}`;
}

export default function RouteDetailsScreen() {
  const params = useLocalSearchParams<{ routeId?: string }>();
  const routeId = typeof params.routeId === "string" ? params.routeId : "";
  const { token, user } = useAuth();

  const [route, setRoute] = useState<TravelRoute | null>(null);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoute = useCallback(async () => {
    if (!token || !routeId) return;
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.routes.details(routeId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to load route");
      }

      const data = (await response.json()) as TravelRoute;
      setRoute(data);
      if (data.timeSlots?.length === 1) {
        setSelectedSlotId(data.timeSlots[0]._id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load route.");
    }
  }, [routeId, token]);

  const loadQueue = useCallback(
    async (slotId?: string | null) => {
      if (!token || !routeId) return;
      setQueueLoading(true);
      try {
        const queueUrl = slotId
          ? `${API_ENDPOINTS.routes.queue(routeId)}?slotId=${encodeURIComponent(slotId)}`
          : API_ENDPOINTS.routes.queue(routeId);
        const response = await fetch(queueUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to load queue");
        }

        const data = (await response.json()) as QueueEntry[];
        setQueue(data);
      } catch (err) {
        setQueue([]);
      } finally {
        setQueueLoading(false);
      }
    },
    [routeId, token],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadRoute();
      setLoading(false);
    })();
  }, [loadRoute]);

  useEffect(() => {
    loadQueue(selectedSlotId);
  }, [loadQueue, selectedSlotId]);

  useFocusEffect(
    useCallback(() => {
      loadRoute();
      loadQueue(selectedSlotId);
    }, [loadRoute, loadQueue, selectedSlotId]),
  );

  const queueUserIds = useMemo(() => {
    return queue
      .map((entry) =>
        typeof entry.userId === "string" ? entry.userId : entry.userId?._id,
      )
      .filter(Boolean) as string[];
  }, [queue]);

  const isInQueue = useMemo(() => {
    if (!user?._id) return false;
    return queueUserIds.includes(user._id);
  }, [queueUserIds, user?._id]);

  const canPickFemaleOnly = user?.gender === "Female";

  const handleJoin = async () => {
    if (!token || !routeId || !selectedSlotId) {
      setError("Select a time slot before joining.");
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.routes.join(routeId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slotId: selectedSlotId, femaleOnly }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to join queue");
      }

      await loadQueue(selectedSlotId);
    } catch (err: any) {
      setError(err.message || "Failed to join queue.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!token || !routeId) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.routes.leave(routeId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to leave queue");
      }

      await loadQueue(selectedSlotId);
    } catch (err: any) {
      setError(err.message || "Failed to leave queue.");
    } finally {
      setActionLoading(false);
    }
  };

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

  if (!route) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <BlurView intensity={30} tint="dark" style={styles.glassBox}>
            <Text style={styles.emptyTitle}>Route not found</Text>
            <Text style={styles.emptyText}>{error ?? "Try again later."}</Text>
          </BlurView>
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
              <Pressable
                accessibilityRole="button"
                onPress={() => router.back()}
              >
                <Text style={styles.backText}>Back</Text>
              </Pressable>
              <QuickPoolLogo size={36} />
            </View>
            <Text style={styles.title}>
              {route.start} to {route.destination}
            </Text>
            <Text style={styles.subtitle}>
              Batch size {route.batchSize} |{" "}
              {route.routeType === "QUICK_ROUTE"
                ? "Quick route"
                : "Student route"}
            </Text>
          </BlurView>

          <BlurView intensity={26} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Route details</Text>
            {route.description ? (
              <Text style={styles.description}>{route.description}</Text>
            ) : null}
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                Created{" "}
                {route.createdBy?.name
                  ? `by ${route.createdBy.name}`
                  : "by system"}
              </Text>
              {route.expiresAt ? (
                <Text style={styles.metaText}>
                  Expires {new Date(route.expiresAt).toLocaleString()}
                </Text>
              ) : null}
            </View>
          </BlurView>

          <BlurView intensity={26} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Pick a time slot</Text>
            <View style={styles.slotRow}>
              {(route.timeSlots ?? []).map((slot) => (
                <Pressable
                  key={slot._id}
                  accessibilityRole="button"
                  onPress={() => setSelectedSlotId(slot._id)}
                  style={[
                    styles.slotChip,
                    selectedSlotId === slot._id && styles.slotChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotChipText,
                      selectedSlotId === slot._id && styles.slotChipTextActive,
                    ]}
                  >
                    {formatSlot(slot)}
                  </Text>
                </Pressable>
              ))}
            </View>
            {!route.timeSlots?.length ? (
              <Text style={styles.emptyText}>No time slots published yet.</Text>
            ) : null}
          </BlurView>

          <BlurView intensity={26} tint="dark" style={styles.card}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Queue</Text>
              {queueLoading ? (
                <Text style={styles.metaText}>Refreshing...</Text>
              ) : (
                <Text style={styles.metaText}>{queue.length} in queue</Text>
              )}
            </View>
            <View style={styles.queueList}>
              {queue.slice(0, 5).map((entry) => {
                const member =
                  typeof entry.userId === "string" ? null : entry.userId;
                return (
                  <View key={entry._id} style={styles.queueItem}>
                    <Text style={styles.queueName}>
                      {member?.name ?? "Student"}
                    </Text>
                    <Text style={styles.queueMeta}>{member?.usn ?? ""}</Text>
                  </View>
                );
              })}
            </View>
            {queue.length > 5 ? (
              <Text style={styles.metaText}>
                and {queue.length - 5} more in queue
              </Text>
            ) : null}
          </BlurView>

          {canPickFemaleOnly ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setFemaleOnly((prev) => !prev)}
              style={[
                styles.femaleToggle,
                femaleOnly && styles.femaleToggleActive,
              ]}
            >
              <Text
                style={[
                  styles.femaleToggleText,
                  femaleOnly && styles.femaleToggleTextActive,
                ]}
              >
                Female-only preference {femaleOnly ? "enabled" : "disabled"}
              </Text>
            </Pressable>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={isInQueue ? handleLeave : handleJoin}
            disabled={actionLoading}
            style={[
              styles.actionButton,
              isInQueue && styles.actionButtonSecondary,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading
                ? "Working..."
                : isInQueue
                  ? "Leave queue"
                  : "Join this route"}
            </Text>
          </Pressable>
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
    justifyContent: "space-between",
  },
  backText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#a1a1aa",
  },
  card: {
    borderRadius: 22,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.45)",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E5E7EB",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 14,
    color: "#D4D4D8",
    lineHeight: 20,
  },
  metaRow: {
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  slotRow: {
    gap: 10,
  },
  slotChip: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 12,
    backgroundColor: "rgba(9, 9, 11, 0.7)",
  },
  slotChipActive: {
    borderColor: "rgba(99, 102, 241, 0.6)",
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  slotChipText: {
    fontSize: 13,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  slotChipTextActive: {
    color: "#E0E7FF",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  queueList: {
    gap: 10,
  },
  queueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  queueName: {
    fontSize: 13,
    color: "#F8FAFC",
    fontWeight: "600",
  },
  queueMeta: {
    fontSize: 12,
    color: "#94A3B8",
  },
  femaleToggle: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  femaleToggleActive: {
    borderColor: "rgba(236, 72, 153, 0.6)",
    backgroundColor: "rgba(236, 72, 153, 0.2)",
  },
  femaleToggleText: {
    fontSize: 13,
    color: "#E2E8F0",
    fontWeight: "600",
  },
  femaleToggleTextActive: {
    color: "#FBCFE8",
  },
  actionButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#6366f1",
  },
  actionButtonSecondary: {
    backgroundColor: "#1F2937",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  error: {
    color: BrandColors.danger,
    fontSize: 12,
  },
  glassBox: {
    margin: 20,
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
