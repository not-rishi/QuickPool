import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RouteTimeSlot, TravelRoute } from '@/types/route';

type RouteCardProps = {
  route: TravelRoute;
  onPress?: () => void;
};

function formatSlot(slot?: RouteTimeSlot) {
  if (!slot?.startTime || !slot?.endTime) return 'Schedule pending';
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Schedule pending';
  }

  const date = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `${date} | ${startTime} - ${endTime}`;
}

export function RouteCard({ route, onPress }: RouteCardProps) {
  const primarySlot = route.timeSlots?.[0];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress && styles.cardPressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.routeTitle}>
          {route.start} -> {route.destination}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{route.batchSize}</Text>
        </View>
      </View>
      {route.description ? <Text style={styles.description}>{route.description}</Text> : null}
      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Text style={styles.metaPillText}>
            {route.routeType === 'QUICK_ROUTE' ? 'Quick route' : 'Student route'}
          </Text>
        </View>
        {route.createdBy?.name ? (
          <Text style={styles.metaText}>by {route.createdBy.name}</Text>
        ) : null}
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.slotText}>{formatSlot(primarySlot)}</Text>
        <Text style={styles.detailHint}>View details</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(18, 18, 18, 0.55)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  cardPressed: {
    opacity: 0.92,
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
    color: '#ffffff',
  },
  badge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#A5B4FC',
    fontWeight: '700',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  metaPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaPillText: {
    fontSize: 11,
    color: '#E5E7EB',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  metaText: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotText: {
    fontSize: 12,
    color: '#CBD5F5',
    fontWeight: '600',
  },
  detailHint: {
    fontSize: 11,
    color: '#7DD3FC',
    fontWeight: '700',
  },
});
