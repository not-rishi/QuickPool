import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { API_ENDPOINTS } from "@/config/api";
import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";
import type { NoShowReport } from "@/types/group";
import type { TravelRoute } from "@/types/route";

const BACKGROUND_IMAGE = require("@/assets/images/background.png");
const ANIMATED_ICON = require("@/assets/images/icon.gif");
const ANIMATED_BANNER = require("@/assets/animated/group.gif");
const GROUP_IMG = require("@/assets/images/group.png");

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

export default function GroupScreen() {
  const { token, user } = useAuth();
  const [group, setGroup] = useState<any | null>(null);
  const [route, setRoute] = useState<TravelRoute | null>(null);
  const [reports, setReports] = useState<NoShowReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [selectedReportUserId, setSelectedReportUserId] = useState<
    string | null
  >(null);
  const [selectedSwapUserId, setSelectedSwapUserId] = useState<string | null>(
    null,
  );
  const [panicMessage, setPanicMessage] = useState("");
  const [panicConfirm, setPanicConfirm] = useState(false);

  const loadGroup = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.groups.current, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to load group");
      }

      const data = await response.json();
      setGroup(data);

      if (data?.routeId) {
        const routeResponse = await fetch(
          API_ENDPOINTS.routes.details(data.routeId),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (routeResponse.ok) {
          const routeData = (await routeResponse.json()) as TravelRoute;
          setRoute(routeData);
        }

        const reportResponse = await fetch(
          API_ENDPOINTS.groups.reportStatus(data._id),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (reportResponse.ok) {
          const reportData = (await reportResponse.json()) as NoShowReport[];
          setReports(reportData);
        }
      } else {
        setRoute(null);
        setReports([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load group.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadGroup();
      setPanicConfirm(false);
    }, [loadGroup]),
  );

  const memberList = useMemo(() => {
    return (group?.members ?? []).filter(
      (member: any) => member._id !== user?._id,
    );
  }, [group?.members, user?._id]);

  const reportWindow = useMemo(() => {
    if (!group || group.status !== "STARTED") {
      return {
        allowed: false,
        label: "No-Show reporting unlocks immediately after the ride starts.",
      };
    }

    const startTimeStamp = group.updatedAt || group.rideTime;
    if (!startTimeStamp) {
      return {
        allowed: true,
        label:
          "Ride is Active. Reporting window open (5-minute countdown active).",
      };
    }

    const startExecutionTime = new Date(startTimeStamp);
    if (Number.isNaN(startExecutionTime.getTime())) {
      return {
        allowed: true,
        label:
          "Ride is Active. Reporting window open (5-minute countdown active).",
      };
    }

    const closeTime = new Date(startExecutionTime.getTime() + 5 * 60 * 1000);
    const now = new Date();

    if (now <= closeTime) {
      return {
        allowed: true,
        label: "Active Reporting Window Open (Closing soon).",
      };
    }

    return {
      allowed: false,
      label: "Report window has expired (5-minute tracking passed).",
    };
  }, [group?.status, group?.updatedAt, group?.rideTime]);

  const handleStartRide = async () => {
    if (!token || !group) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.groups.current.replace("/current", "")}/${group._id}/start`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start ride");
      }

      await loadGroup();
    } catch (err: any) {
      setError(err.message || "Failed to start the ride.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!token || !group) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.groups.leave(group._id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to leave group");
      }

      await loadGroup();
    } catch (err: any) {
      setError(err.message || "Failed to leave group.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!token || !group || !selectedSwapUserId) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.groups.swap(group._id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avoidUserId: selectedSwapUserId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to request swap");
      }

      setSelectedSwapUserId(null);
    } catch (err: any) {
      setError(err.message || "Failed to request swap.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReport = async () => {
    if (!token || !group || !selectedReportUserId || !reportWindow.allowed)
      return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.groups.report(group._id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportedUserId: selectedReportUserId,
          reason: reportReason.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to submit report");
      }

      setReportReason("");
      setSelectedReportUserId(null);
      await loadGroup();
    } catch (err: any) {
      setError(err.message || "Failed to submit report.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePanic = async () => {
    if (!token || !group) return;

    if (!panicConfirm) {
      setPanicConfirm(true);
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.groups.panic(group._id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: panicMessage.trim() || "Emergency alert",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to send panic alert");
      }

      setPanicMessage("");
      setPanicConfirm(false);
    } catch (err: any) {
      setError(err.message || "Failed to send panic alert.");
    } finally {
      setActionLoading(false);
    }
  };

  const makeCall = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(() => {
      setError("Unable to open device system dialer application.");
    });
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

  if (!group) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BACKGROUND_IMAGE}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <View style={styles.dimOverlay} />

        <SafeAreaView style={styles.safe} edges={["top"]}>
          <View style={styles.glassBox}>
            <View style={styles.gifContainer}>
              <Image source={ANIMATED_ICON} style={styles.animatedGif} />
            </View>
            <Text style={styles.emptyTitle}>No active group</Text>
            <Text style={styles.emptyText}>
              Join an available pipeline matching your scheduled hour to
              initialize grouping algorithms.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={styles.dimOverlay} />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER CARD */}
          <View style={styles.glassHeaderCard}>
            <View style={styles.headerTopRow}>
              <View style={styles.titleWithGif}>
                <View style={styles.headerGifBox}>
                  <Image source={GROUP_IMG} style={styles.headerGif} />
                </View>
                <Text style={styles.headerTitle}>Group Info</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {group.status ?? "FORMED"}
                </Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              {route
                ? `${route.start} → ${route.destination}`
                : "Route pipelines updating..."}
            </Text>
          </View>

          <View style={styles.mapBannerCard}>
            <ImageBackground
              source={ANIMATED_BANNER}
              style={styles.mapBannerImage}
              imageStyle={{ opacity: 0.4 }}
              resizeMode="cover"
            >
              <View style={styles.mapBannerOverlay}>
                <View>
                  <Text style={styles.mapBannerTitle}>
                    Your Group info will appear here
                  </Text>
                  <Text style={styles.mapBannerSubtitle}>
                    Do not be late for the ride!
                  </Text>
                </View>
                <View style={styles.mapBannerIconBox}>
                  <Ionicons name="people" size={20} color="#ffffff" />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* MANUAL START RIDE CONTROLLER */}
          {group.status === "FORMED" && (
            <View
              style={[
                styles.card,
                {
                  borderColor: "rgba(139, 92, 246, 0.25)",
                  backgroundColor: "rgba(139, 92, 246, 0.04)",
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Ride Execution Pipeline</Text>
              <Text style={styles.cardDescription}>
                Are all matched cluster members present at the target station?
                Any single passenger can manually initialize the trip status
                tracking layer.
              </Text>
              <Pressable
                onPress={handleStartRide}
                disabled={actionLoading}
                style={[
                  styles.actionButton,
                  { backgroundColor: "#8B5CF6", marginTop: 4 },
                ]}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons
                      name="car-sport-outline"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.actionButtonText}>
                      Start Ride for Group
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* MEMBERS ROSTER CARD */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Members Roster</Text>
            <View style={styles.divider} />
            {(group.members ?? []).map((member: any) => {
              const isCurrentUser = member._id === user?._id;
              const avatarSource = getAvatarForId(member._id);

              return (
                <View key={member._id} style={styles.memberRow}>
                  <Image source={avatarSource} style={styles.avatarImage} />
                  <View style={styles.memberInfoBlock}>
                    <View style={styles.nameHeaderRow}>
                      <Text style={styles.memberName} numberOfLines={1}>
                        {member.name ?? "Student"}
                      </Text>
                      {isCurrentUser && (
                        <View style={styles.youBadge}>
                          <Text style={styles.youText}>You</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.memberMeta}>
                      {member.usn || "Member Verified"}
                    </Text>

                    {/* INTERACTIVE PHONE INTERFACE LINK */}
                    {member.phone ? (
                      <Pressable
                        onPress={() => makeCall(member.phone)}
                        style={({ pressed }) => [
                          styles.communicationRow,
                          pressed && { opacity: 0.6 },
                        ]}
                      >
                        <Ionicons
                          name="call-outline"
                          size={13}
                          color="#a78bfa"
                        />
                        <Text style={styles.memberPhone} numberOfLines={1}>
                          {member.phone}
                        </Text>
                      </Pressable>
                    ) : (
                      <View style={styles.communicationRow}>
                        <Ionicons
                          name="call-outline"
                          size={13}
                          color="#52525B"
                        />
                        <Text
                          style={[styles.memberPhone, { color: "#52525B" }]}
                          numberOfLines={1}
                        >
                          No registered phone
                        </Text>
                      </View>
                    )}

                    {/* EMAIL RE-ROUTED DIRECTLY BELOW PHONE UNDER SINGLE AUTO LAYOUT COLUMN */}
                    <View style={styles.communicationRow}>
                      <Ionicons name="mail-outline" size={13} color="#A1A1AA" />
                      <Text style={styles.memberEmail} numberOfLines={1}>
                        {member.email ?? "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            <View style={styles.hintContainer}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#71717A"
              />
              <Text style={styles.hintText}>
                Contact credentials become visible upon group structure
                settlement.
              </Text>
            </View>
          </View>

          {/* SWAP SEGMENT CARD */}
          {memberList.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Swap Parameters</Text>
              <Text style={styles.cardDescription}>
                Select a specific target node to minimize cluster matching
                factors in subsequent grouping routines.
              </Text>
              <View style={styles.chipRow}>
                {memberList.map((member: any) => (
                  <Pressable
                    key={member._id}
                    onPress={() => setSelectedSwapUserId(member._id)}
                    style={[
                      styles.chip,
                      selectedSwapUserId === member._id && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedSwapUserId === member._id &&
                          styles.chipTextActive,
                      ]}
                    >
                      {member.name ?? member.usn ?? "Student"}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={handleSwap}
                disabled={!selectedSwapUserId || actionLoading}
                style={[
                  styles.actionButton,
                  styles.secondaryButton,
                  !selectedSwapUserId && { opacity: 0.5 },
                ]}
              >
                <Ionicons
                  name="git-compare-outline"
                  size={16}
                  color="#E9D5FF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionButtonText}>
                  Confirm Swap Preference
                </Text>
              </Pressable>
            </View>
          )}

          {/* REPORT NODE CARD */}
          {memberList.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>No-Show Protocol</Text>
              <View style={styles.windowStatusRow}>
                <Ionicons
                  name={
                    reportWindow.allowed
                      ? "checkmark-circle-outline"
                      : "alert-circle-outline"
                  }
                  size={14}
                  color={reportWindow.allowed ? "#4ADE80" : "#94A3B8"}
                />
                <Text style={styles.cardDescription}>{reportWindow.label}</Text>
              </View>

              <View style={styles.chipRow}>
                {memberList.map((member: any) => (
                  <Pressable
                    key={member._id}
                    onPress={() => setSelectedReportUserId(member._id)}
                    style={[
                      styles.chip,
                      selectedReportUserId === member._id &&
                        styles.chipActiveWarning,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedReportUserId === member._id &&
                          styles.chipTextActiveWarning,
                      ]}
                    >
                      {member.name ?? member.usn ?? "Student"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                placeholder="Specify logs/incident details..."
                placeholderTextColor="#52525B"
                value={reportReason}
                onChangeText={setReportReason}
                style={styles.input}
              />

              <Pressable
                onPress={handleReport}
                disabled={
                  !reportWindow.allowed ||
                  !selectedReportUserId ||
                  actionLoading
                }
                style={[
                  styles.actionButton,
                  styles.warningButton,
                  (!reportWindow.allowed || !selectedReportUserId) && {
                    opacity: 0.5,
                  },
                ]}
              >
                <Ionicons
                  name="flag-outline"
                  size={16}
                  color="#FBBF24"
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.actionButtonText, { color: "#FBBF24" }]}>
                  File No-Show Complaint
                </Text>
              </Pressable>

              {reports.length > 0 ? (
                <View style={styles.reportCountBadge}>
                  <Text style={styles.reportCountText}>
                    Active incident reports filed: {reports.length}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* EMERGENCY SYSTEM OVERLAY */}
          {group.status === "STARTED" && (
            <View
              style={[styles.card, { borderColor: "rgba(239, 68, 68, 0.25)" }]}
            >
              <Text style={[styles.sectionTitle, { color: "#F87171" }]}>
                Safety Intervention
              </Text>
              <Text style={styles.cardDescription}>
                Dispatch tracking alarms instantly to platform dispatch admins
                if unexpected trajectory shifts occur.
              </Text>
              <TextInput
                placeholder="Optional spatial location or status context..."
                placeholderTextColor="#52525B"
                value={panicMessage}
                onChangeText={setPanicMessage}
                style={[
                  styles.input,
                  { borderColor: "rgba(239, 68, 68, 0.2)" },
                ]}
              />

              <Pressable
                onPress={handlePanic}
                disabled={actionLoading}
                style={[
                  styles.actionButton,
                  styles.dangerButton,
                  panicConfirm && { backgroundColor: "#DC2626" },
                ]}
              >
                <Ionicons
                  name={panicConfirm ? "alert-circle" : "skull-outline"}
                  size={16}
                  color="#FFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionButtonText}>
                  {panicConfirm
                    ? "TAP AGAIN TO CONFIRM EMERGENCY!"
                    : "Trigger System Panic Alert"}
                </Text>
              </Pressable>

              {panicConfirm && (
                <Pressable
                  onPress={() => setPanicConfirm(false)}
                  style={{ padding: 4, alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: "#A1A1AA",
                      fontSize: 12,
                      textDecorationLine: "underline",
                    }}
                  >
                    Cancel Request
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            onPress={handleLeaveGroup}
            disabled={actionLoading}
            style={[styles.actionButton, styles.leaveButton]}
          >
            <Ionicons
              name="exit-outline"
              size={16}
              color="#F4F4F5"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionButtonText}>De-register from Group</Text>
          </Pressable>

          <View style={{ height: 40 }} />
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
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 5, 0.88)",
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 120,
  },
  glassHeaderCard: {
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleWithGif: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerGifBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#17171900",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerGif: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  statusBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E9D5FF",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    color: "#A1A1AA",
    marginTop: 10,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "rgba(23, 23, 23, 0.45)",
    borderRadius: 22,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E5E7EB",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  cardDescription: {
    fontSize: 13,
    color: "#A1A1AA",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginVertical: 2,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    gap: 14,
    width: "100%",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 2,
  },
  memberInfoBlock: {
    flex: 1,
    flexDirection: "column",
    gap: 3,
  },
  nameHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    maxWidth: "80%",
  },
  youBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  youText: {
    fontSize: 10,
    color: "#D4D4D8",
    fontWeight: "600",
  },
  memberMeta: {
    fontSize: 12,
    color: "#71717A",
  },
  communicationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 1,
    width: "100%",
  },
  memberPhone: {
    fontSize: 13,
    color: "#a78bfa",
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
  },
  memberEmail: {
    fontSize: 12,
    color: "#A1A1AA",
    fontWeight: "400",
    flex: 1,
  },
  hintContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    alignItems: "flex-start",
  },
  hintText: {
    fontSize: 12,
    color: "#71717A",
    flex: 1,
    lineHeight: 16,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "#141416",
  },
  chipActive: {
    borderColor: "rgba(139, 92, 246, 0.4)",
    backgroundColor: "rgba(139, 92, 246, 0.12)",
  },
  chipActiveWarning: {
    borderColor: "rgba(245, 158, 11, 0.4)",
    backgroundColor: "rgba(245, 158, 11, 0.12)",
  },
  chipText: {
    fontSize: 12,
    color: "#A1A1AA",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#E9D5FF",
    fontWeight: "600",
  },
  chipTextActiveWarning: {
    color: "#FDE68A",
    fontWeight: "600",
  },
  windowStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "#141416",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#FFFFFF",
    marginTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#1F1F23",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  warningButton: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.25)",
  },
  dangerButton: {
    backgroundColor: "#EF4444",
  },
  leaveButton: {
    backgroundColor: "#27272A",
    marginTop: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  reportCountBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  reportCountText: {
    fontSize: 12,
    color: "#F87171",
    fontWeight: "500",
  },
  errorText: {
    color: BrandColors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassBox: {
    margin: 24,
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
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#171719",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  animatedGif: {
    width: "100%",
    height: "100%",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 13,
    color: "#A1A1AA",
    lineHeight: 20,
    textAlign: "center",
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
});
