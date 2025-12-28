import { supabase } from '../lib/supabase';
import type { LearningSession, QuizSession } from '../types';

/**
 * Konvertiert Supabase-Row zu LearningSession
 */
function convertToLearningSession(row: any): LearningSession {
  return {
    id: row.id,
    date: new Date(row.date).getTime(),
    cardsReviewed: row.cards_reviewed,
    correctCards: row.correct_cards,
    incorrectCards: row.incorrect_cards,
    duration: row.duration,
  };
}

/**
 * Konvertiert Supabase-Row zu QuizSession
 */
function convertToQuizSession(row: any): QuizSession {
  return {
    id: row.id,
    type: row.type,
    date: new Date(row.date).getTime(),
    questions: row.questions,
    score: row.score,
    completed: row.completed,
  };
}

/**
 * Speichert eine Learning Session in Supabase
 */
export async function saveLearningSession(
  session: LearningSession
): Promise<boolean> {
  const { error } = await supabase.from('learning_sessions').insert({
    id: session.id,
    date: new Date(session.date).toISOString(),
    cards_reviewed: session.cardsReviewed,
    correct_cards: session.correctCards,
    incorrect_cards: session.incorrectCards,
    duration: session.duration,
  });

  if (error) {
    console.error('Error saving learning session:', error);
    return false;
  }

  return true;
}

/**
 * Lädt alle Learning Sessions aus Supabase
 */
export async function getAllLearningSessions(): Promise<LearningSession[]> {
  const { data, error } = await supabase
    .from('learning_sessions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error loading learning sessions:', error);
    return [];
  }

  return data.map(convertToLearningSession);
}

/**
 * Speichert eine Quiz Session in Supabase
 */
export async function saveQuizSession(session: QuizSession): Promise<boolean> {
  const { error } = await supabase.from('quiz_sessions').insert({
    id: session.id,
    type: session.type,
    date: new Date(session.date).toISOString(),
    questions: session.questions,
    score: session.score,
    completed: session.completed,
  });

  if (error) {
    console.error('Error saving quiz session:', error);
    return false;
  }

  return true;
}

/**
 * Lädt alle Quiz Sessions aus Supabase
 */
export async function getAllQuizSessions(): Promise<QuizSession[]> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error loading quiz sessions:', error);
    return [];
  }

  return data.map(convertToQuizSession);
}

/**
 * Lädt Quiz Sessions nach Typ
 */
export async function getQuizSessionsByType(
  type: 'multiple-choice' | 'fill-in-blank'
): Promise<QuizSession[]> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('type', type)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error loading quiz sessions by type:', error);
    return [];
  }

  return data.map(convertToQuizSession);
}

/**
 * Berechnet durchschnittlichen Quiz-Score
 */
export async function getAverageQuizScore(
  type?: 'multiple-choice' | 'fill-in-blank'
): Promise<number> {
  let query = supabase.from('quiz_sessions').select('score');

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return 0;
  }

  const total = data.reduce((sum, session) => sum + session.score, 0);
  return Math.round(total / data.length);
}
