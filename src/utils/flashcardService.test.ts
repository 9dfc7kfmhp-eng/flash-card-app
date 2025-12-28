import { describe, it, expect, beforeEach } from 'vitest';
import {
  createFlashcard,
  getAllFlashcards,
  getFlashcardById,
  updateFlashcard,
  updateCardStatistics,
  deleteFlashcard,
  isDuplicateCard,
  getCardsToReview,
  searchFlashcards,
  saveAppData,
} from './flashcardService';
import { DEFAULT_APP_DATA } from '../types';

describe.sequential('flashcardService', () => {
  beforeEach(() => {
    // Reset to default empty state before each test
    saveAppData(DEFAULT_APP_DATA);
  });

  describe('createFlashcard', () => {
    it('should create a new flashcard with correct properties', () => {
      const input = {
        spanish: 'hola',
        english: 'hello',
        notes: 'greeting',
      };

      const card = createFlashcard(input);

      expect(card).toBeDefined();
      expect(card.id).toBeDefined();
      expect(card.spanish).toBe('hola');
      expect(card.english).toBe('hello');
      expect(card.notes).toBe('greeting');
      expect(card.createdAt).toBeDefined();
      expect(card.updatedAt).toBeDefined();
      expect(card.statistics).toEqual({
        timesShown: 0,
        timesCorrect: 0,
        timesIncorrect: 0,
        lastReviewed: null,
        successRate: 0,
        status: 'new',
        consecutiveCorrect: 0,
      });
    });

    it('should trim whitespace from inputs', () => {
      const input = {
        spanish: '  hola  ',
        english: '  hello  ',
        notes: '  greeting  ',
      };

      const card = createFlashcard(input);

      expect(card.spanish).toBe('hola');
      expect(card.english).toBe('hello');
      expect(card.notes).toBe('greeting');
    });

    it('should handle optional notes', () => {
      const input = {
        spanish: 'hola',
        english: 'hello',
      };

      const card = createFlashcard(input);

      expect(card.notes).toBeUndefined();
    });

    it('should persist the card to localStorage', () => {
      const input = {
        spanish: 'hola',
        english: 'hello',
      };

      createFlashcard(input);
      const cards = getAllFlashcards();

      expect(cards).toHaveLength(1);
      expect(cards[0].spanish).toBe('hola');
    });
  });

  describe('getAllFlashcards', () => {
    it('should return an empty array when no cards exist', () => {
      const cards = getAllFlashcards();
      expect(cards).toEqual([]);
    });

    it('should return all flashcards', () => {
      createFlashcard({ spanish: 'hola', english: 'hello' });
      createFlashcard({ spanish: 'adiós', english: 'goodbye' });

      const cards = getAllFlashcards();

      expect(cards).toHaveLength(2);
      expect(cards[0].spanish).toBe('hola');
      expect(cards[1].spanish).toBe('adiós');
    });
  });

  describe('getFlashcardById', () => {
    it('should return undefined when card does not exist', () => {
      const card = getFlashcardById('nonexistent-id');
      expect(card).toBeUndefined();
    });

    it('should return the correct flashcard', () => {
      const created = createFlashcard({ spanish: 'hola', english: 'hello' });
      const found = getFlashcardById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.spanish).toBe('hola');
    });
  });

  describe('updateFlashcard', () => {
    it('should return undefined when card does not exist', () => {
      const result = updateFlashcard('nonexistent-id', { spanish: 'updated' });
      expect(result).toBeUndefined();
    });

    it('should update flashcard properties', async () => {
      const created = createFlashcard({ spanish: 'hola', english: 'hello' });
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 2));
      const updated = updateFlashcard(created.id, {
        spanish: 'buenos días',
        english: 'good morning',
      });

      expect(updated).toBeDefined();
      expect(updated?.spanish).toBe('buenos días');
      expect(updated?.english).toBe('good morning');
      expect(updated?.updatedAt).toBeGreaterThan(created.updatedAt);
    });

    it('should persist updates to localStorage', () => {
      const created = createFlashcard({ spanish: 'hola', english: 'hello' });
      updateFlashcard(created.id, { spanish: 'updated' });

      const found = getFlashcardById(created.id);
      expect(found?.spanish).toBe('updated');
    });
  });

  describe('updateCardStatistics', () => {
    it('should update statistics when answer is correct', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      updateCardStatistics(card.id, true);

      const updated = getFlashcardById(card.id);
      expect(updated?.statistics.timesShown).toBe(1);
      expect(updated?.statistics.timesCorrect).toBe(1);
      expect(updated?.statistics.timesIncorrect).toBe(0);
      expect(updated?.statistics.consecutiveCorrect).toBe(1);
      expect(updated?.statistics.successRate).toBe(100);
      expect(updated?.statistics.lastReviewed).toBeDefined();
    });

    it('should update statistics when answer is incorrect', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      updateCardStatistics(card.id, false);

      const updated = getFlashcardById(card.id);
      expect(updated?.statistics.timesShown).toBe(1);
      expect(updated?.statistics.timesCorrect).toBe(0);
      expect(updated?.statistics.timesIncorrect).toBe(1);
      expect(updated?.statistics.consecutiveCorrect).toBe(0);
      expect(updated?.statistics.successRate).toBe(0);
    });

    it('should calculate correct success rate', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      // 3 correct, 1 incorrect = 75%
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, false);

      const updated = getFlashcardById(card.id);
      expect(updated?.statistics.timesShown).toBe(4);
      expect(updated?.statistics.timesCorrect).toBe(3);
      expect(updated?.statistics.successRate).toBe(75);
    });

    it('should reset consecutiveCorrect on incorrect answer', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, true);
      expect(getFlashcardById(card.id)?.statistics.consecutiveCorrect).toBe(2);

      updateCardStatistics(card.id, false);
      expect(getFlashcardById(card.id)?.statistics.consecutiveCorrect).toBe(0);
    });

    it('should update card status to "learned" after 3+ correct with 70%+ success', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      // 3 correct answers with 100% success rate
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, true);

      const updated = getFlashcardById(card.id);
      expect(updated?.statistics.status).toBe('learned');
    });

    it('should keep status as "learning" with less than 70% success', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      // 2 correct, 2 incorrect = 50%
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, false);
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, false);

      const updated = getFlashcardById(card.id);
      expect(updated?.statistics.status).toBe('learning');
    });
  });

  describe('deleteFlashcard', () => {
    it('should return false when card does not exist', () => {
      const result = deleteFlashcard('nonexistent-id');
      expect(result).toBe(false);
    });

    it('should delete the flashcard and return true', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      const result = deleteFlashcard(card.id);

      expect(result).toBe(true);
      expect(getFlashcardById(card.id)).toBeUndefined();
    });

    it('should persist deletion to localStorage', () => {
      const card1 = createFlashcard({ spanish: 'hola', english: 'hello' });
      const card2 = createFlashcard({ spanish: 'adiós', english: 'goodbye' });

      deleteFlashcard(card1.id);

      const cards = getAllFlashcards();
      expect(cards).toHaveLength(1);
      expect(cards[0].id).toBe(card2.id);
    });
  });

  describe('isDuplicateCard', () => {
    it('should return false when no duplicate exists', () => {
      const result = isDuplicateCard('hola');
      expect(result).toBe(false);
    });

    it('should return true when duplicate exists', () => {
      createFlashcard({ spanish: 'hola', english: 'hello' });

      const result = isDuplicateCard('hola');
      expect(result).toBe(true);
    });

    it('should be case-insensitive', () => {
      createFlashcard({ spanish: 'hola', english: 'hello' });

      expect(isDuplicateCard('HOLA')).toBe(true);
      expect(isDuplicateCard('HoLa')).toBe(true);
    });

    it('should trim whitespace', () => {
      createFlashcard({ spanish: 'hola', english: 'hello' });

      expect(isDuplicateCard('  hola  ')).toBe(true);
    });

    it('should exclude a specific card ID', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      const result = isDuplicateCard('hola', card.id);
      expect(result).toBe(false);
    });
  });

  describe('getCardsToReview', () => {
    it('should return empty array when no cards need review', () => {
      const cards = getCardsToReview();
      expect(cards).toEqual([]);
    });

    it('should return cards with success rate < 70%', () => {
      const card1 = createFlashcard({ spanish: 'hola', english: 'hello' });
      const card2 = createFlashcard({ spanish: 'adiós', english: 'goodbye' });

      // card1: 50% success rate
      updateCardStatistics(card1.id, true);
      updateCardStatistics(card1.id, false);

      // card2: 100% success rate (3+ times)
      updateCardStatistics(card2.id, true);
      updateCardStatistics(card2.id, true);
      updateCardStatistics(card2.id, true);

      const toReview = getCardsToReview();

      expect(toReview).toHaveLength(1);
      expect(toReview[0].id).toBe(card1.id);
    });

    it('should exclude cards with 2+ consecutive correct answers', () => {
      const card = createFlashcard({ spanish: 'hola', english: 'hello' });

      // 2 consecutive correct
      updateCardStatistics(card.id, true);
      updateCardStatistics(card.id, true);

      const toReview = getCardsToReview();
      expect(toReview).toHaveLength(0);
    });

    it('should sort by success rate (lowest first)', () => {
      const card1 = createFlashcard({ spanish: 'uno', english: 'one' });
      const card2 = createFlashcard({ spanish: 'dos', english: 'two' });
      const card3 = createFlashcard({ spanish: 'tres', english: 'three' });

      // card1: 67%
      updateCardStatistics(card1.id, true);
      updateCardStatistics(card1.id, true);
      updateCardStatistics(card1.id, false);

      // card2: 33%
      updateCardStatistics(card2.id, true);
      updateCardStatistics(card2.id, false);
      updateCardStatistics(card2.id, false);

      // card3: 50%
      updateCardStatistics(card3.id, true);
      updateCardStatistics(card3.id, false);

      const toReview = getCardsToReview();

      expect(toReview).toHaveLength(3);
      expect(toReview[0].id).toBe(card2.id); // 33%
      expect(toReview[1].id).toBe(card3.id); // 50%
      expect(toReview[2].id).toBe(card1.id); // 67%
    });
  });

  describe('searchFlashcards', () => {
    beforeEach(() => {
      createFlashcard({
        spanish: 'hola',
        english: 'hello',
        notes: 'greeting',
      });
      createFlashcard({
        spanish: 'adiós',
        english: 'goodbye',
        notes: 'farewell',
      });
      createFlashcard({
        spanish: 'buenos días',
        english: 'good morning',
      });
    });

    it('should return all cards when query is empty', () => {
      const results = searchFlashcards('');
      expect(results).toHaveLength(3);
    });

    it('should search by spanish term', () => {
      const results = searchFlashcards('hola');
      expect(results).toHaveLength(1);
      expect(results[0].spanish).toBe('hola');
    });

    it('should search by english term', () => {
      const results = searchFlashcards('goodbye');
      expect(results).toHaveLength(1);
      expect(results[0].english).toBe('goodbye');
    });

    it('should search by notes', () => {
      const results = searchFlashcards('greeting');
      expect(results).toHaveLength(1);
      expect(results[0].notes).toBe('greeting');
    });

    it('should be case-insensitive', () => {
      const results = searchFlashcards('HOLA');
      expect(results).toHaveLength(1);
      expect(results[0].spanish).toBe('hola');
    });

    it('should match partial strings', () => {
      const results = searchFlashcards('buen');
      expect(results).toHaveLength(1);
      expect(results[0].spanish).toBe('buenos días');
    });

    it('should return multiple matches', () => {
      const results = searchFlashcards('o'); // matches hola, adiós, buenos, good, morning
      expect(results.length).toBeGreaterThan(1);
    });
  });
});
