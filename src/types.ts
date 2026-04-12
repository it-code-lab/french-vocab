export type FlashCard = {
  id: number;
  fr: string;
  en: string;
  cat: string;
  broadcat: string;
};

export type DeckSource = 'Built-in complete deck' | 'Imported deck';

export type AppScreen = 'home' | 'study' | 'finish';

export type SessionSummary = {
  count: number;
  source: 'Built-in' | 'Imported';
  filter: string;
};

export type ToastState = {
  visible: boolean;
  message: string;
};

export type VoiceOption = {
  identifier?: string;
  language?: string;
  name?: string;
  quality?: number;
};
