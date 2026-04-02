import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Trigger } from '../lib/prompts';
import { colors } from '../lib/theme';

const OPTIONS: { id: Trigger; label: string; sub: string }[] = [
  { id: 'bored',    label: 'Just bored',                sub: 'Scrolling, killing time' },
  { id: 'anxiety',  label: 'Anxiety / FOMO',            sub: 'Worry loop, can\'t settle' },
  { id: 'avoiding', label: 'Avoiding something hard',   sub: 'Procrastinating, overwhelmed' },
];

interface Props {
  selectTrigger: (t: Trigger) => void;
  streak: number;
}

export default function CaughtScreen({ selectTrigger, streak }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 32, paddingTop: insets.top + 16 }]}>
      <View style={styles.topRow}>
        {streak > 0 ? (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>{streak} day streak</Text>
          </View>
        ) : <View />}
        <TouchableOpacity onPress={() => router.push('/stats')} activeOpacity={0.7}>
          <Text style={styles.statsLink}>stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Hey.</Text>
        <Text style={styles.title}>What's actually going on right now?</Text>
      </View>

      <View style={styles.options}>
        {OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => selectTrigger(opt.id)}
            style={styles.option}
            activeOpacity={0.7}
          >
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <Text style={styles.optionSub}>{opt.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.bg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  streakBadge: {
    backgroundColor: colors.bgElevated2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: colors.accent,
    fontSize: 13,
    fontStyle: 'italic',
  },
  statsLink: {
    color: colors.textMuted,
    fontSize: 14,
  },
  header: {
    marginBottom: 40,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '400',
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: 17,
    marginBottom: 3,
  },
  optionSub: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
