import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteCard } from '@/components/routes/route-card';
import { BrandColors } from '@/constants/brand';
import { useAuth } from '@/context/auth-context';
import { ApiError } from '@/services/api';
import { fetchRoutes } from '@/services/routes';
import type { TravelRoute } from '@/types/route';

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
      const data = await fetchRoutes(token);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load routes');
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadRoutes();
      setLoading(false);
    })();
  }, [loadRoutes]);

  async function onRefresh() {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name}>{user?.name ?? user?.usn ?? 'Student'}</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{user?.reputationScore ?? 100}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available routes</Text>
      <Text style={styles.sectionSubtitle}>
        Join a route to get matched with students heading the same way.
      </Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={BrandColors.primary} />
      ) : error ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Could not load routes</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BrandColors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No routes yet</Text>
              <Text style={styles.emptyText}>
                Routes created by students and the system will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <RouteCard route={item} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: BrandColors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 13,
    color: BrandColors.muted,
    fontWeight: '500',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.text,
    marginTop: 2,
  },
  scorePill: {
    alignItems: 'center',
    backgroundColor: BrandColors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  scoreLabel: {
    fontSize: 11,
    color: BrandColors.muted,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
    color: BrandColors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: BrandColors.muted,
    paddingHorizontal: 20,
    paddingBottom: 12,
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  cardWrap: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  emptyBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  emptyText: {
    fontSize: 14,
    color: BrandColors.muted,
    lineHeight: 20,
  },
});
