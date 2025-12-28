import type { QuizQuestion, QuizSession, QuizType } from '../types/session';
import {
  loadAppData,
  saveAppData,
  updateCardStatistics,
} from './flashcardService';
import { generateUUID } from './uuid';

/**
 * Speichert eine abgeschlossene Quiz-Session und aktualisiert Kartenstatistiken
 * @param quizType - Der Typ des Quiz (multiple-choice oder fill-in-blank)
 * @param questions - Array aller Quiz-Fragen mit Benutzerantworten
 * @returns Das gespeicherte QuizSession-Objekt
 */
export function saveQuizSession(
  quizType: QuizType,
  questions: QuizQuestion[]
): QuizSession {
  // Berechne Score
  const correctCount = questions.filter(
    q => q.isCorrect || q.wasCorrect
  ).length;
  const score =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  // Erstelle Quiz-Session-Objekt
  const quizSession: QuizSession = {
    id: generateUUID(),
    type: quizType,
    date: Date.now(),
    questions: questions.map(q => ({
      cardId: q.cardId,
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: q.userAnswer || '',
      wasCorrect: q.isCorrect ?? q.wasCorrect,
    })),
    score,
    completed: true,
  };

  // Aktualisiere Statistiken für jede Karte ZUERST
  questions.forEach(question => {
    updateCardStatistics(
      question.cardId,
      question.isCorrect ?? question.wasCorrect
    );
  });

  // Lade App-Daten NACH den Statistik-Updates
  const appData = loadAppData();

  // Füge Quiz-Session zur Historie hinzu
  appData.quizSessions.push(quizSession);

  // Speichere App-Daten
  saveAppData(appData);

  return quizSession;
}

/**
 * Lädt alle Quiz-Sessions aus LocalStorage
 * @returns Array aller gespeicherten Quiz-Sessions
 */
export function getAllQuizSessions(): QuizSession[] {
  const appData = loadAppData();
  return appData.quizSessions;
}

/**
 * Lädt Quiz-Sessions gefiltert nach Typ
 * @param type - Der Quiz-Typ zum Filtern
 * @returns Array der gefilterten Quiz-Sessions
 */
export function getQuizSessionsByType(type: QuizType): QuizSession[] {
  const allSessions = getAllQuizSessions();
  return allSessions.filter(session => session.type === type);
}

/**
 * Berechnet Durchschnitts-Score über alle Quiz-Sessions
 * @param type - Optional: Nur für bestimmten Quiz-Typ
 * @returns Durchschnittlicher Score in Prozent
 */
export function getAverageQuizScore(type?: QuizType): number {
  const sessions = type ? getQuizSessionsByType(type) : getAllQuizSessions();

  if (sessions.length === 0) return 0;

  const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
  return Math.round(totalScore / sessions.length);
}
