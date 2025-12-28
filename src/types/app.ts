import type { Flashcard } from './flashcard';
import type { QuizSession, LearningSession } from './session';

/**
 * Theme-Modus für die Anwendung
 */
export type ThemeMode = 'light' | 'dark';

/**
 * App-Einstellungen
 */
export interface AppSettings {
  /** Anzahl der Karten pro Lern-Session */
  cardsPerSession: number;
  /** Anzahl der Fragen pro Quiz */
  quizQuestionCount: number;
  /** Theme-Modus */
  theme: ThemeMode;
}

/**
 * Benutzer-Statistiken (global)
 */
export interface UserStats {
  /** Gesamtanzahl gelernter Karten (successRate >= 70%) */
  totalCardsLearned: number;
  /** Aktueller Lernstreak in Tagen */
  currentStreak: number;
  /** Datum des letzten aktiven Tags (Timestamp) */
  lastActiveDate: number;
  /** Längster jemals erreichter Streak */
  longestStreak: number;
}

/**
 * Gesamte App-Daten in LocalStorage
 */
export interface AppData {
  /** Alle Flashcards */
  flashcards: Flashcard[];
  /** Alle abgeschlossenen Quiz-Sessions */
  quizSessions: QuizSession[];
  /** Alle abgeschlossenen Lern-Sessions */
  learningSessions: LearningSession[];
  /** App-Einstellungen */
  appSettings: AppSettings;
  /** Benutzer-Statistiken */
  userStats: UserStats;
}

/**
 * Default-Werte für App-Settings
 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  cardsPerSession: 20,
  quizQuestionCount: 10,
  theme: 'light',
};

/**
 * Default-Werte für User-Stats
 */
export const DEFAULT_USER_STATS: UserStats = {
  totalCardsLearned: 0,
  currentStreak: 0,
  lastActiveDate: 0,
  longestStreak: 0,
};

/**
 * Default-Werte für komplette App-Daten
 */
export const DEFAULT_APP_DATA: AppData = {
  flashcards: [],
  quizSessions: [],
  learningSessions: [],
  appSettings: DEFAULT_APP_SETTINGS,
  userStats: DEFAULT_USER_STATS,
};

/**
 * LocalStorage-Keys
 */
export const STORAGE_KEYS = {
  APP_DATA: 'flashcard-app-data',
} as const;
