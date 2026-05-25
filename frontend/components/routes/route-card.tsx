import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { TravelRoute } from '@/types/route';

type RouteCardProps = {
  route: TravelRoute;
};

export function RouteCard({ route }: RouteCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.routeTitle}>
          {route.start} → {route.destination}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{route.batchSize}</Text>
        </View>
      </View>
      {route.description ? <Text style={styles.description}>{route.description}</Text> : null}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {route.routeType === 'QUICK_ROUTE' ? 'Quick route' : 'Student route'}
        </Text>
        {route.createdBy?.name ? (
          <Text style={styles.meta}>by {route.createdBy.name}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  routeTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.text,
  },
  badge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BrandColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: BrandColors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: BrandColors.muted,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    fontSize: 12,
    color: BrandColors.muted,
    fontWeight: '500',
  },
});
