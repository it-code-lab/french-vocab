import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

import { BUILTIN_DECK } from './src/data/builtinDeck';
import { HomeScreen } from './src/screens/HomeScreen';
import { StudyScreen } from './src/screens/StudyScreen';
import { FinishScreen } from './src/screens/FinishScreen';
import type {
  AppScreen,
  DeckSource,
  FlashCard,
  SessionSummary,
  ToastState,
  VoiceOption,
} from './src/types';
import {
  filterCards,
  getBroadcats,
  getCategoriesForBroadcat,
  getFilterLabel,
  normalizeImportedPayload,
  shuffleCards,
} from './src/utils/deck';
import {
  clearSavedDeck,
  loadSavedDeck,
  saveCustomDeck,
} from './src/utils/storage';
import { ToastBanner } from './src/components/ToastBanner';
import { theme } from './src/theme';

const AUTO_NEXT_MS = 2000;

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [library, setLibrary] = useState<FlashCard[]>(BUILTIN_DECK);
  const [deckSource, setDeckSource] = useState<DeckSource>('Built-in complete deck');
  const [selectedBroadcat, setSelectedBroadcat] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cardCount, setCardCount] = useState<string>('10');
  const [sessionCards, setSessionCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState(1);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void bootstrap();
    void loadVoices();
    return () => {
      stopSpeechAndTimers();
      if (toastRef.current) clearTimeout(toastRef.current);
    };
  }, []);

  async function bootstrap() {
    const saved = loadSavedDeck();
    if (saved?.cards?.length) {
      setLibrary(saved.cards);
      setDeckSource(saved.source || 'Imported deck');
    }
  }

  async function loadVoices() {
    try {
      const list = await Speech.getAvailableVoicesAsync();
      const preferred = list.filter((voice) => voice.language?.startsWith('fr'));
      setVoices(preferred);
    } catch {
      setVoices([]);
    }
  }

  function showToast(message: string) {
    setToast({ visible: true, message });
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2200);
  }

  async function softHaptic() {
    try {
      await Haptics.selectionAsync();
    } catch {
      // no-op
    }
  }

  async function successHaptic() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // no-op
    }
  }

  async function errorHaptic() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // no-op
    }
  }

  const broadcats = useMemo(() => ['All', ...getBroadcats(library)], [library]);
  const categories = useMemo(
    () => ['All', ...getCategoriesForBroadcat(library, selectedBroadcat)],
    [library, selectedBroadcat],
  );

  useEffect(() => {
    if (!broadcats.includes(selectedBroadcat)) {
      setSelectedBroadcat('All');
    }
  }, [broadcats, selectedBroadcat]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  const filteredPool = useMemo(
    () => filterCards(library, selectedBroadcat, selectedCategory),
    [library, selectedBroadcat, selectedCategory],
  );

  const currentCard = sessionCards[currentIndex] ?? null;

  function stopSpeechAndTimers() {
    Speech.stop();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCountdownProgress(1);
  }

  function startCountdown() {
    stopSpeechAndTimers();
    const startedAt = Date.now();
    setCountdownProgress(1);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.max(0, 1 - elapsed / AUTO_NEXT_MS);
      setCountdownProgress(nextProgress);
    }, 33);

    timerRef.current = setTimeout(() => {
      void goNext();
    }, AUTO_NEXT_MS);
  }

  async function onImportDeck() {
    try {
      const imported = await normalizeImportedPayload();
      if (!imported.length) {
        await errorHaptic();
        showToast('Import failed: no valid cards found.');
        return;
      }

      saveCustomDeck(imported);
      setLibrary(imported);
      setDeckSource('Imported deck');
      setSelectedBroadcat('All');
      setSelectedCategory('All');
      await successHaptic();
      showToast(`${imported.length.toLocaleString()} cards imported.`);
    } catch (error) {
      await errorHaptic();
      const message = error instanceof Error ? error.message : 'Import failed.';
      showToast(message);
    }
  }

  function onResetDeck() {
    Alert.alert('Reset deck', 'Switch back to the built-in deck?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          clearSavedDeck();
          setLibrary(BUILTIN_DECK);
          setDeckSource('Built-in complete deck');
          setSelectedBroadcat('All');
          setSelectedCategory('All');
          await successHaptic();
          showToast('Reset to built-in deck.');
          setScreen('home');
        },
      },
    ]);
  }

  async function startSession() {
    if (!filteredPool.length) {
      await errorHaptic();
      showToast('No cards found for this filter.');
      return;
    }

    const parsed = Number.parseInt(cardCount, 10);
    const safeCount = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
    const nextCards = shuffleCards(filteredPool).slice(0, Math.min(safeCount, filteredPool.length));

    stopSpeechAndTimers();
    setSessionCards(nextCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScreen('study');
    await successHaptic();
  }

  async function speakCurrentWord() {
    if (!currentCard) return;

    try {
      Speech.stop();
      const exact = voices.find((voice) => voice.language === 'fr-FR');
      const canadian = voices.find((voice) => voice.language === 'fr-CA');
      const fallback = voices[0];

      Speech.speak(currentCard.fr, {
        language: exact?.language || canadian?.language || 'fr-FR',
        voice: exact?.identifier || canadian?.identifier || fallback?.identifier,
        rate: 0.95,
        pitch: 1,
      });
      await softHaptic();
    } catch {
      showToast('Speech unavailable on this device.');
    }
  }

  async function flipCard() {
    if (!currentCard) return;

    if (isFlipped) {
      await goNext();
      return;
    }

    setIsFlipped(true);
    await softHaptic();
    startCountdown();
  }

  async function goNext() {
    stopSpeechAndTimers();

    if (!sessionCards.length) return;

    if (currentIndex >= sessionCards.length - 1) {
      const summary: SessionSummary = {
        count: sessionCards.length,
        source: deckSource.includes('Imported') ? 'Imported' : 'Built-in',
        filter: getFilterLabel(selectedBroadcat, selectedCategory),
      };
      setSessionSummary(summary);
      setScreen('finish');
      setIsFlipped(false);
      await successHaptic();
      return;
    }

    setIsFlipped(false);
    setCountdownProgress(1);

    setTimeout(() => {
      setCurrentIndex((value) => value + 1);
    }, 160);
  }

  function goHome() {
    stopSpeechAndTimers();
    setIsFlipped(false);
    setScreen('home');
  }

  function repeatSession() {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCountdownProgress(1);
    setScreen('study');
  }

  const progress = sessionCards.length ? currentIndex / sessionCards.length : 0;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.bg1} />
      <LinearGradient colors={theme.gradients.background} style={styles.root}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {screen === 'home' && (
            <HomeScreen
              availableCount={filteredPool.length}
              broadcats={broadcats}
              categories={categories}
              cardCount={cardCount}
              deckCount={library.length}
              deckSource={deckSource}
              onBroadcatChange={(value) => {
                setSelectedBroadcat(value);
                setSelectedCategory('All');
              }}
              onCardCountChange={setCardCount}
              onCategoryChange={setSelectedCategory}
              onImportDeck={onImportDeck}
              onResetDeck={onResetDeck}
              onStartSession={startSession}
              selectedBroadcat={selectedBroadcat}
              selectedCategory={selectedCategory}
              subcategoryCount={Math.max(categories.length - 1, 0)}
            />
          )}

          {screen === 'study' && currentCard && (
            <StudyScreen
              autoNextProgress={countdownProgress}
              currentCard={currentCard}
              currentIndex={currentIndex}
              isFlipped={isFlipped}
              onFlip={flipCard}
              onHome={goHome}
              onListen={speakCurrentWord}
              onNext={goNext}
              progress={progress}
              total={sessionCards.length}
            />
          )}

          {screen === 'finish' && sessionSummary && (
            <FinishScreen
              summary={sessionSummary}
              onBackHome={goHome}
              onRepeat={repeatSession}
            />
          )}

          <ToastBanner visible={toast.visible} message={toast.message} />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg1,
  },
  safeArea: {
    flex: 1,
  },
  glowOne: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(79,124,255,0.18)',
    top: 30,
    left: -40,
  },
  glowTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(117,103,255,0.14)',
    top: 70,
    right: -70,
  },
});
