import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import type { FlashCard } from '../types';
import { theme } from '../theme';

type Props = {
  autoNextProgress: number;
  card: FlashCard;
  flipped: boolean;
  onPress: () => void;
};

export function FlipCard({ autoNextProgress, card, flipped, onPress }: Props) {
  const animation = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: flipped ? 180 : 0,
      duration: 460,
      useNativeDriver: true,
    }).start();
  }, [animation, flipped]);

  const frontSpin = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backSpin = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const cardWidth = Math.min(width - 40, 380);
  const cardHeight = Math.min(Math.max(height * 0.40, 300), 480);

  return (
    <Pressable onPress={onPress} style={[styles.stack, { width: cardWidth, height: cardHeight }]}>
      <Animated.View style={[styles.face, styles.front, { transform: [{ rotateY: frontSpin }] }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{card.broadcat}</Text>
        </View>

        <Text style={styles.wordFront}>{card.fr}</Text>
        <Text style={styles.metaFront}>Tap to reveal the meaning.</Text>
        <Text style={styles.subtleLine}>{card.cat}</Text>
      </Animated.View>

      <Animated.View style={[styles.face, styles.back, { transform: [{ rotateY: backSpin }] }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{card.cat}</Text>
        </View>

        <Text style={styles.wordBackMuted}>{card.fr}</Text>
        <Text style={styles.wordBack}>{card.en}</Text>
        <Text style={styles.metaBack}>Next card starts automatically.</Text>

        <View style={styles.countdownTrack}>
          <View style={[styles.countdownFill, { width: `${Math.max(autoNextProgress, 0) * 100}%` }]} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: {
    alignSelf: 'center',
    perspective: 1200,
  },
  face: {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backfaceVisibility: 'hidden',
    ...theme.shadow.card,
  },
  front: {
    backgroundColor: 'rgba(12,18,34,0.96)',
  },
  back: {
    backgroundColor: 'rgba(12,18,34,0.96)',
  },
  badge: {
    position: 'absolute',
    top: 18,
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  wordFront: {
    color: theme.colors.text,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    textAlign: 'center',
  },
  wordBackMuted: {
    color: theme.colors.muted,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  wordBack: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtleLine: {
    marginTop: 14,
    color: theme.colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  metaFront: {
    marginTop: 14,
    color: theme.colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  metaBack: {
    marginTop: 14,
    color: theme.colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  countdownTrack: {
    width: '82%',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    marginTop: 16,
  },
  countdownFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
});
