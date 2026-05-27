import { BlurView } from "expo-blur";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { API_ENDPOINTS } from "@/config/api";
import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";
import type { QueueEntry } from "@/types/queue";
import type { RouteTimeSlot, TravelRoute } from "@/types/route";

const MAP_PLACEHOLDER = require("@/assets/animated/map_draw.gif");

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

function formatSlot(slot?: RouteTimeSlot) {
  if (!slot?.startTime || !slot?.endTime) return "Schedule pending";
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Schedule pending";
  }
  const startTime = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${startTime} - ${endTime}`;
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
  const [userGroup, setUserGroup] = useState<any>(null);
  const [checkingGroup, setCheckingGroup] = useState(false);

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
    async (slotId?: string | null, silent = false) => {
      if (!token || !routeId) return;

      if (!silent) setQueueLoading(true);

      try {
        const queueUrl = slotId
          ? `${API_ENDPOINTS.routes.queue(routeId)}?slotId=${encodeURIComponent(slotId)}`
          : API_ENDPOINTS.routes.queue(routeId);

        const response = await fetch(queueUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // update only if changed
        setQueue((prev) =>
          JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
        );
      } finally {
        if (!silent) setQueueLoading(false);
      }
    },
    [routeId, token],
  );

  const loadUserGroup = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(API_ENDPOINTS.groups.current, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const groupData = await response.json();
        setUserGroup(groupData);
      } else {
        setUserGroup(null);
      }
    } catch (err) {
      setUserGroup(null);
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadRoute();
      await loadUserGroup();
      setLoading(false);
    })();
  }, [loadRoute, loadUserGroup]);

  useEffect(() => {
    loadQueue(selectedSlotId);
  }, [loadQueue, selectedSlotId]);

  useFocusEffect(
    useCallback(() => {
      loadRoute();
      loadQueue(selectedSlotId);
      loadUserGroup();

      // Poll for queue and group updates every 2.5 seconds
      const pollInterval = setInterval(() => {
        loadQueue(selectedSlotId, true);
        loadUserGroup();
      }, 2500);

      return () => {
        clearInterval(pollInterval);
      };
    }, [loadRoute, loadQueue, selectedSlotId, loadUserGroup]),
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

  const isInGroup = useMemo(() => {
    if (!user?._id || !userGroup) return false;
    return userGroup.members?.some((m: any) =>
      typeof m === "string" ? m === user._id : m._id === user._id,
    );
  }, [userGroup, user?._id]);

  const canJoinQueue = !isInQueue && !isInGroup;
  // If they are in a group or loading, disable the button (they must leave the group from the Group Screen)
  const buttonDisabled = actionLoading || isInGroup;

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
            color="#8B5CF6"
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
          <View style={styles.glassBox}>
            <Text style={styles.emptyTitle}>Route not found</Text>
            <Text style={styles.emptyText}>{error ?? "Try again later."}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const batchSize = route.batchSize || 4;
  const fillPercentage = Math.min(
    Math.round((queue.length / batchSize) * 100),
    100,
  );
  const emptySlots = Math.max(0, batchSize - queue.length);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#E2E8F0" />
          </Pressable>
          <Text style={styles.headerTitle}>Route Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* MAP CARD */}
          <View style={styles.mapCard}>
            <Image
              source={MAP_PLACEHOLDER}
              style={styles.mapImage}
              resizeMode="cover"
            />
            {/* Restructured info box below the map inside the same container */}
            <View style={styles.mapInfoContainer}>
              <View style={styles.locationRow}>
                <View style={[styles.dot, { backgroundColor: "#A78BFA" }]} />
                <View style={styles.locationTextWrapper}>
                  <Text style={styles.locationLabel}>Origin</Text>
                  <Text style={styles.locationText} numberOfLines={2}>
                    {route.start}
                  </Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <View style={[styles.dot, { backgroundColor: "#4ADE80" }]} />
                <View style={styles.locationTextWrapper}>
                  <Text style={styles.locationLabel}>Destination</Text>
                  <Text style={styles.locationText} numberOfLines={2}>
                    {route.destination}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* TIME SLOTS */}
          {route.timeSlots && route.timeSlots.length > 0 ? (
            <View style={styles.slotsContainer}>
              <Text style={styles.sectionTitle}>Available Slots</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.slotRow}
              >
                {route.timeSlots.map((slot) => (
                  <Pressable
                    key={slot._id}
                    onPress={() => setSelectedSlotId(slot._id)}
                    style={[
                      styles.slotChip,
                      selectedSlotId === slot._id && styles.slotChipActive,
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={
                        selectedSlotId === slot._id ? "#F3E8FF" : "#94A3B8"
                      }
                    />
                    <Text
                      style={[
                        styles.slotChipText,
                        selectedSlotId === slot._id &&
                          styles.slotChipTextActive,
                      ]}
                    >
                      {formatSlot(slot)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* STATS GRID */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="swap-horizontal" size={20} color="#A78BFA" />
              <View>
                <Text style={styles.statLabel}>Route Type</Text>
                <Text style={styles.statValue}>
                  {route.routeType === "QUICK_ROUTE" ? "Quick" : "Student"}
                </Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="people" size={20} color="#A78BFA" />
              <View>
                <Text style={styles.statLabel}>Batch Size</Text>
                <Text style={styles.statValue}>{batchSize} Max</Text>
              </View>
            </View>
          </View>

          {/* QUEUE SUMMARY */}
          <View style={styles.card}>
            <View style={styles.queueHeaderRow}>
              <View>
                <Text style={styles.statLabel}>Current Queue</Text>
                <View style={styles.queueCountRow}>
                  <Text style={styles.statValue}>{queue.length} Students</Text>
                  {queue.length > 0 ? (
                    <Ionicons
                      name="trending-up"
                      size={16}
                      color="#4ADE80"
                      style={{ marginLeft: 6 }}
                    />
                  ) : null}
                </View>
              </View>
              <View style={styles.percentageCircle}>
                <Text style={styles.percentageText}>{fillPercentage}%</Text>
              </View>
            </View>
          </View>

          {/* FEMALE TOGGLE */}
          {canPickFemaleOnly ? (
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <Ionicons name="female" size={18} color="#A78BFA" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Female Only Match</Text>
                  <Text style={styles.toggleSubtitle}>
                    Prefer sharing with female students
                  </Text>
                </View>
                <Switch
                  value={femaleOnly}
                  onValueChange={setFemaleOnly}
                  trackColor={{ false: "#3F3F46", true: "#8B5CF6" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ) : null}

          {/* STUDENTS IN QUEUE */}
          <View style={styles.queueSection}>
            <Text style={styles.sectionHeading}>Students in Queue</Text>

            <View style={styles.queueList}>
              {queueLoading ? (
                <ActivityIndicator
                  color="#8B5CF6"
                  size="small"
                  style={{ marginVertical: 10 }}
                />
              ) : null}

              {!queueLoading && queue.length > 0
                ? queue.map((entry) => {
                    const member =
                      typeof entry.userId === "string" ? null : entry.userId;
                    const memberId =
                      member?._id ||
                      (typeof entry.userId === "string"
                        ? entry.userId
                        : "default");
                    const avatarSource = getAvatarForId(memberId);

                    return (
                      <View key={entry._id} style={styles.queueItemCard}>
                        <View style={styles.queueItemLeft}>
                          <Image
                            source={avatarSource}
                            style={styles.avatarImage}
                          />
                          <View>
                            <Text style={styles.studentName}>
                              {member?.name ?? "Student"}
                            </Text>
                            <Text style={styles.studentDetail}>
                              {member?.usn || "Member"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.joinedBadge}>
                          <Text style={styles.joinedText}>In Queue</Text>
                        </View>
                      </View>
                    );
                  })
                : null}

              {/* EMPTY SLOTS */}
              {!queueLoading
                ? Array.from({ length: emptySlots }).map((_, idx) => (
                    <View key={`empty-${idx}`} style={styles.emptySlotCard}>
                      <View style={styles.emptySlotIcon}>
                        <Ionicons name="person-add" size={16} color="#52525B" />
                      </View>
                      <View>
                        <Text style={styles.emptySlotTitle}>
                          Available Slot
                        </Text>
                        <Text style={styles.emptySlotText}>Join to fill</Text>
                      </View>
                    </View>
                  ))
                : null}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* BOTTOM ACTION BUTTON */}
        <View style={styles.bottomBar}>
          <Pressable
            accessibilityRole="button"
            onPress={
              actionLoading
                ? undefined
                : isInQueue
                  ? handleLeave
                  : canJoinQueue
                    ? handleJoin
                    : undefined
            }
            disabled={buttonDisabled}
            style={[
              styles.actionButton,
              isInQueue && !actionLoading && styles.actionButtonLeave, // Uses your existing dark gray style
              buttonDisabled && styles.actionButtonDisabled,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading
                ? "Working..."
                : isInGroup
                  ? "In Group - Leave to Join"
                  : isInQueue
                    ? "Leave Queue" // Updated text
                    : "Join Queue"}
            </Text>

            {!actionLoading && canJoinQueue && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            )}
            {!actionLoading && isInQueue && (
              <Ionicons
                name="exit-outline"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            )}
          </Pressable>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E9D5FF",
  },
  content: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  mapCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#262626",
    // Removed fixed height: 160 to allow card to expand safely
  },
  mapImage: {
    width: "100%",
    height: 130, // Keeps the map look consistent at the top
    opacity: 0.6,
  },
  mapInfoContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#171717",
    gap: 16, // Adds breathing room between origin and destination
  },
  locationRow: {
    flex: 1, // Ensures both sides split the screen equally (50/50)
    flexDirection: "row",
    alignItems: "flex-start", // Aligns nicely if text wraps to 2 lines
    gap: 8,
  },
  locationTextWrapper: {
    flex: 1, // Forces text container to fill space and respect bounds
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4, // Centers the dot with the first line of text
  },
  locationLabel: {
    fontSize: 11,
    color: "#A1A1AA",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 2,
    flexWrap: "wrap", // Safely forces text wrapping
  },
  slotsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  slotRow: {
    gap: 10,
  },
  slotChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#262626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#171717",
  },
  slotChipActive: {
    borderColor: "#8B5CF6",
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  slotChipText: {
    fontSize: 13,
    color: "#A1A1AA",
    fontWeight: "500",
  },
  slotChipTextActive: {
    color: "#E9D5FF",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#262626",
    gap: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#A1A1AA",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#171717",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#262626",
  },
  queueHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  queueCountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  percentageText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E9D5FF",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  toggleSubtitle: {
    fontSize: 12,
    color: "#A1A1AA",
    marginTop: 2,
  },
  queueSection: {
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  queueList: {
    gap: 12,
  },
  queueItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#171717",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#262626",
  },
  queueItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#262626",
  },
  studentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  studentDetail: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 2,
  },
  joinedBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  joinedText: {
    fontSize: 11,
    color: "#D4D4D8",
    fontWeight: "500",
  },
  emptySlotCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#262626",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  emptySlotIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },
  emptySlotTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#52525B",
  },
  emptySlotText: {
    fontSize: 13,
    color: "#3F3F46",
    marginTop: 2,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#0A0A0A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  actionButton: {
    flexDirection: "row",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B5CF6",
  },
  actionButtonDisabled: {
    backgroundColor: "#52525B",
    opacity: 0.6,
  },
  actionButtonLeave: {
    backgroundColor: "#27272A",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: BrandColors.danger,
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassBox: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#262626",
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 14,
    color: "#A1A1AA",
    textAlign: "center",
  },
});
