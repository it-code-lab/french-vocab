import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type Props = {
  label: string;
  value: string;
};

export function MetricCard({ label, value }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    minWidth: 96,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    color: theme.colors.soft,
    fontSize: 12,
    textAlign: 'center',
  },
  value: {
    marginTop: 4,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
});
