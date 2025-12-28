import { describe, it, expect } from 'vitest';
import {
  generateMultipleChoiceQuestion,
  generateFillInBlankQuestion,
  generateQuiz,
} from './quizGenerator';
import type { Flashcard } from '../types/flashcard';

const createMockCard = (
  id: string,
  spanish: string,
  english: string
): Flashcard => ({
  id,
  spanish,
  english,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  statistics: {
    timesShown: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    lastReviewed: null,
    successRate: 0,
    status: 'new',
    consecutiveCorrect: 0,
  },
});

describe('quizGenerator', () => {
  describe('generateMultipleChoiceQuestion', () => {
    it('should generate a question with 4 options', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
        createMockCard('4', 'por favor', 'please'),
      ];

      const question = generateMultipleChoiceQuestion(cards[0], cards);

      expect(question.options!).toHaveLength(4);
      expect(question.options!).toContain('hello');
      expect(question.correctAnswer).toBe('hello');
      expect(question.question).toBe('hola');
    });

    it('should set the correct answer index', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
        createMockCard('4', 'por favor', 'please'),
      ];

      const question = generateMultipleChoiceQuestion(cards[0], cards);

      expect(question.options![question.correctIndex!]).toBe('hello');
    });

    it('should include cardId reference', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
      ];

      const question = generateMultipleChoiceQuestion(cards[0], cards);

      expect(question.cardId).toBe('1');
    });

    it('should not include the correct answer in wrong answers', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
        createMockCard('4', 'por favor', 'please'),
      ];

      const question = generateMultipleChoiceQuestion(cards[0], cards);

      // Count how many times 'hello' appears
      const helloCount = question.options!.filter(
        (opt: string) => opt === 'hello'
      ).length;
      expect(helloCount).toBe(1);
    });

    it('should handle when there are fewer than 4 unique answers', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
      ];

      const question = generateMultipleChoiceQuestion(cards[0], cards);

      expect(question.options!).toHaveLength(4);
      expect(question.options!).toContain('hello');
    });

    it('should generate unique question IDs', async () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
      ];

      const question1 = generateMultipleChoiceQuestion(cards[0], cards);
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 2));
      const question2 = generateMultipleChoiceQuestion(cards[0], cards);

      expect(question1.id).not.toBe(question2.id);
    });

    it('should initialize userAnswer and isCorrect as null', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
      ];

      const question = generateMultipleChoiceQuestion(cards[0], cards);

      expect(question.userAnswer).toBe('');
      expect(question.isCorrect).toBe(false);
      expect(question.wasCorrect).toBe(false);
    });
  });

  describe('generateFillInBlankQuestion', () => {
    it('should generate a question with 4-6 options', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
        createMockCard('4', 'por favor', 'please'),
        createMockCard('5', 'sí', 'yes'),
        createMockCard('6', 'no', 'no'),
      ];

      const question = generateFillInBlankQuestion(cards[0], cards);

      expect(question.options!.length).toBeGreaterThanOrEqual(4);
      expect(question.options!.length).toBeLessThanOrEqual(6);
    });

    it('should include the correct answer in options', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
      ];

      const question = generateFillInBlankQuestion(cards[0], cards);

      expect(question.options!).toContain('hello');
      expect(question.correctAnswer).toBe('hello');
    });

    it('should set the correct answer index', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
      ];

      const question = generateFillInBlankQuestion(cards[0], cards);

      expect(question.options![question.correctIndex!]).toBe('hello');
    });

    it('should not duplicate the correct answer', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
        createMockCard('3', 'gracias', 'thank you'),
      ];

      const question = generateFillInBlankQuestion(cards[0], cards);

      const helloCount = question.options!.filter(
        (opt: string) => opt === 'hello'
      ).length;
      expect(helloCount).toBe(1);
    });

    it('should handle limited card sets gracefully', () => {
      const cards: Flashcard[] = [
        createMockCard('1', 'hola', 'hello'),
        createMockCard('2', 'adiós', 'goodbye'),
      ];

      const question = generateFillInBlankQuestion(cards[0], cards);

      expect(question.options!).toContain('hello');
      expect(question.options!.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('generateQuiz', () => {
    const mockCards: Flashcard[] = [
      createMockCard('1', 'hola', 'hello'),
      createMockCard('2', 'adiós', 'goodbye'),
      createMockCard('3', 'gracias', 'thank you'),
      createMockCard('4', 'por favor', 'please'),
      createMockCard('5', 'sí', 'yes'),
    ];

    it('should return empty array when no cards are provided', () => {
      const quiz = generateQuiz('multiple-choice', [], 10);
      expect(quiz).toEqual([]);
    });

    it('should generate the requested number of questions', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 3);
      expect(quiz).toHaveLength(3);
    });

    it('should limit questions to available cards', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 10);
      expect(quiz).toHaveLength(5); // Only 5 cards available
    });

    it('should generate multiple choice questions in multiple-choice mode', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 3);

      quiz.forEach(question => {
        expect(question.options!).toHaveLength(4);
        expect(question.correctAnswer).toBeDefined();
        expect(question.question).toBeDefined();
      });
    });

    it('should generate fill-in-blank questions in fill-in-blank mode', () => {
      const quiz = generateQuiz('fill-in-blank', mockCards, 3);

      quiz.forEach(question => {
        expect(question.options!.length).toBeGreaterThanOrEqual(2);
        expect(question.correctAnswer).toBeDefined();
        expect(question.question).toBeDefined();
      });
    });

    it('should not repeat cards within a single quiz', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 3);

      const cardIds = quiz.map(q => q.cardId);
      const uniqueCardIds = new Set(cardIds);

      expect(uniqueCardIds.size).toBe(cardIds.length);
    });

    it('should generate unique question IDs', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 3);

      const questionIds = quiz.map(q => q.id);
      const uniqueIds = new Set(questionIds);

      expect(uniqueIds.size).toBe(questionIds.length);
    });

    it('should reference the correct card for each question', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 3);

      quiz.forEach(question => {
        const card = mockCards.find(c => c.id === question.cardId);
        expect(card).toBeDefined();
        expect(question.question).toBe(card!.spanish);
        expect(question.correctAnswer).toBe(card!.english);
      });
    });

    it('should initialize all questions with empty user answers', () => {
      const quiz = generateQuiz('multiple-choice', mockCards, 3);

      quiz.forEach(question => {
        expect(question.userAnswer).toBe('');
        expect(question.isCorrect).toBe(false);
        expect(question.wasCorrect).toBe(false);
      });
    });
  });
});
