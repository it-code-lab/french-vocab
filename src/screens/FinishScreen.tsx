import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SessionSummary } from '../types';
import { AppButton } from '../components/AppButton';
import { GlassPanel } from '../components/GlassPanel';
import { MetricCard } from '../components/MetricCard';
import { theme } from '../theme';

type Props = {
  summary: SessionSummary;
  onRepeat: () => void;
  onBackHome: () => void;
};

export function FinishScreen({ summary, onRepeat, onBackHome }: Props) {
  return (
    <View style={styles.wrapper}>
      <GlassPanel style={styles.card}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.title}>Session Complete!</Text>

        <View style={styles.metrics}>
          <MetricCard label="Studied" value={String(summary.count)} />
          <MetricCard label="Source" value={summary.source} />
          <MetricCard label="Filter" value={summary.filter} />
        </View>

        <View style={styles.actions}>
          <AppButton title="Repeat Session" variant="primary" onPress={onRepeat} />
          <AppButton title="Back Home" onPress={onBackHome} />
        </View>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    fontSize: 54,
    color: theme.colors.success,
    fontWeight: '900',
  },
  title: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  metrics: {
    width: '100%',
    marginTop: 18,
    gap: 10,
  },
  actions: {
    width: '100%',
    marginTop: 22,
    gap: 10,
  },
});
