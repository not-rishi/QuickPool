import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
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

import { PrimaryButton } from "@/components/ui/primary-button";
import { QuickPoolLogo } from "@/components/branding/quickpool-logo";
import { API_ENDPOINTS } from "@/config/api";
import { BrandColors } from "@/constants/brand";
import { useAuth } from "@/context/auth-context";
import type { RouteBatchSize } from "@/types/route";

type FormErrors = {
  start?: string;
  destination?: string;
  batchSize?: string;
  startTime?: string;
  endTime?: string;
  submit?: string;
};

const BATCH_OPTIONS: RouteBatchSize[] = [3, 4, 6];

export default function CreateRouteScreen() {
  const { token } = useAuth();
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [batchSize, setBatchSize] = useState<RouteBatchSize | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(start && destination && batchSize && startTime && endTime);
  }, [start, destination, batchSize, startTime, endTime]);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!start.trim()) {
      nextErrors.start = "Start location is required.";
    }

    if (!destination.trim()) {
      nextErrors.destination = "Destination is required.";
    }

    if (!batchSize) {
      nextErrors.batchSize = "Select a batch size.";
    }

    if (!startTime.trim()) {
      nextErrors.startTime = "Start time is required.";
    }

    if (!endTime.trim()) {
      nextErrors.endTime = "End time is required.";
    }

    const parsedStart = new Date(startTime);
    if (startTime.trim() && Number.isNaN(parsedStart.getTime())) {
      nextErrors.startTime =
        "Use a valid ISO date-time (e.g. 2026-05-25T18:30:00+05:30).";
    }

    const parsedEnd = new Date(endTime);
    if (endTime.trim() && Number.isNaN(parsedEnd.getTime())) {
      nextErrors.endTime =
        "Use a valid ISO date-time (e.g. 2026-05-25T20:00:00+05:30).";
    }

    if (
      startTime.trim() &&
      endTime.trim() &&
      !Number.isNaN(parsedStart.getTime()) &&
      !Number.isNaN(parsedEnd.getTime()) &&
      parsedEnd <= parsedStart
    ) {
      nextErrors.endTime = "End time must be after the start time.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!token) {
      setErrors({ submit: "Please log in again to create a route." });
      return;
    }

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        start: start.trim(),
        destination: destination.trim(),
        description: description.trim() || undefined,
        batchSize,
        timeSlots: [
          {
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
          },
        ],
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
      setErrors({ submit: err.message || "Failed to create route." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
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
              <View>
                <Text style={styles.title}>Create a route</Text>
                <Text style={styles.subtitle}>
                  Share where you are heading and when you want to start.
                </Text>
              </View>
            </BlurView>

            <BlurView intensity={26} tint="dark" style={styles.formCard}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Start location</Text>
                <TextInput
                  placeholder="Main Gate"
                  placeholderTextColor="#6B7280"
                  value={start}
                  onChangeText={setStart}
                  style={styles.input}
                />
                {errors.start ? (
                  <Text style={styles.error}>{errors.start}</Text>
                ) : null}
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Destination</Text>
                <TextInput
                  placeholder="MG Road"
                  placeholderTextColor="#6B7280"
                  value={destination}
                  onChangeText={setDestination}
                  style={styles.input}
                />
                {errors.destination ? (
                  <Text style={styles.error}>{errors.destination}</Text>
                ) : null}
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  placeholder="Optional notes to help others"
                  placeholderTextColor="#6B7280"
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.input, styles.textArea]}
                  multiline
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Batch size</Text>
                <View style={styles.batchRow}>
                  {BATCH_OPTIONS.map((size) => (
                    <Pressable
                      key={size}
                      accessibilityRole="button"
                      onPress={() => setBatchSize(size)}
                      style={[
                        styles.batchChip,
                        batchSize === size && styles.batchChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.batchChipText,
                          batchSize === size && styles.batchChipTextActive,
                        ]}
                      >
                        {size} people
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {errors.batchSize ? (
                  <Text style={styles.error}>{errors.batchSize}</Text>
                ) : null}
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Start time</Text>
                <TextInput
                  placeholder="2026-05-25T18:30:00+05:30"
                  placeholderTextColor="#6B7280"
                  value={startTime}
                  onChangeText={setStartTime}
                  style={styles.input}
                  autoCapitalize="none"
                />
                <Text style={styles.hint}>Use ISO 8601 date-time format.</Text>
                {errors.startTime ? (
                  <Text style={styles.error}>{errors.startTime}</Text>
                ) : null}
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>End time</Text>
                <TextInput
                  placeholder="2026-05-25T20:00:00+05:30"
                  placeholderTextColor="#6B7280"
                  value={endTime}
                  onChangeText={setEndTime}
                  style={styles.input}
                  autoCapitalize="none"
                />
                {errors.endTime ? (
                  <Text style={styles.error}>{errors.endTime}</Text>
                ) : null}
              </View>

              {errors.submit ? (
                <Text style={styles.error}>{errors.submit}</Text>
              ) : null}

              <PrimaryButton
                label="Create route"
                loading={loading}
                disabled={!canSubmit || loading}
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 18,
  },
  headerGlass: {
    borderRadius: 20,
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
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(18, 18, 18, 0.45)",
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E5E7EB",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(9, 9, 11, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#ffffff",
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  error: {
    fontSize: 12,
    color: BrandColors.danger,
  },
  batchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  batchChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(17, 24, 39, 0.6)",
  },
  batchChipActive: {
    borderColor: "rgba(10, 126, 164, 0.6)",
    backgroundColor: "rgba(10, 126, 164, 0.2)",
  },
  batchChipText: {
    fontSize: 13,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  batchChipTextActive: {
    color: "#E6F4FE",
  },
  submitButton: {
    marginTop: 8,
  },
});
