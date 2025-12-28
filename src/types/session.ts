/**
 * Quiz-Typ für verschiedene Quiz-Modi
 */
export type QuizType = 'multiple-choice' | 'fill-in-blank';

/**
 * Eine einzelne Quiz-Frage mit Antwort
 */
export interface QuizQuestion {
  /** Optional: ID der Quiz-Frage selbst */
  id?: string;
  /** ID der Flashcard */
  cardId: string;
  /** Die Frage (z.B. spanisches Wort) */
  question?: string;
  /** Antwortmöglichkeiten (für Multiple Choice oder Fill-in-Blank) */
  options?: string[];
  /** Index der korrekten Antwort in options Array */
  correctIndex?: number;
  /** Vom Benutzer gegebene Antwort */
  userAnswer: string;
  /** Korrekte Antwort */
  correctAnswer: string;
  /** Ob die Antwort korrekt war (alternative zu wasCorrect) */
  isCorrect?: boolean;
  /** Ob die Antwort korrekt war */
  wasCorrect: boolean;
}

/**
 * Quiz-Session mit allen Fragen und Ergebnissen
 */
export interface QuizSession {
  /** Eindeutige Session-ID */
  id: string;
  /** Typ des Quiz (Multiple Choice oder Lückentext) */
  type: QuizType;
  /** Zeitpunkt des Quiz (Timestamp) */
  date: number;
  /** Liste aller Fragen in diesem Quiz */
  questions: QuizQuestion[];
  /** Erfolgsquote in % (0-100) */
  score: number;
  /** Ob das Quiz abgeschlossen wurde */
  completed: boolean;
}

/**
 * Lern-Session im klassischen Flashcard-Modus
 */
export interface LearningSession {
  /** Eindeutige Session-ID */
  id: string;
  /** Zeitpunkt der Session (Timestamp) */
  date: number;
  /** Array von Card-IDs die wiederholt wurden */
  cardsReviewed: string[];
  /** IDs der korrekt beantworteten Karten */
  correctCards: string[];
  /** IDs der falsch beantworteten Karten */
  incorrectCards: string[];
  /** Dauer der Session in Sekunden */
  duration: number;
}

/**
 * Session-State während einer aktiven Lern-Session
 */
export interface ActiveLearningSession {
  /** Karten in dieser Session */
  cards: string[]; // Card IDs
  /** Index der aktuellen Karte */
  currentIndex: number;
  /** Ob die aktuelle Karte umgedreht ist */
  isFlipped: boolean;
  /** IDs der korrekt beantworteten Karten in dieser Session */
  correctInSession: string[];
  /** IDs der falsch beantworteten Karten in dieser Session */
  incorrectInSession: string[];
  /** Start-Timestamp der Session */
  startTime: number;
  /** Wiederholungs-Zähler (wie oft wurde diese Session wiederholt) */
  repeatCount: number;
}

/**
 * Session-State während eines aktiven Quiz
 */
export interface ActiveQuizSession {
  /** Typ des Quiz */
  type: QuizType;
  /** Fragen in diesem Quiz */
  questions: QuizQuestion[];
  /** Index der aktuellen Frage */
  currentQuestionIndex: number;
  /** Start-Timestamp des Quiz */
  startTime: number;
}
