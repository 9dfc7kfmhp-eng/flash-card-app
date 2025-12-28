/**
 * Status einer Flashcard basierend auf Lernfortschritt
 */
export type CardStatus = 'new' | 'learning' | 'learned';

/**
 * Statistiken für eine einzelne Flashcard
 */
export interface CardStatistics {
  /** Wie oft die Karte angezeigt wurde */
  timesShown: number;
  /** Wie oft die Karte richtig beantwortet wurde */
  timesCorrect: number;
  /** Wie oft die Karte falsch beantwortet wurde */
  timesIncorrect: number;
  /** Timestamp der letzten Wiederholung (null wenn noch nie wiederholt) */
  lastReviewed: number | null;
  /** Erfolgsquote: timesCorrect / timesShown (0-100%) */
  successRate: number;
  /** Automatisch berechneter Status basierend auf Performance */
  status: CardStatus;
  /** Wie oft hintereinander richtig beantwortet (für Wiederholungs-Pool) */
  consecutiveCorrect: number;
}

/**
 * Flashcard-Objekt mit spanischem Wort und englischer Übersetzung
 */
export interface Flashcard {
  /** Eindeutige ID (UUID) */
  id: string;
  /** Spanisches Wort (Vorderseite) */
  spanish: string;
  /** Englische Übersetzung (Rückseite) */
  english: string;
  /** Optionale Notizen oder Kontext */
  notes?: string;
  /** Erstellungszeitpunkt (Timestamp) */
  createdAt: number;
  /** Letzter Änderungszeitpunkt (Timestamp) */
  updatedAt: number;
  /** Statistiken für diese Karte */
  statistics: CardStatistics;
}

/**
 * Daten zum Erstellen einer neuen Flashcard
 */
export interface CreateFlashcardInput {
  spanish: string;
  english: string;
  notes?: string;
}

/**
 * Daten zum Aktualisieren einer Flashcard
 */
export type UpdateFlashcardInput = Partial<
  Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'statistics'>
>;
