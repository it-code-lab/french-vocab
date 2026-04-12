import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

export function AppButton({ title, onPress, variant = 'secondary', style }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, style, pressed && styles.pressed]}>
      {variant === 'primary' ? (
        <LinearGradient colors={theme.gradients.primary} style={styles.gradientButton}>
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      ) : (
        <Text style={[styles.secondaryText, variant === 'danger' && styles.dangerText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 52,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  gradientButton: {
    minHeight: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  dangerText: {
    color: '#ffd5d5',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
});
