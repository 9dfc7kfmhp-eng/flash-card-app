import { supabase } from '../lib/supabase';
import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from '../types';

/**
 * Konvertiert Supabase-Datenbank-Row zu Flashcard-Type
 */
function convertToFlashcard(row: any): Flashcard {
  return {
    id: row.id,
    spanish: row.spanish,
    english: row.english,
    notes: row.notes,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    statistics: {
      timesShown: row.times_shown,
      timesCorrect: row.times_correct,
      timesIncorrect: row.times_incorrect,
      lastReviewed: row.last_reviewed
        ? new Date(row.last_reviewed).getTime()
        : null,
      successRate: row.success_rate,
      status: row.status,
      consecutiveCorrect: row.consecutive_correct,
    },
  };
}

/**
 * Lädt alle Flashcards aus Supabase
 */
export async function getAllFlashcards(): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading flashcards:', error);
    return [];
  }

  return data.map(convertToFlashcard);
}

/**
 * Erstellt eine neue Flashcard in Supabase
 */
export async function createFlashcard(
  input: CreateFlashcardInput
): Promise<Flashcard | null> {
  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      spanish: input.spanish.trim(),
      english: input.english.trim(),
      notes: input.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating flashcard:', error);
    return null;
  }

  return convertToFlashcard(data);
}

/**
 * Aktualisiert eine Flashcard in Supabase
 */
export async function updateFlashcard(
  id: string,
  updates: UpdateFlashcardInput
): Promise<Flashcard | null> {
  const { data, error } = await supabase
    .from('flashcards')
    .update({
      spanish: updates.spanish?.trim(),
      english: updates.english?.trim(),
      notes: updates.notes?.trim(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating flashcard:', error);
    return null;
  }

  return convertToFlashcard(data);
}

/**
 * Löscht eine Flashcard aus Supabase
 */
export async function deleteFlashcard(id: string): Promise<boolean> {
  const { error } = await supabase.from('flashcards').delete().eq('id', id);

  if (error) {
    console.error('Error deleting flashcard:', error);
    return false;
  }

  return true;
}

/**
 * Aktualisiert die Statistiken einer Flashcard
 */
export async function updateCardStatistics(
  id: string,
  wasCorrect: boolean
): Promise<boolean> {
  // Hole aktuelle Card
  const { data: card, error: fetchError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !card) {
    console.error('Error fetching card for stats update:', fetchError);
    return false;
  }

  // Berechne neue Statistiken
  const timesShown = card.times_shown + 1;
  const timesCorrect = wasCorrect ? card.times_correct + 1 : card.times_correct;
  const timesIncorrect = !wasCorrect
    ? card.times_incorrect + 1
    : card.times_incorrect;
  const consecutiveCorrect = wasCorrect ? card.consecutive_correct + 1 : 0;
  const successRate = Math.round((timesCorrect / timesShown) * 100);

  let status: 'new' | 'learning' | 'learned' = 'new';
  if (timesShown === 0) {
    status = 'new';
  } else if (successRate >= 70 && timesShown >= 3) {
    status = 'learned';
  } else {
    status = 'learning';
  }

  // Update in Supabase
  const { error: updateError } = await supabase
    .from('flashcards')
    .update({
      times_shown: timesShown,
      times_correct: timesCorrect,
      times_incorrect: timesIncorrect,
      consecutive_correct: consecutiveCorrect,
      last_reviewed: new Date().toISOString(),
      success_rate: successRate,
      status,
    })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating card statistics:', updateError);
    return false;
  }

  return true;
}

/**
 * Batch-Update für mehrere Card-Statistiken
 */
export async function batchUpdateCardStatistics(
  updates: Array<{ cardId: string; wasCorrect: boolean }>
): Promise<number> {
  let updatedCount = 0;

  // Supabase unterstützt keine echten Batch-Updates,
  // daher müssen wir sequentiell updaten
  for (const { cardId, wasCorrect } of updates) {
    const success = await updateCardStatistics(cardId, wasCorrect);
    if (success) updatedCount++;
  }

  return updatedCount;
}

/**
 * Prüft ob eine Karte mit dem gleichen spanischen Wort bereits existiert
 */
export async function isDuplicateCard(
  spanish: string,
  excludeId?: string
): Promise<boolean> {
  const normalizedSpanish = spanish.trim().toLowerCase();

  let query = supabase
    .from('flashcards')
    .select('id')
    .ilike('spanish', normalizedSpanish);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking duplicate:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}

/**
 * Filtert Karten die wiederholt werden sollten
 */
export async function getCardsToReview(): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .lt('success_rate', 70)
    .lt('consecutive_correct', 2)
    .order('success_rate', { ascending: true });

  if (error) {
    console.error('Error loading cards to review:', error);
    return [];
  }

  return data.map(convertToFlashcard);
}

/**
 * Sucht Karten basierend auf spanischem oder englischem Begriff
 */
export async function searchFlashcards(query: string): Promise<Flashcard[]> {
  if (!query.trim()) {
    return getAllFlashcards();
  }

  const normalizedQuery = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .or(
      `spanish.ilike.%${normalizedQuery}%,english.ilike.%${normalizedQuery}%,notes.ilike.%${normalizedQuery}%`
    );

  if (error) {
    console.error('Error searching flashcards:', error);
    return [];
  }

  return data.map(convertToFlashcard);
}
