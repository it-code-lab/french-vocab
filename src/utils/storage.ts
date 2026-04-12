import { File, Paths } from 'expo-file-system';

import type { DeckSource, FlashCard } from '../types';
import { parseImportedPayload } from './deck';

const deckFile = new File(Paths.document, 'french-vocab-custom-deck.json');

export function saveCustomDeck(cards: FlashCard[]): void {
  deckFile.create({ intermediates: true, overwrite: true });
  deckFile.write(JSON.stringify({ source: 'Imported deck', cards }));
}

export function loadSavedDeck(): { cards: FlashCard[]; source: DeckSource } | null {
  try {
    if (!deckFile.exists) return null;

    const raw = deckFile.textSync();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { cards?: unknown; source?: DeckSource };
    const cards = parseImportedPayload(Array.isArray(parsed.cards) ? parsed.cards : parsed);

    if (!cards.length) return null;

    return {
      cards,
      source: parsed.source === 'Imported deck' ? 'Imported deck' : 'Built-in complete deck',
    };
  } catch {
    return null;
  }
}

export function clearSavedDeck(): void {
  try {
    if (deckFile.exists) {
      deckFile.delete();
    }
  } catch {
    // no-op
  }
}
