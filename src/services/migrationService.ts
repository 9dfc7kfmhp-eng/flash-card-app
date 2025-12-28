/**
 * LocalStorage zu Supabase Migration Service
 * Migriert bestehende Daten von LocalStorage zu Supabase
 */

import { supabase } from '../lib/supabase';
import type { Flashcard, LearningSession, QuizSession } from '../types';

export interface MigrationProgress {
  stage:
    | 'idle'
    | 'flashcards'
    | 'learning-sessions'
    | 'quiz-sessions'
    | 'completed'
    | 'error';
  total: number;
  current: number;
  message: string;
}

export interface MigrationResult {
  success: boolean;
  flashcardsMigrated: number;
  learningSessionsMigrated: number;
  quizSessionsMigrated: number;
  errors: string[];
}

/**
 * Lädt Daten aus LocalStorage
 */
function loadLocalStorageData() {
  try {
    const data = localStorage.getItem('flashcardAppData');
    if (!data) {
      return {
        flashcards: [],
        learningSessions: [],
        quizSessions: [],
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading LocalStorage data:', error);
    return {
      flashcards: [],
      learningSessions: [],
      quizSessions: [],
    };
  }
}

/**
 * Migriert Flashcards von LocalStorage zu Supabase
 */
async function migrateFlashcards(
  flashcards: Flashcard[],
  onProgress: (progress: MigrationProgress) => void
): Promise<{ success: number; errors: string[] }> {
  const errors: string[] = [];
  let success = 0;

  for (let i = 0; i < flashcards.length; i++) {
    const card = flashcards[i];

    onProgress({
      stage: 'flashcards',
      total: flashcards.length,
      current: i + 1,
      message: `Migriere Flashcard ${i + 1} von ${flashcards.length}...`,
    });

    try {
      const { error } = await supabase.from('flashcards').insert({
        id: card.id,
        spanish: card.spanish,
        english: card.english,
        notes: card.notes || null,
        created_at: new Date(card.createdAt).toISOString(),
        updated_at: new Date(card.updatedAt).toISOString(),
        times_shown: card.statistics.timesShown,
        times_correct: card.statistics.timesCorrect,
        times_incorrect: card.statistics.timesIncorrect,
        last_reviewed: card.statistics.lastReviewed
          ? new Date(card.statistics.lastReviewed).toISOString()
          : null,
        success_rate: card.statistics.successRate,
        status: card.statistics.status,
        consecutive_correct: card.statistics.consecutiveCorrect,
      });

      if (error) {
        // Überspringe Duplikate
        if (error.code !== '23505') {
          errors.push(`Flashcard ${card.id}: ${error.message}`);
        }
      } else {
        success++;
      }
    } catch (err) {
      errors.push(`Flashcard ${card.id}: ${String(err)}`);
    }
  }

  return { success, errors };
}

/**
 * Migriert Learning Sessions von LocalStorage zu Supabase
 */
async function migrateLearningSessions(
  sessions: LearningSession[],
  onProgress: (progress: MigrationProgress) => void
): Promise<{ success: number; errors: string[] }> {
  const errors: string[] = [];
  let success = 0;

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];

    onProgress({
      stage: 'learning-sessions',
      total: sessions.length,
      current: i + 1,
      message: `Migriere Learning Session ${i + 1} von ${sessions.length}...`,
    });

    try {
      const { error } = await supabase.from('learning_sessions').insert({
        id: session.id,
        date: new Date(session.date).toISOString(),
        cards_reviewed: session.cardsReviewed,
        correct_cards: session.correctCards,
        incorrect_cards: session.incorrectCards,
        duration: session.duration,
      });

      if (error) {
        // Überspringe Duplikate
        if (error.code !== '23505') {
          errors.push(`Learning Session ${session.id}: ${error.message}`);
        }
      } else {
        success++;
      }
    } catch (err) {
      errors.push(`Learning Session ${session.id}: ${String(err)}`);
    }
  }

  return { success, errors };
}

/**
 * Migriert Quiz Sessions von LocalStorage zu Supabase
 */
async function migrateQuizSessions(
  sessions: QuizSession[],
  onProgress: (progress: MigrationProgress) => void
): Promise<{ success: number; errors: string[] }> {
  const errors: string[] = [];
  let success = 0;

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];

    onProgress({
      stage: 'quiz-sessions',
      total: sessions.length,
      current: i + 1,
      message: `Migriere Quiz Session ${i + 1} von ${sessions.length}...`,
    });

    try {
      const { error } = await supabase.from('quiz_sessions').insert({
        id: session.id,
        type: session.type,
        date: new Date(session.date).toISOString(),
        questions: session.questions,
        score: session.score,
        completed: session.completed,
      });

      if (error) {
        // Überspringe Duplikate
        if (error.code !== '23505') {
          errors.push(`Quiz Session ${session.id}: ${error.message}`);
        }
      } else {
        success++;
      }
    } catch (err) {
      errors.push(`Quiz Session ${session.id}: ${String(err)}`);
    }
  }

  return { success, errors };
}

/**
 * Haupt-Migration Funktion
 * Migriert alle Daten von LocalStorage zu Supabase
 */
export async function migrateToSupabase(
  onProgress: (progress: MigrationProgress) => void
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    flashcardsMigrated: 0,
    learningSessionsMigrated: 0,
    quizSessionsMigrated: 0,
    errors: [],
  };

  try {
    // Lade Daten aus LocalStorage
    const localData = loadLocalStorageData();

    // Migriere Flashcards
    if (localData.flashcards.length > 0) {
      const flashcardsResult = await migrateFlashcards(
        localData.flashcards,
        onProgress
      );
      result.flashcardsMigrated = flashcardsResult.success;
      result.errors.push(...flashcardsResult.errors);
    }

    // Migriere Learning Sessions
    if (localData.learningSessions.length > 0) {
      const learningResult = await migrateLearningSessions(
        localData.learningSessions,
        onProgress
      );
      result.learningSessionsMigrated = learningResult.success;
      result.errors.push(...learningResult.errors);
    }

    // Migriere Quiz Sessions
    if (localData.quizSessions.length > 0) {
      const quizResult = await migrateQuizSessions(
        localData.quizSessions,
        onProgress
      );
      result.quizSessionsMigrated = quizResult.success;
      result.errors.push(...quizResult.errors);
    }

    // Migration abgeschlossen
    onProgress({
      stage: 'completed',
      total: 1,
      current: 1,
      message: 'Migration erfolgreich abgeschlossen!',
    });

    result.success = result.errors.length === 0;
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration fehlgeschlagen: ${String(error)}`);
    onProgress({
      stage: 'error',
      total: 1,
      current: 0,
      message: `Fehler: ${String(error)}`,
    });
  }

  return result;
}

/**
 * Prüft ob LocalStorage Daten enthält die migriert werden können
 */
export function hasLocalStorageData(): boolean {
  try {
    const data = localStorage.getItem('flashcardAppData');
    if (!data) return false;

    const parsed = JSON.parse(data);
    return (
      parsed.flashcards?.length > 0 ||
      parsed.learningSessions?.length > 0 ||
      parsed.quizSessions?.length > 0
    );
  } catch {
    return false;
  }
}

/**
 * Gibt die Anzahl der migrierbaren Items zurück
 */
export function getLocalStorageStats() {
  const data = loadLocalStorageData();
  return {
    flashcards: data.flashcards?.length || 0,
    learningSessions: data.learningSessions?.length || 0,
    quizSessions: data.quizSessions?.length || 0,
  };
}
