import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type Props = {
  visible: boolean;
  message: string;
};

export function ToastBanner({ visible, message }: Props) {
  const translateY = React.useRef(new Animated.Value(-24)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: visible ? 0 : -24,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.banner,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(11,18,35,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    ...theme.shadow.card,
  },
  text: {
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
});
