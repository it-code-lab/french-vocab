import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../theme';

export function GlassPanel({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.shell, style]} {...rest}>
      <LinearGradient colors={theme.gradients.panelOverlay} style={StyleSheet.absoluteFillObject} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: theme.colors.panel,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
});
