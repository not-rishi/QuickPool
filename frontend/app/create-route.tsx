import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth-context";

const BATCH_SIZES = [3, 4, 6];

export default function CreateRouteScreen() {
  const { token } = useAuth();

  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [batchSize, setBatchSize] = useState<number>(4);

  const [startTime, setStartTime] = useState(new Date());

  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000),
  );

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCreateRoute = async () => {
    if (!start.trim() || !destination.trim()) {
      setError("Start and destination are required.");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be after the start time.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const timeSlots = [
        {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      ];

      const payload = {
        start: start.trim(),
        destination: destination.trim(),
        description: description.trim(),
        batchSize,
        routeType: "USER_ROUTE",
        timeSlots,
        expiresAt: endTime.toISOString(),
      };

      const response = await fetch(API_ENDPOINTS.routes.base, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create route");
      }

      router.back();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>New Route</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Main Gate"
                placeholderTextColor="#52525B"
                value={start}
                onChangeText={setStart}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destination</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. City Center"
                placeholderTextColor="#52525B"
                value={destination}
                onChangeText={setDestination}
                editable={!isLoading}
              />
            </View>

            {/* Time Selection Row */}
            <View style={styles.timeRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Start Time</Text>
                <Pressable
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                  disabled={isLoading}
                >
                  <Text style={styles.timeText}>{formatTime(startTime)}</Text>
                </Pressable>
                {showStartPicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    minimumDate={new Date()}
                    maximumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    onChange={(event, date) => {
                      setShowStartPicker(Platform.OS === "ios");
                      if (event.type === "set" && date) {
                        setShowStartPicker(false);
                        setStartTime(date);

                        if (endTime <= date) {
                          setEndTime(new Date(date.getTime() + 60 * 60 * 1000));
                        }
                      } else if (event.type === "dismissed") {
                        setShowStartPicker(false);
                      }
                    }}
                  />
                )}
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Time (Expiry)</Text>
                <Pressable
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                  disabled={isLoading}
                >
                  <Text style={styles.timeText}>{formatTime(endTime)}</Text>
                </Pressable>
                {showEndPicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="spinner"
                    minimumDate={startTime}
                    maximumDate={
                      new Date(startTime.getTime() + 24 * 60 * 60 * 1000)
                    }
                    onChange={(event, date) => {
                      setShowEndPicker(Platform.OS === "ios");
                      if (event.type === "set" && date) {
                        setShowEndPicker(false);
                        setEndTime(date);
                      } else if (event.type === "dismissed") {
                        setShowEndPicker(false);
                      }
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Shares (Batch Size)</Text>
              <View style={styles.batchContainer}>
                {BATCH_SIZES.map((size) => (
                  <Pressable
                    key={size}
                    disabled={isLoading}
                    onPress={() => setBatchSize(size)}
                    style={[
                      styles.batchButton,
                      batchSize === size && styles.batchButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.batchText,
                        batchSize === size && styles.batchTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any extra details for the ride?"
                placeholderTextColor="#52525B"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleCreateRoute}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>Create Route</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  backButton: {
    paddingVertical: 8,
    width: 60,
  },
  backText: {
    color: "#a1a1aa",
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  form: {
    padding: 20,
    gap: 24,
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
  },
  input: {
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  timeRow: {
    flexDirection: "row",
    gap: 16,
  },
  timeButton: {
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  timeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  textArea: {
    height: 100,
  },
  batchContainer: {
    flexDirection: "row",
    gap: 12,
  },
  batchButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    alignItems: "center",
  },
  batchButtonActive: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderColor: "#6366f1",
  },
  batchText: {
    color: "#a1a1aa",
    fontSize: 16,
    fontWeight: "600",
  },
  batchTextActive: {
    color: "#6366f1",
    fontWeight: "800",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 20,
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
