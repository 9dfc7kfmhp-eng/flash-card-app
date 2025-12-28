import { createFlashcard } from './flashcardService';
import type { CreateFlashcardInput } from '../types';

/**
 * Demo-Flashcards zum Testen
 */
const DEMO_FLASHCARDS: CreateFlashcardInput[] = [
  {
    spanish: 'hola',
    english: 'hello',
    notes: 'Grundlegende Begrüßung',
  },
  {
    spanish: 'adiós',
    english: 'goodbye',
    notes: 'Verabschiedung',
  },
  {
    spanish: 'gracias',
    english: 'thank you',
    notes: 'Höflichkeit',
  },
  {
    spanish: 'por favor',
    english: 'please',
    notes: 'Höfliche Bitte',
  },
  {
    spanish: 'sí',
    english: 'yes',
  },
  {
    spanish: 'no',
    english: 'no',
  },
  {
    spanish: 'buenos días',
    english: 'good morning',
    notes: 'Morgengruß',
  },
  {
    spanish: 'buenas noches',
    english: 'good night',
    notes: 'Abendgruß',
  },
  {
    spanish: 'perdón',
    english: 'sorry / excuse me',
    notes: 'Entschuldigung',
  },
  {
    spanish: 'agua',
    english: 'water',
    notes: 'Getränk',
  },
  {
    spanish: 'comida',
    english: 'food',
    notes: 'Essen',
  },
  {
    spanish: 'casa',
    english: 'house',
    notes: 'Gebäude',
  },
  {
    spanish: 'amigo',
    english: 'friend',
    notes: 'Männlicher Freund',
  },
  {
    spanish: 'amiga',
    english: 'friend (female)',
    notes: 'Weiblicher Freund',
  },
  {
    spanish: 'libro',
    english: 'book',
    notes: 'Gegenstand',
  },
  {
    spanish: 'escuela',
    english: 'school',
    notes: 'Bildung',
  },
  {
    spanish: 'trabajo',
    english: 'work / job',
    notes: 'Beruf',
  },
  {
    spanish: 'familia',
    english: 'family',
    notes: 'Verwandtschaft',
  },
  {
    spanish: 'amor',
    english: 'love',
    notes: 'Gefühl',
  },
  {
    spanish: 'tiempo',
    english: 'time / weather',
    notes: 'Mehrfache Bedeutung',
  },
  {
    spanish: 'ciudad',
    english: 'city',
    notes: 'Ort',
  },
  {
    spanish: 'país',
    english: 'country',
    notes: 'Geografie',
  },
  {
    spanish: 'mundo',
    english: 'world',
    notes: 'Geografie',
  },
  {
    spanish: 'persona',
    english: 'person',
    notes: 'Mensch',
  },
  {
    spanish: 'día',
    english: 'day',
    notes: 'Zeiteinheit',
  },
];

/**
 * Lädt Demo-Daten in die App
 * @returns Anzahl der erstellten Karten
 */
export function seedDemoData(): number {
  console.log('🌱 Seeding demo flashcards...');

  let count = 0;
  DEMO_FLASHCARDS.forEach(cardData => {
    try {
      createFlashcard(cardData);
      count++;
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  });

  console.log(`✅ Created ${count} demo flashcards`);
  return count;
}

/**
 * Zeigt Statistiken über die aktuellen Daten
 */
export function showDataStats(): void {
  const data = localStorage.getItem('flashcard-app-data');
  if (!data) {
    console.log('❌ No data found in localStorage');
    return;
  }

  const appData = JSON.parse(data);
  console.log('📊 App Data Statistics:');
  console.log('  Total Flashcards:', appData.flashcards.length);
  console.log('  Learning Sessions:', appData.learningSessions.length);
  console.log('  Quiz Sessions:', appData.quizSessions.length);
  console.log('  Cards per Session:', appData.appSettings.cardsPerSession);
  console.log('  Quiz Questions:', appData.appSettings.quizQuestionCount);
}
