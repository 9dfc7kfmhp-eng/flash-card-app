/**
 * Storage Adapter - Wechselt automatisch zwischen LocalStorage und Supabase
 * Feature-Flag: USE_SUPABASE=true für Supabase, false für LocalStorage
 */

import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
  LearningSession,
  QuizSession,
} from '../types';

// Feature Flag: Nutze Supabase wenn Env-Variables gesetzt sind
const USE_SUPABASE =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// Dynamische Imports für Code-Splitting
const getFlashcardService = async () => {
  if (USE_SUPABASE) {
    return await import('./supabaseFlashcardService');
  } else {
    return await import('../utils/flashcardService');
  }
};

const getSessionService = async () => {
  if (USE_SUPABASE) {
    return await import('./supabaseSessionService');
  } else {
    // LocalStorage Session Service existiert bereits in utils/quizService und learningSessionService
    return {
      saveLearningSession: async (session: LearningSession) => {
        const { loadAppData, saveAppData } =
          await import('../utils/flashcardService');
        const appData = loadAppData();
        appData.learningSessions.push(session);
        saveAppData(appData);
        return true;
      },
      getAllLearningSessions: async () => {
        const { loadAppData } = await import('../utils/flashcardService');
        return loadAppData().learningSessions;
      },
      saveQuizSession: async (session: QuizSession) => {
        const { loadAppData, saveAppData } =
          await import('../utils/flashcardService');
        const appData = loadAppData();
        appData.quizSessions.push(session);
        saveAppData(appData);
        return true;
      },
      getAllQuizSessions: async () => {
        const { getAllQuizSessions: localGet } =
          await import('../utils/quizService');
        return localGet();
      },
      getQuizSessionsByType: async (
        type: 'multiple-choice' | 'fill-in-blank'
      ) => {
        const { getQuizSessionsByType: localGet } =
          await import('../utils/quizService');
        return localGet(type);
      },
      getAverageQuizScore: async (
        type?: 'multiple-choice' | 'fill-in-blank'
      ) => {
        const { getAverageQuizScore: localGet } =
          await import('../utils/quizService');
        return localGet(type);
      },
    };
  }
};

// ========== Flashcard Operations ==========

export async function getAllFlashcards(): Promise<Flashcard[]> {
  const service = await getFlashcardService();
  return service.getAllFlashcards();
}

export async function createFlashcard(
  input: CreateFlashcardInput
): Promise<Flashcard | null> {
  const service = await getFlashcardService();
  return service.createFlashcard(input);
}

export async function updateFlashcard(
  id: string,
  updates: UpdateFlashcardInput
): Promise<Flashcard | null> {
  const service = await getFlashcardService();
  const result = await service.updateFlashcard(id, updates);
  return result ?? null;
}

export async function deleteFlashcard(id: string): Promise<boolean> {
  const service = await getFlashcardService();
  return service.deleteFlashcard(id);
}

export async function updateCardStatistics(
  id: string,
  wasCorrect: boolean
): Promise<boolean> {
  const service = await getFlashcardService();
  const result = await service.updateCardStatistics(id, wasCorrect);
  // LocalStorage version returns void, Supabase returns boolean
  return result ?? true;
}

export async function batchUpdateCardStatistics(
  updates: Array<{ cardId: string; wasCorrect: boolean }>
): Promise<number> {
  const service = await getFlashcardService();
  return service.batchUpdateCardStatistics(updates);
}

export async function isDuplicateCard(
  spanish: string,
  excludeId?: string
): Promise<boolean> {
  const service = await getFlashcardService();
  return service.isDuplicateCard(spanish, excludeId);
}

export async function getCardsToReview(): Promise<Flashcard[]> {
  const service = await getFlashcardService();
  return service.getCardsToReview();
}

export async function searchFlashcards(query: string): Promise<Flashcard[]> {
  const service = await getFlashcardService();
  return service.searchFlashcards(query);
}

// ========== Session Operations ==========

export async function saveLearningSession(
  session: LearningSession
): Promise<boolean> {
  const service = await getSessionService();
  return service.saveLearningSession(session);
}

export async function getAllLearningSessions(): Promise<LearningSession[]> {
  const service = await getSessionService();
  return service.getAllLearningSessions();
}

export async function saveQuizSession(session: QuizSession): Promise<boolean> {
  const service = await getSessionService();
  return service.saveQuizSession(session);
}

export async function getAllQuizSessions(): Promise<QuizSession[]> {
  const service = await getSessionService();
  return service.getAllQuizSessions();
}

export async function getQuizSessionsByType(
  type: 'multiple-choice' | 'fill-in-blank'
): Promise<QuizSession[]> {
  const service = await getSessionService();
  return service.getQuizSessionsByType(type);
}

export async function getAverageQuizScore(
  type?: 'multiple-choice' | 'fill-in-blank'
): Promise<number> {
  const service = await getSessionService();
  return service.getAverageQuizScore(type);
}

// ========== Utility ==========

/**
 * Gibt zurück ob Supabase aktiv ist
 */
export function isUsingSupabase(): boolean {
  return USE_SUPABASE;
}

/**
 * Log welches Backend verwendet wird
 */
console.log(
  `🔌 Storage Backend: ${USE_SUPABASE ? 'Supabase (Cloud)' : 'LocalStorage (Browser)'}`
);
