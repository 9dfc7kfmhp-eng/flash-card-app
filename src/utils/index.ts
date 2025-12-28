// LocalStorage
export {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage,
  hasLocalStorageKey,
} from './localStorage';

// Flashcard Service
export {
  createFlashcard,
  getAllFlashcards,
  getFlashcardById,
  updateFlashcard,
  updateCardStatistics,
  batchUpdateCardStatistics,
  deleteFlashcard,
  isDuplicateCard,
  getCardsToReview,
  searchFlashcards,
  loadAppData,
  saveAppData,
} from './flashcardService';

// App Initialization
export { initializeAppData, resetAppData } from './initializeApp';

// Seed Data (for testing)
export { seedDemoData, showDataStats } from './seedData';

// Quiz Generator
export {
  generateMultipleChoiceQuestion,
  generateFillInBlankQuestion,
  generateQuiz,
} from './quizGenerator';

// Quiz Service
export {
  saveQuizSession,
  getAllQuizSessions,
  getQuizSessionsByType,
  getAverageQuizScore,
} from './quizService';

// Learning Session Service
export {
  getAllLearningSessions,
  getDailyActivity,
  formatDateShort,
  getOverallLearningStats,
} from './learningSessionService';
export type {
  DailyActivity,
  OverallLearningStats,
} from './learningSessionService';
