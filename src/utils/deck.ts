import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import type { FlashCard } from '../types';

function normalizeCard(card: unknown, fallbackId: number): FlashCard | null {
  if (!card || typeof card !== 'object') return null;

  const value = card as Record<string, unknown>;
  const fr = String(value.fr ?? '').trim();
  const en = String(value.en ?? '').trim();

  if (!fr || !en) return null;

  const rawCat = String(value.cat ?? '').trim();
  const rawBroadcat = String(value.broadcat ?? '').trim();
  const cat = rawCat || 'General';
  const broadcat = rawBroadcat || cat;
  const idNum = Number(value.id);
  const id = Number.isFinite(idNum) ? idNum : fallbackId;

  return {
    id,
    fr,
    en,
    cat,
    broadcat,
  };
}

export function parseImportedPayload(payload: unknown): FlashCard[] {
  const rawCards = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { cards?: unknown[] }).cards)
      ? (payload as { cards: unknown[] }).cards
      : [];

  return rawCards
    .map((card, index) => normalizeCard(card, index + 1))
    .filter((card): card is FlashCard => Boolean(card));
}

export async function normalizeImportedPayload(): Promise<FlashCard[]> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: 'application/json',
  });

  if (result.canceled) {
    return [];
  }

  const asset = result.assets[0];
  if (!asset?.uri) {
    throw new Error('Import failed: no file selected.');
  }

  const file = new File(asset.uri);
  const raw = await file.text();
  const parsed = JSON.parse(raw);
  return parseImportedPayload(parsed);
}

export function getBroadcats(cards: FlashCard[]): string[] {
  return Array.from(new Set(cards.map((card) => card.broadcat).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getCategoriesForBroadcat(cards: FlashCard[], broadcat: string): string[] {
  const filtered = broadcat === 'All' ? cards : cards.filter((card) => card.broadcat === broadcat);
  return Array.from(new Set(filtered.map((card) => card.cat).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterCards(cards: FlashCard[], broadcat: string, category: string): FlashCard[] {
  return cards.filter((card) => {
    const broadcatMatch = broadcat === 'All' || card.broadcat === broadcat;
    const categoryMatch = category === 'All' || card.cat === category;
    return broadcatMatch && categoryMatch;
  });
}

export function shuffleCards(cards: FlashCard[]): FlashCard[] {
  const clone = [...cards];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function getFilterLabel(broadcat: string, category: string): string {
  if (broadcat === 'All') return 'All';
  if (category === 'All') return broadcat;
  return `${broadcat} / ${category}`;
}
