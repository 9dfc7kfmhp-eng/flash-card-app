import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {
  LearningSession,
  QuizSession,
  ActiveLearningSession,
  ActiveQuizSession,
} from '../types';
import {
  batchUpdateCardStatistics,
  saveLearningSession,
  saveQuizSession,
  getAllLearningSessions,
  getAllQuizSessions,
} from '../services/storageAdapter';
import { generateUUID } from '../utils/uuid';

/**
 * SessionContext Value Type
 */
interface SessionContextValue {
  // Learning Session State
  activeLearningSession: ActiveLearningSession | null;
  startLearningSession: (cardIds: string[]) => void;
  endLearningSession: () => Promise<LearningSession | null>;
  recordAnswer: (cardId: string, wasCorrect: boolean) => void;
  nextCard: () => void;
  previousCard: () => void;
  flipCard: () => void;

  // Quiz Session State
  activeQuizSession: ActiveQuizSession | null;
  startQuizSession: (
    type: 'multiple-choice' | 'fill-in-blank',
    cardIds: string[]
  ) => void;
  endQuizSession: () => Promise<QuizSession | null>;
  answerQuizQuestion: (cardId: string, userAnswer: string) => void;

  // Session History
  learningSessions: LearningSession[];
  quizSessions: QuizSession[];
  refreshSessions: () => Promise<void>;
}

// Context erstellen
const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

/**
 * SessionProvider Props
 */
interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Fisher-Yates Shuffle Algorithmus
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * SessionProvider Component
 * Verwaltet Lern- und Quiz-Sessions
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const [activeLearningSession, setActiveLearningSession] =
    useState<ActiveLearningSession | null>(null);
  const [activeQuizSession, setActiveQuizSession] =
    useState<ActiveQuizSession | null>(null);
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>(
    []
  );
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);

  // Performance: Sammle alle Card-Updates während der Session
  const [pendingUpdates, setPendingUpdates] = useState<
    Array<{ cardId: string; wasCorrect: boolean }>
  >([]);

  /**
   * Lädt Session-Historie aus Storage (LocalStorage oder Supabase)
   */
  const refreshSessions = useCallback(async () => {
    const [learningSessions, quizSessions] = await Promise.all([
      getAllLearningSessions(),
      getAllQuizSessions(),
    ]);
    setLearningSessions(learningSessions);
    setQuizSessions(quizSessions);
  }, []);

  /**
   * Startet eine neue Lern-Session
   */
  const startLearningSession = useCallback((cardIds: string[]) => {
    const shuffled = shuffleArray(cardIds);
    const session: ActiveLearningSession = {
      cards: shuffled,
      currentIndex: 0,
      isFlipped: false,
      correctInSession: [],
      incorrectInSession: [],
      startTime: Date.now(),
      repeatCount: 0,
    };
    setActiveLearningSession(session);
    // Performance: Reset pending updates beim Start
    setPendingUpdates([]);
  }, []);

  /**
   * Beendet die aktuelle Lern-Session und speichert sie
   */
  const endLearningSession =
    useCallback(async (): Promise<LearningSession | null> => {
      if (!activeLearningSession) return null;

      // Performance: Batch-Update aller Card-Statistiken (1x statt 20x)
      if (pendingUpdates.length > 0) {
        await batchUpdateCardStatistics(pendingUpdates);
        setPendingUpdates([]); // Reset nach Batch-Update
      }

      const duration = Math.floor(
        (Date.now() - activeLearningSession.startTime) / 1000
      );

      const session: LearningSession = {
        id: generateUUID(),
        date: Date.now(),
        cardsReviewed: activeLearningSession.cards,
        correctCards: activeLearningSession.correctInSession,
        incorrectCards: activeLearningSession.incorrectInSession,
        duration,
      };

      // Speichere Session in Storage (LocalStorage oder Supabase)
      await saveLearningSession(session);

      // Räume aktive Session auf
      setActiveLearningSession(null);
      await refreshSessions();

      return session;
    }, [activeLearningSession, pendingUpdates, refreshSessions]);

  /**
   * Zeichnet eine Antwort auf und aktualisiert Statistiken
   */
  const recordAnswer = useCallback((cardId: string, wasCorrect: boolean) => {
    // Performance: Sammle Updates statt sofort zu speichern
    setPendingUpdates(prev => [...prev, { cardId, wasCorrect }]);

    // Aktualisiere Session-State
    setActiveLearningSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        correctInSession: wasCorrect
          ? [...prev.correctInSession, cardId]
          : prev.correctInSession,
        incorrectInSession: !wasCorrect
          ? [...prev.incorrectInSession, cardId]
          : prev.incorrectInSession,
      };
    });
  }, []);

  /**
   * Geht zur nächsten Karte
   */
  const nextCard = useCallback(() => {
    setActiveLearningSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isFlipped: false,
      };
    });
  }, []);

  /**
   * Geht zur vorherigen Karte
   */
  const previousCard = useCallback(() => {
    setActiveLearningSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentIndex: Math.max(prev.currentIndex - 1, 0),
        isFlipped: false,
      };
    });
  }, []);

  /**
   * Dreht die aktuelle Karte um
   */
  const flipCard = useCallback(() => {
    setActiveLearningSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isFlipped: !prev.isFlipped,
      };
    });
  }, []);

  /**
   * Startet eine neue Quiz-Session
   */
  const startQuizSession = useCallback(
    (
      type: 'multiple-choice' | 'fill-in-blank',
      _cardIds: string[] // TODO: Wird in Phase 8 verwendet
    ) => {
      const session: ActiveQuizSession = {
        type,
        questions: [],
        currentQuestionIndex: 0,
        startTime: Date.now(),
      };
      setActiveQuizSession(session);
    },
    []
  );

  /**
   * Beendet die aktuelle Quiz-Session
   */
  const endQuizSession = useCallback(async (): Promise<QuizSession | null> => {
    if (!activeQuizSession) return null;

    const correctAnswers = activeQuizSession.questions.filter(
      q => q.wasCorrect
    ).length;
    const score =
      activeQuizSession.questions.length > 0
        ? Math.round(
            (correctAnswers / activeQuizSession.questions.length) * 100
          )
        : 0;

    const session: QuizSession = {
      id: generateUUID(),
      type: activeQuizSession.type,
      date: Date.now(),
      questions: activeQuizSession.questions,
      score,
      completed: true,
    };

    // Speichere Session in Storage (LocalStorage oder Supabase)
    await saveQuizSession(session);

    // Räume aktive Session auf
    setActiveQuizSession(null);
    await refreshSessions();

    return session;
  }, [activeQuizSession, refreshSessions]);

  /**
   * Beantwortet eine Quiz-Frage
   */
  const answerQuizQuestion = useCallback(
    (cardId: string, userAnswer: string) => {
      if (!activeQuizSession) return;

      // TODO: Implementierung für Quiz-Fragen
      // Wird in Phase 8 vollständig implementiert
      console.log('Quiz answer recorded:', cardId, userAnswer);
    },
    [activeQuizSession]
  );

  const value: SessionContextValue = useMemo(
    () => ({
      activeLearningSession,
      startLearningSession,
      endLearningSession,
      recordAnswer,
      nextCard,
      previousCard,
      flipCard,
      activeQuizSession,
      startQuizSession,
      endQuizSession,
      answerQuizQuestion,
      learningSessions,
      quizSessions,
      refreshSessions,
    }),
    [
      activeLearningSession,
      startLearningSession,
      endLearningSession,
      recordAnswer,
      nextCard,
      previousCard,
      flipCard,
      activeQuizSession,
      startQuizSession,
      endQuizSession,
      answerQuizQuestion,
      learningSessions,
      quizSessions,
      refreshSessions,
    ]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

/**
 * Custom Hook zum Verwenden des SessionContext
 * @throws Error wenn außerhalb des Providers verwendet
 */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
