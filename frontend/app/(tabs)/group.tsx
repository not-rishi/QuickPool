import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuickPoolLogo } from "@/components/branding/quickpool-logo";
import { API_ENDPOINTS } from "@/config/api";
import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";
import type { Group, NoShowReport } from "@/types/group";
import type { TravelRoute } from "@/types/route";

export default function GroupScreen() {
  const { token, user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
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

      const data = (await response.json()) as Group | null;
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
    }, [loadGroup]),
  );

  const memberList = useMemo(() => {
    return (group?.members ?? []).filter((member) => member._id !== user?._id);
  }, [group?.members, user?._id]);

  const reportWindow = useMemo(() => {
    if (!group?.rideTime) {
      return {
        allowed: false,
        label: "Report window opens after the ride starts.",
      };
    }

    const rideTime = new Date(group.rideTime);
    if (Number.isNaN(rideTime.getTime())) {
      return {
        allowed: false,
        label: "Report window opens after the ride starts.",
      };
    }

    const openTime = new Date(rideTime.getTime() + 5 * 60 * 1000);
    const closeTime = new Date(rideTime.getTime() + 10 * 60 * 1000);
    const now = new Date();

    if (now >= openTime && now <= closeTime) {
      return { allowed: true, label: "Report window is open." };
    }

    if (now < openTime) {
      return {
        allowed: false,
        label: "Report window opens 5 minutes after the ride starts.",
      };
    }

    return { allowed: false, label: "Report window has closed." };
  }, [group?.rideTime]);

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
    } catch (err: any) {
      setError(err.message || "Failed to send panic alert.");
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

  if (!group) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <BlurView intensity={30} tint="dark" style={styles.glassBox}>
            <QuickPoolLogo size={64} />
            <Text style={styles.emptyTitle}>No active group</Text>
            <Text style={styles.emptyText}>
              Join a route to start matching with students.
            </Text>
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
              <QuickPoolLogo size={40} />
              <Text style={styles.headerTitle}>Your group</Text>
            </View>
            <Text style={styles.subtitle}>
              {route
                ? `${route.start} to ${route.destination}`
                : "Route details loading"}
            </Text>
            <Text style={styles.metaText}>
              Status: {group.status ?? "FORMED"}
            </Text>
          </BlurView>

          <BlurView intensity={26} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Members</Text>
            {(group.members ?? []).map((member) => (
              <View key={member._id} style={styles.memberRow}>
                <View>
                  <Text style={styles.memberName}>
                    {member.name ?? "Student"}
                  </Text>
                  <Text style={styles.memberMeta}>{member.usn ?? ""}</Text>
                </View>
                <Text style={styles.memberMeta}>{member.email ?? ""}</Text>
              </View>
            ))}
            <Text style={styles.hintText}>
              Contact details show after group formation.
            </Text>
          </BlurView>

          <BlurView intensity={26} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Swap preference</Text>
            <Text style={styles.metaText}>
              Select one member to avoid for future grouping.
            </Text>
            <View style={styles.chipRow}>
              {memberList.map((member) => (
                <Pressable
                  key={member._id}
                  accessibilityRole="button"
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
              accessibilityRole="button"
              onPress={handleSwap}
              disabled={!selectedSwapUserId || actionLoading}
              style={[styles.actionButton, styles.secondaryButton]}
            >
              <Text style={styles.actionButtonText}>
                Confirm swap preference
              </Text>
            </Pressable>
          </BlurView>

          <BlurView intensity={26} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>No-show reporting</Text>
            <Text style={styles.metaText}>{reportWindow.label}</Text>
            <View style={styles.chipRow}>
              {memberList.map((member) => (
                <Pressable
                  key={member._id}
                  accessibilityRole="button"
                  onPress={() => setSelectedReportUserId(member._id)}
                  style={[
                    styles.chip,
                    selectedReportUserId === member._id && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedReportUserId === member._id &&
                        styles.chipTextActive,
                    ]}
                  >
                    {member.name ?? member.usn ?? "Student"}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              placeholder="Optional reason"
              placeholderTextColor="#6B7280"
              value={reportReason}
              onChangeText={setReportReason}
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleReport}
              disabled={
                !reportWindow.allowed || !selectedReportUserId || actionLoading
              }
              style={[styles.actionButton, styles.warningButton]}
            >
              <Text style={styles.actionButtonText}>Submit no-show report</Text>
            </Pressable>
            {reports.length ? (
              <Text style={styles.metaText}>
                Reports filed: {reports.length}
              </Text>
            ) : null}
          </BlurView>

          {group.status === "STARTED" ? (
            <BlurView intensity={26} tint="dark" style={styles.card}>
              <Text style={styles.sectionTitle}>Emergency</Text>
              <Text style={styles.metaText}>
                Tap the panic button to alert admins.
              </Text>
              <TextInput
                placeholder="Optional message"
                placeholderTextColor="#6B7280"
                value={panicMessage}
                onChangeText={setPanicMessage}
                style={styles.input}
              />
              <Pressable
                accessibilityRole="button"
                onPress={handlePanic}
                disabled={actionLoading}
                style={[styles.actionButton, styles.dangerButton]}
              >
                <Text style={styles.actionButtonText}>Send panic alert</Text>
              </Pressable>
            </BlurView>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleLeaveGroup}
            disabled={actionLoading}
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <Text style={styles.actionButtonText}>Leave group</Text>
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
    gap: 12,
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
  metaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  memberMeta: {
    fontSize: 12,
    color: "#94A3B8",
  },
  hintText: {
    fontSize: 12,
    color: "#A1A1AA",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  chipActive: {
    borderColor: "rgba(99, 102, 241, 0.6)",
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  chipText: {
    fontSize: 12,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#E0E7FF",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(9, 9, 11, 0.7)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#ffffff",
  },
  actionButton: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#6366f1",
  },
  secondaryButton: {
    backgroundColor: "rgba(30, 41, 59, 0.9)",
  },
  warningButton: {
    backgroundColor: "rgba(245, 158, 11, 0.25)",
  },
  dangerButton: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
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
