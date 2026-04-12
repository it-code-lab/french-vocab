import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { theme } from '../theme';

type Props = {
  label: string;
  value: string;
  items: string[];
  enabled?: boolean;
  onChange: (value: string) => void;
};

export function SelectField({ label, value, items, enabled = true, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerShell, !enabled && styles.disabled]}>
        <Picker
          selectedValue={value}
          enabled={enabled}
          dropdownIconColor={theme.colors.text}
          style={styles.picker}
          itemStyle={styles.item}
          onValueChange={(nextValue) => onChange(String(nextValue))}
        >
          {items.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  pickerShell: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  picker: {
    color: theme.colors.text,
    ...(Platform.OS === 'android' ? { height: 52 } : {}),
  },
  item: {
    color: theme.colors.text,
    backgroundColor: theme.colors.bg2,
  },
  disabled: {
    opacity: 0.6,
  },
});
