import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
  CardStatistics,
  AppData,
} from '../types';
import { STORAGE_KEYS, DEFAULT_APP_DATA } from '../types';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';
import { generateUUID } from './uuid';

/**
 * Lädt die kompletten App-Daten aus LocalStorage
 * @returns AppData oder Default-Daten wenn nicht vorhanden
 */
export function loadAppData(): AppData {
  const data = loadFromLocalStorage<AppData>(STORAGE_KEYS.APP_DATA);
  return data || DEFAULT_APP_DATA;
}

/**
 * Speichert die kompletten App-Daten in LocalStorage
 * @param data - Vollständige App-Daten
 */
export function saveAppData(data: AppData): void {
  saveToLocalStorage(STORAGE_KEYS.APP_DATA, data);
}

/**
 * Berechnet die Erfolgsquote basierend auf Statistiken
 * @param statistics - Card-Statistiken
 * @returns Erfolgsquote in % (0-100)
 */
function calculateSuccessRate(statistics: CardStatistics): number {
  if (statistics.timesShown === 0) return 0;
  return Math.round((statistics.timesCorrect / statistics.timesShown) * 100);
}

/**
 * Berechnet den Status basierend auf Statistiken
 * @param statistics - Card-Statistiken
 * @returns CardStatus
 */
function calculateCardStatus(
  statistics: CardStatistics
): 'new' | 'learning' | 'learned' {
  if (statistics.timesShown === 0) return 'new';
  if (statistics.successRate >= 70 && statistics.timesShown >= 3)
    return 'learned';
  return 'learning';
}

/**
 * Erstellt eine neue Flashcard
 * @param input - Daten für die neue Karte
 * @returns Die erstellte Flashcard
 */
export function createFlashcard(input: CreateFlashcardInput): Flashcard {
  const now = Date.now();
  const statistics: CardStatistics = {
    timesShown: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    lastReviewed: null,
    successRate: 0,
    status: 'new',
    consecutiveCorrect: 0,
  };

  const newCard: Flashcard = {
    id: generateUUID(),
    spanish: input.spanish.trim(),
    english: input.english.trim(),
    notes: input.notes?.trim(),
    createdAt: now,
    updatedAt: now,
    statistics,
  };

  // Lade aktuelle Daten, füge Karte hinzu, speichere
  const appData = loadAppData();
  appData.flashcards.push(newCard);
  saveAppData(appData);

  return newCard;
}

/**
 * Lädt alle Flashcards
 * @returns Array aller Flashcards
 */
export function getAllFlashcards(): Flashcard[] {
  const appData = loadAppData();
  return appData.flashcards;
}

/**
 * Lädt eine einzelne Flashcard anhand der ID
 * @param id - Card-ID
 * @returns Die Flashcard oder undefined wenn nicht gefunden
 */
export function getFlashcardById(id: string): Flashcard | undefined {
  const appData = loadAppData();
  return appData.flashcards.find(card => card.id === id);
}

/**
 * Aktualisiert eine bestehende Flashcard
 * @param id - ID der zu aktualisierenden Karte
 * @param updates - Teilweise Updates
 * @returns Die aktualisierte Flashcard oder undefined wenn nicht gefunden
 */
export function updateFlashcard(
  id: string,
  updates: UpdateFlashcardInput
): Flashcard | undefined {
  const appData = loadAppData();
  const index = appData.flashcards.findIndex(card => card.id === id);

  if (index === -1) {
    console.warn(`Flashcard with id ${id} not found`);
    return undefined;
  }

  const updatedCard: Flashcard = {
    ...appData.flashcards[index],
    ...updates,
    updatedAt: Date.now(),
  };

  appData.flashcards[index] = updatedCard;
  saveAppData(appData);

  return updatedCard;
}

/**
 * Aktualisiert die Statistiken einer Flashcard
 * @param id - Card-ID
 * @param wasCorrect - Ob die Antwort korrekt war
 */
export function updateCardStatistics(id: string, wasCorrect: boolean): void {
  const appData = loadAppData();
  const card = appData.flashcards.find(c => c.id === id);

  if (!card) {
    console.warn(`Flashcard with id ${id} not found`);
    return;
  }

  // Update Statistiken
  card.statistics.timesShown += 1;
  if (wasCorrect) {
    card.statistics.timesCorrect += 1;
    card.statistics.consecutiveCorrect += 1;
  } else {
    card.statistics.timesIncorrect += 1;
    card.statistics.consecutiveCorrect = 0; // Reset bei falscher Antwort
  }

  card.statistics.lastReviewed = Date.now();
  card.statistics.successRate = calculateSuccessRate(card.statistics);
  card.statistics.status = calculateCardStatus(card.statistics);
  card.updatedAt = Date.now();

  saveAppData(appData);
}

/**
 * Batch-Update für mehrere Card-Statistiken (Performance-Optimierung)
 * Lädt Daten einmal, aktualisiert alle Karten, speichert einmal
 * @param updates - Array von Updates: { cardId, wasCorrect }
 * @returns Anzahl erfolgreich aktualisierter Karten
 */
export function batchUpdateCardStatistics(
  updates: Array<{ cardId: string; wasCorrect: boolean }>
): number {
  if (updates.length === 0) return 0;

  const appData = loadAppData();
  let updatedCount = 0;
  const now = Date.now();

  // Erstelle Map für schnelleren Lookup
  const cardMap = new Map(appData.flashcards.map(card => [card.id, card]));

  // Aktualisiere alle Karten
  for (const { cardId, wasCorrect } of updates) {
    const card = cardMap.get(cardId);

    if (!card) {
      console.warn(`Flashcard with id ${cardId} not found`);
      continue;
    }

    // Update Statistiken
    card.statistics.timesShown += 1;
    if (wasCorrect) {
      card.statistics.timesCorrect += 1;
      card.statistics.consecutiveCorrect += 1;
    } else {
      card.statistics.timesIncorrect += 1;
      card.statistics.consecutiveCorrect = 0;
    }

    card.statistics.lastReviewed = now;
    card.statistics.successRate = calculateSuccessRate(card.statistics);
    card.statistics.status = calculateCardStatus(card.statistics);
    card.updatedAt = now;

    updatedCount++;
  }

  // Nur einmal speichern!
  saveAppData(appData);

  return updatedCount;
}

/**
 * Löscht eine Flashcard
 * @param id - ID der zu löschenden Karte
 * @returns true wenn erfolgreich gelöscht, false wenn nicht gefunden
 */
export function deleteFlashcard(id: string): boolean {
  const appData = loadAppData();
  const initialLength = appData.flashcards.length;

  appData.flashcards = appData.flashcards.filter(card => card.id !== id);

  if (appData.flashcards.length === initialLength) {
    console.warn(`Flashcard with id ${id} not found`);
    return false;
  }

  saveAppData(appData);
  return true;
}

/**
 * Prüft ob eine Karte mit dem gleichen spanischen Wort bereits existiert
 * @param spanish - Spanisches Wort
 * @param excludeId - Optional: ID einer Karte die ignoriert werden soll (für Updates)
 * @returns true wenn Duplikat existiert
 */
export function isDuplicateCard(spanish: string, excludeId?: string): boolean {
  const appData = loadAppData();
  const normalizedSpanish = spanish.trim().toLowerCase();

  return appData.flashcards.some(
    card =>
      card.spanish.toLowerCase() === normalizedSpanish && card.id !== excludeId
  );
}

/**
 * Filtert Karten die wiederholt werden sollten (Erfolgsquote < 70%)
 * @returns Array von Flashcards zum Wiederholen
 */
export function getCardsToReview(): Flashcard[] {
  const appData = loadAppData();
  return appData.flashcards
    .filter(card => {
      // Karte benötigt Wiederholung wenn:
      // 1. Erfolgsquote < 70% UND
      // 2. NICHT bereits 2x hintereinander richtig beantwortet
      return (
        card.statistics.successRate < 70 &&
        card.statistics.consecutiveCorrect < 2
      );
    })
    .sort((a, b) => a.statistics.successRate - b.statistics.successRate);
}

/**
 * Sucht Karten basierend auf spanischem oder englischem Begriff
 * @param query - Suchbegriff
 * @returns Array von passenden Flashcards
 */
export function searchFlashcards(query: string): Flashcard[] {
  if (!query.trim()) return getAllFlashcards();

  const appData = loadAppData();
  const normalizedQuery = query.trim().toLowerCase();

  return appData.flashcards.filter(
    card =>
      card.spanish.toLowerCase().includes(normalizedQuery) ||
      card.english.toLowerCase().includes(normalizedQuery) ||
      card.notes?.toLowerCase().includes(normalizedQuery)
  );
}
