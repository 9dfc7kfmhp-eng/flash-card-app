import type { LearningSession } from '../types';
import { loadAppData } from './flashcardService';

/**
 * Lädt alle Learning Sessions
 */
export function getAllLearningSessions(): LearningSession[] {
  const appData = loadAppData();
  return appData.learningSessions;
}

/**
 * Daten-Punkt für tägliche Aktivität
 */
export interface DailyActivity {
  date: string; // Format: YYYY-MM-DD
  cardsReviewed: number;
  correctCards: number;
  incorrectCards: number;
  successRate: number; // 0-100
}

/**
 * Aggregiert Learning Sessions nach Tag
 * @param days - Anzahl der Tage (7 oder 30)
 * @returns Array von DailyActivity sortiert nach Datum
 */
export function getDailyActivity(days: number = 7): DailyActivity[] {
  const sessions = getAllLearningSessions();
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  // Map für Aggregation: date -> activity data
  const activityMap = new Map<string, DailyActivity>();

  // Initialisiere alle Tage mit 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = formatDate(date);
    activityMap.set(dateStr, {
      date: dateStr,
      cardsReviewed: 0,
      correctCards: 0,
      incorrectCards: 0,
      successRate: 0,
    });
  }

  // Aggregiere Sessions
  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    if (sessionDate >= startDate && sessionDate <= now) {
      const dateStr = formatDate(sessionDate);
      const existing = activityMap.get(dateStr);

      if (existing) {
        existing.cardsReviewed += session.cardsReviewed.length;
        existing.correctCards += session.correctCards.length;
        existing.incorrectCards += session.incorrectCards.length;
      }
    }
  });

  // Berechne Erfolgsquote für jeden Tag
  activityMap.forEach(activity => {
    if (activity.cardsReviewed > 0) {
      activity.successRate = Math.round(
        (activity.correctCards / activity.cardsReviewed) * 100
      );
    }
  });

  // Konvertiere zu Array und sortiere nach Datum
  return Array.from(activityMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

/**
 * Formatiert ein Datum zu YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatiert Datum zu lesbarem Format (DD.MM)
 */
export function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${day}.${month}`;
}

/**
 * Berechnet Gesamt-Statistiken über alle Learning Sessions
 */
export interface OverallLearningStats {
  totalSessions: number;
  totalCardsReviewed: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallSuccessRate: number;
  averageSessionDuration: number; // in Sekunden
}

export function getOverallLearningStats(): OverallLearningStats {
  const sessions = getAllLearningSessions();

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalCardsReviewed: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      overallSuccessRate: 0,
      averageSessionDuration: 0,
    };
  }

  const totalCardsReviewed = sessions.reduce(
    (sum, s) => sum + s.cardsReviewed.length,
    0
  );
  const totalCorrect = sessions.reduce(
    (sum, s) => sum + s.correctCards.length,
    0
  );
  const totalIncorrect = sessions.reduce(
    (sum, s) => sum + s.incorrectCards.length,
    0
  );
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  return {
    totalSessions: sessions.length,
    totalCardsReviewed,
    totalCorrect,
    totalIncorrect,
    overallSuccessRate:
      totalCardsReviewed > 0
        ? Math.round((totalCorrect / totalCardsReviewed) * 100)
        : 0,
    averageSessionDuration:
      sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0,
  };
}
