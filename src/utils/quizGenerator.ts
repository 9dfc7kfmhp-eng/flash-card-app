import type { Flashcard } from '../types/flashcard';
import type { QuizQuestion } from '../types/session';

type QuizMode = 'multiple-choice' | 'fill-in-blank';

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a Multiple Choice question from a flashcard
 * @param card - The card to create a question for
 * @param allCards - All available flashcards to pick wrong answers from
 * @returns A QuizQuestion object with 4 answer options
 */
export function generateMultipleChoiceQuestion(
  card: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const correctAnswer = card.english;

  // Filter out the current card and get potential wrong answers
  const otherCards = allCards.filter(c => c.id !== card.id);

  // Get unique wrong answers (prevent duplicates)
  const uniqueWrongAnswers = Array.from(
    new Set(otherCards.map(c => c.english))
  ).filter(answer => answer !== correctAnswer);

  // Pick 3 random wrong answers
  const shuffledWrong = shuffle(uniqueWrongAnswers);
  const wrongAnswers = shuffledWrong.slice(0, 3);

  // If we don't have enough wrong answers, generate variations
  while (wrongAnswers.length < 3) {
    wrongAnswers.push(`${correctAnswer} (falsch)`);
  }

  // Combine correct and wrong answers, then shuffle
  const allAnswers = shuffle([correctAnswer, ...wrongAnswers]);

  // Find the index of the correct answer after shuffling
  const correctIndex = allAnswers.indexOf(correctAnswer);

  return {
    id: `quiz-${card.id}-${Date.now()}`,
    cardId: card.id,
    question: card.spanish,
    correctAnswer,
    userAnswer: '',
    isCorrect: false,
    wasCorrect: false,
    options: allAnswers,
    correctIndex,
  };
}

/**
 * Generates a Fill-in-Blank question from a flashcard
 * @param card - The card to create a question for
 * @param allCards - All available flashcards to pick wrong answers from
 * @returns A QuizQuestion object with 4-6 word options
 */
export function generateFillInBlankQuestion(
  card: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const correctAnswer = card.english;

  // Filter out the current card and get potential wrong answers
  const otherCards = allCards.filter(c => c.id !== card.id);

  // Get unique wrong answers
  const uniqueWrongAnswers = Array.from(
    new Set(otherCards.map(c => c.english))
  ).filter(answer => answer !== correctAnswer);

  // Pick 3-5 random wrong answers (random count between 3-5)
  const wrongAnswerCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
  const shuffledWrong = shuffle(uniqueWrongAnswers);
  const wrongAnswers = shuffledWrong.slice(0, wrongAnswerCount);

  // If we don't have enough wrong answers, use what we have
  const allAnswers = shuffle([correctAnswer, ...wrongAnswers]);

  // Find the index of the correct answer after shuffling
  const correctIndex = allAnswers.indexOf(correctAnswer);

  return {
    id: `quiz-${card.id}-${Date.now()}`,
    cardId: card.id,
    question: card.spanish,
    correctAnswer,
    userAnswer: '',
    isCorrect: false,
    wasCorrect: false,
    options: allAnswers,
    correctIndex,
  };
}

/**
 * Generates a full quiz session with random cards
 * @param mode - The quiz mode (multiple-choice or fill-in-blank)
 * @param allCards - All available flashcards
 * @param questionCount - Number of questions to generate
 * @returns Array of QuizQuestion objects
 */
export function generateQuiz(
  mode: QuizMode,
  allCards: Flashcard[],
  questionCount: number
): QuizQuestion[] {
  if (allCards.length === 0) {
    return [];
  }

  // Limit question count to available cards
  const actualCount = Math.min(questionCount, allCards.length);

  // Shuffle cards and take the first N
  const selectedCards = shuffle(allCards).slice(0, actualCount);

  // Generate questions based on mode
  const generator =
    mode === 'multiple-choice'
      ? generateMultipleChoiceQuestion
      : generateFillInBlankQuestion;

  return selectedCards.map(card => generator(card, allCards));
}
