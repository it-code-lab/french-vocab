import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { GlassPanel } from '../components/GlassPanel';
import { MetricCard } from '../components/MetricCard';
import { SelectField } from '../components/SelectField';
import { theme } from '../theme';

type Props = {
  availableCount: number;
  broadcats: string[];
  categories: string[];
  cardCount: string;
  deckCount: number;
  deckSource: string;
  selectedBroadcat: string;
  selectedCategory: string;
  subcategoryCount: number;
  onBroadcatChange: (value: string) => void;
  onCardCountChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onImportDeck: () => void;
  onResetDeck: () => void;
  onStartSession: () => void;
};

export function HomeScreen({
  availableCount,
  broadcats,
  categories,
  cardCount,
  deckCount,
  deckSource,
  selectedBroadcat,
  selectedCategory,
  subcategoryCount,
  onBroadcatChange,
  onCardCountChange,
  onCategoryChange,
  onImportDeck,
  onResetDeck,
  onStartSession,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <GlassPanel style={styles.hero}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandIconText}>FR</Text>
        </View>
        <View style={styles.heroTextWrap}>
          <Text style={styles.title}>French Vocab</Text>
          <Text style={styles.subtitle}>
            Broad category + subcategory practice with native animations, deck import, and French speech.
          </Text>
        </View>
      </GlassPanel>

      <View style={styles.grid}>
        <GlassPanel style={styles.panel}>
          <Text style={styles.panelTitle}>Session setup</Text>

          <SelectField
            label="Broad category"
            value={selectedBroadcat}
            items={broadcats}
            onChange={onBroadcatChange}
          />

          <View style={styles.spacer} />

          <SelectField
            label="Subcategory"
            value={selectedCategory}
            items={categories}
            enabled={categories.length > 1}
            onChange={onCategoryChange}
          />

          <View style={styles.spacer} />

          <Text style={styles.label}>Cards</Text>
          <TextInput
            value={cardCount}
            keyboardType="number-pad"
            onChangeText={onCardCountChange}
            placeholder="10"
            placeholderTextColor={theme.colors.soft}
            style={styles.input}
          />

          <View style={styles.metricRow}>
            <MetricCard label="Matches" value={availableCount.toLocaleString()} />
            <MetricCard label="Subcats" value={subcategoryCount.toString()} />
            <MetricCard label="Deck" value={deckCount.toLocaleString()} />
          </View>

          <AppButton title="Start Session" variant="primary" onPress={onStartSession} style={styles.startButton} />

          <View style={styles.tagsWrap}>
            <View style={styles.tag}><Text style={styles.tagText}>{deckSource}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Auto-next after reveal</Text></View>
          </View>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Text style={styles.panelTitle}>Deck import</Text>

          <View style={styles.rowGap}>
            <AppButton title="Import JSON" onPress={onImportDeck} />
            <AppButton title="Reset Deck" variant="danger" onPress={onResetDeck} />
          </View>

          <Text style={styles.helpText}>
            Import a flat array or an object with a cards array. Best format: id, fr, en, cat, broadcat.
          </Text>

          <Text style={styles.helpTextMuted}>
            This React Native version keeps your imported deck on-device and reuses it the next time the app opens.
          </Text>
        </GlassPanel>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  hero: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  brandIconText: {
    color: theme.colors.text,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.4,
  },
  heroTextWrap: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    gap: 16,
  },
  panel: {
    padding: 16,
  },
  panelTitle: {
    color: theme.colors.soft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(0,0,0,0.22)',
    color: theme.colors.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  metricRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  startButton: {
    marginTop: 14,
  },
  tagsWrap: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tagText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  rowGap: {
    gap: 10,
  },
  helpText: {
    marginTop: 12,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  helpTextMuted: {
    marginTop: 8,
    color: theme.colors.soft,
    lineHeight: 20,
  },
  spacer: {
    height: 12,
  },
});
