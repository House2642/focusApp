import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FALLBACK_COMMITMENT, Trigger } from '../lib/prompts';
import { saveSession } from '../lib/storage';
import { colors } from '../lib/theme';

interface Props {
  commitment: string | null;
  trigger: Trigger | null;
  restart: () => void;
  onDone: () => void;
}

export default function ReentryScreen({ commitment, trigger, restart, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const text = commitment || FALLBACK_COMMITMENT;

  async function handleDid() {
    if (!saved && trigger) {
      setSaved(true);
      await saveSession({ trigger, commitment: text, completed: true });
    }
    onDone();
  }

  async function handleNotYet() {
    if (!saved && trigger) {
      setSaved(true);
      await saveSession({ trigger, commitment: text, completed: false });
    }
    restart();
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 32, paddingTop: insets.top + 16 }]}>
      <Text style={styles.eyebrow}>Your next move</Text>
      <Text style={styles.commitment}>{text}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleDid} style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.primaryText}>I'll do it.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotYet} activeOpacity={0.7}>
          <Text style={styles.secondaryText}>not yet</Text>
        </TouchableOpacity>
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
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  commitment: {
    color: colors.textPrimary,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '400',
    marginBottom: 48,
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.bg,
    fontSize: 18,
  },
  secondaryText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
