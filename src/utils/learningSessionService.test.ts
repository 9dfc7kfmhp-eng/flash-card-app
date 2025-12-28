import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDailyActivity,
  formatDateShort,
  getOverallLearningStats,
} from './learningSessionService';
import { saveAppData } from './flashcardService';
import type { LearningSession, AppData } from '../types';
import { DEFAULT_APP_DATA } from '../types';

describe('learningSessionService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const createMockSession = (
    date: Date,
    cardsReviewed: string[],
    correctCards: string[],
    incorrectCards: string[],
    duration: number = 300
  ): LearningSession => ({
    id: `session-${Math.random()}`,
    date: date.getTime(),
    cardsReviewed,
    correctCards,
    incorrectCards,
    duration,
  });

  describe('getDailyActivity', () => {
    it('should return array with correct number of days', () => {
      const activity = getDailyActivity(7);
      expect(activity).toHaveLength(7);
    });

    it('should return 30 days when specified', () => {
      const activity = getDailyActivity(30);
      expect(activity).toHaveLength(30);
    });

    it('should initialize all days with zero values', () => {
      const activity = getDailyActivity(7);

      activity.forEach(day => {
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('cardsReviewed');
        expect(day).toHaveProperty('correctCards');
        expect(day).toHaveProperty('incorrectCards');
        expect(day).toHaveProperty('successRate');
      });
    });

    it('should aggregate sessions by date', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const session1 = createMockSession(today, ['1', '2'], ['1'], ['2']);
      const session2 = createMockSession(today, ['3', '4'], ['3', '4'], []);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const activity = getDailyActivity(7);
      const todayActivity = activity[activity.length - 1]; // Last day should be today

      expect(todayActivity.cardsReviewed).toBe(4); // 2 + 2
      expect(todayActivity.correctCards).toBe(3); // 1 + 2
      expect(todayActivity.incorrectCards).toBe(1); // 1 + 0
    });

    it('should calculate correct success rate', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 75% success rate: 3 correct out of 4
      const session = createMockSession(
        today,
        ['1', '2', '3', '4'],
        ['1', '2', '3'],
        ['4']
      );

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session],
      };
      saveAppData(appData);

      const activity = getDailyActivity(7);
      const todayActivity = activity[activity.length - 1];

      expect(todayActivity.successRate).toBe(75);
    });

    it('should handle days with no sessions', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const session = createMockSession(yesterday, ['1'], ['1'], []);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session],
      };
      saveAppData(appData);

      const activity = getDailyActivity(7);
      const todayActivity = activity[activity.length - 1];

      expect(todayActivity.cardsReviewed).toBe(0);
      expect(todayActivity.successRate).toBe(0);
    });

    it('should sort results by date ascending', () => {
      const activity = getDailyActivity(7);

      for (let i = 1; i < activity.length; i++) {
        expect(activity[i].date >= activity[i - 1].date).toBe(true);
      }
    });

    it('should only include sessions within date range', () => {
      const today = new Date();
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const oldSession = createMockSession(twoWeeksAgo, ['1'], ['1'], []);
      const newSession = createMockSession(today, ['2'], ['2'], []);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [oldSession, newSession],
      };
      saveAppData(appData);

      const activity = getDailyActivity(7);

      // Old session should not be included in 7-day range
      const totalCards = activity.reduce(
        (sum, day) => sum + day.cardsReviewed,
        0
      );
      expect(totalCards).toBe(1); // Only newSession
    });
  });

  describe('formatDateShort', () => {
    it('should format date string correctly', () => {
      expect(formatDateShort('2024-12-28')).toBe('28.12');
      expect(formatDateShort('2024-01-05')).toBe('05.01');
    });

    it('should handle different months', () => {
      expect(formatDateShort('2024-06-15')).toBe('15.06');
      expect(formatDateShort('2024-11-30')).toBe('30.11');
    });
  });

  describe('getOverallLearningStats', () => {
    it('should return zero stats when no sessions exist', () => {
      const stats = getOverallLearningStats();

      expect(stats).toEqual({
        totalSessions: 0,
        totalCardsReviewed: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        overallSuccessRate: 0,
        averageSessionDuration: 0,
      });
    });

    it('should calculate total sessions correctly', () => {
      const today = new Date();
      const session1 = createMockSession(today, ['1'], ['1'], []);
      const session2 = createMockSession(today, ['2'], ['2'], []);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.totalSessions).toBe(2);
    });

    it('should calculate total cards reviewed', () => {
      const today = new Date();
      const session1 = createMockSession(today, ['1', '2', '3'], ['1'], ['2']);
      const session2 = createMockSession(today, ['4', '5'], ['4'], ['5']);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.totalCardsReviewed).toBe(5);
    });

    it('should calculate correct and incorrect totals', () => {
      const today = new Date();
      const session1 = createMockSession(today, ['1', '2'], ['1'], ['2']);
      const session2 = createMockSession(
        today,
        ['3', '4', '5'],
        ['3', '4'],
        ['5']
      );

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.totalCorrect).toBe(3); // 1 + 2
      expect(stats.totalIncorrect).toBe(2); // 1 + 1
    });

    it('should calculate overall success rate correctly', () => {
      const today = new Date();
      // 60% success: 3 correct out of 5
      const session1 = createMockSession(
        today,
        ['1', '2', '3'],
        ['1', '2'],
        ['3']
      );
      const session2 = createMockSession(today, ['4', '5'], ['4'], ['5']);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.overallSuccessRate).toBe(60);
    });

    it('should calculate average session duration', () => {
      const today = new Date();
      const session1 = createMockSession(today, ['1'], ['1'], [], 300); // 5 min
      const session2 = createMockSession(today, ['2'], ['2'], [], 900); // 15 min

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.averageSessionDuration).toBe(600); // 10 min average
    });

    it('should round average duration to nearest integer', () => {
      const today = new Date();
      const session1 = createMockSession(today, ['1'], ['1'], [], 100);
      const session2 = createMockSession(today, ['2'], ['2'], [], 150);

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session1, session2],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(Number.isInteger(stats.averageSessionDuration)).toBe(true);
      expect(stats.averageSessionDuration).toBe(125);
    });

    it('should handle 100% success rate', () => {
      const today = new Date();
      const session = createMockSession(
        today,
        ['1', '2', '3'],
        ['1', '2', '3'],
        []
      );

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.overallSuccessRate).toBe(100);
    });

    it('should handle 0% success rate', () => {
      const today = new Date();
      const session = createMockSession(
        today,
        ['1', '2', '3'],
        [],
        ['1', '2', '3']
      );

      const appData: AppData = {
        ...DEFAULT_APP_DATA,
        learningSessions: [session],
      };
      saveAppData(appData);

      const stats = getOverallLearningStats();
      expect(stats.overallSuccessRate).toBe(0);
    });
  });
});
