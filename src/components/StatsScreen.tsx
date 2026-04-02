import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadSessions, computeStats } from '../lib/storage';
import { colors } from '../lib/theme';

interface StatsData {
  totalSessions: number;
  totalMinutes: number;
  thisWeek: number;
  streak: number;
  triggerCounts: { anxiety: number; avoiding: number; bored: number };
  weekDays: { date: string; count: number }[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TRIGGER_LABELS = { bored: 'Boredom', anxiety: 'Anxiety', avoiding: 'Avoidance' };

interface Props {
  onBack: () => void;
}

export default function StatsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    loadSessions().then(sessions => setStats(computeStats(sessions)));
  }, []);

  if (!stats) return <View style={[styles.container, { paddingTop: insets.top }]} />;

  const maxBarCount = Math.max(...stats.weekDays.map(d => d.count), 1);
  const hours = Math.floor(stats.totalMinutes / 60);
  const mins = stats.totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Your progress</Text>

      {/* Streak hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroNumber}>{stats.streak}</Text>
        <Text style={styles.heroLabel}>day streak</Text>
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.totalSessions}</Text>
          <Text style={styles.summaryLabel}>total sessions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{timeStr}</Text>
          <Text style={styles.summaryLabel}>time reclaimed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.thisWeek}</Text>
          <Text style={styles.summaryLabel}>this week</Text>
        </View>
      </View>

      {/* Week bar chart */}
      <Text style={styles.sectionTitle}>Last 7 days</Text>
      <View style={styles.barChart}>
        {stats.weekDays.map((day, i) => {
          const dayName = DAY_LABELS[new Date(day.date + 'T12:00:00').getDay()];
          const barHeight = day.count > 0 ? Math.max((day.count / maxBarCount) * 80, 8) : 0;
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                {barHeight > 0 && (
                  <View style={[styles.bar, { height: barHeight }]} />
                )}
              </View>
              <Text style={styles.barLabel}>{dayName}</Text>
            </View>
          );
        })}
      </View>

      {/* Trigger breakdown */}
      <Text style={styles.sectionTitle}>What brought you here</Text>
      <View style={styles.triggerList}>
        {(Object.entries(TRIGGER_LABELS) as [keyof typeof TRIGGER_LABELS, string][]).map(([key, label]) => {
          const count = stats.triggerCounts[key];
          const pct = stats.totalSessions > 0 ? count / stats.totalSessions : 0;
          return (
            <View key={key} style={styles.triggerRow}>
              <Text style={styles.triggerLabel}>{label}</Text>
              <View style={styles.triggerBarTrack}>
                <View style={[styles.triggerBar, { width: `${Math.round(pct * 100)}%` }]} />
              </View>
              <Text style={styles.triggerCount}>{count}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroNumber: {
    color: colors.accent,
    fontSize: 64,
    fontWeight: '300',
    lineHeight: 70,
  },
  heroLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  summaryNumber: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '400',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 110,
    marginBottom: 32,
    backgroundColor: colors.bgElevated,
    borderRadius: 14,
    padding: 16,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    height: 80,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  barLabel: {
    color: colors.textMuted,
    fontSize: 10,
  },
  triggerList: {
    gap: 14,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  triggerLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    width: 88,
  },
  triggerBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bgElevated2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  triggerBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  triggerCount: {
    color: colors.textMuted,
    fontSize: 13,
    width: 24,
    textAlign: 'right',
  },
});
