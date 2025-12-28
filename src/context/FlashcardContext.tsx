import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from '../types';
import {
  getAllFlashcards,
  createFlashcard as createFlashcardService,
  updateFlashcard as updateFlashcardService,
  deleteFlashcard as deleteFlashcardService,
} from '../services/storageAdapter';
import { initializeAppData } from '../utils';

/**
 * FlashcardContext Value Type
 */
interface FlashcardContextValue {
  /** Alle Flashcards */
  flashcards: Flashcard[];
  /** Lädt Flashcards neu aus Storage (LocalStorage oder Supabase) */
  refreshFlashcards: () => Promise<void>;
  /** Erstellt eine neue Flashcard */
  addFlashcard: (input: CreateFlashcardInput) => Promise<Flashcard | null>;
  /** Aktualisiert eine Flashcard */
  updateFlashcard: (id: string, updates: UpdateFlashcardInput) => Promise<void>;
  /** Löscht eine Flashcard */
  removeFlashcard: (id: string) => Promise<boolean>;
  /** Findet eine Flashcard anhand der ID */
  getFlashcard: (id: string) => Flashcard | undefined;
  /** Loading-State */
  isLoading: boolean;
}

// Context erstellen
const FlashcardContext = createContext<FlashcardContextValue | undefined>(
  undefined
);

/**
 * FlashcardProvider Props
 */
interface FlashcardProviderProps {
  children: React.ReactNode;
}

/**
 * FlashcardProvider Component
 * Verwaltet alle Flashcards im globalen State
 */
export function FlashcardProvider({ children }: FlashcardProviderProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Lädt alle Flashcards aus Storage (LocalStorage oder Supabase)
   */
  const refreshFlashcards = useCallback(async () => {
    setIsLoading(true);
    try {
      const cards = await getAllFlashcards();
      setFlashcards(cards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialisiere App und lade Flashcards beim Mount
  useEffect(() => {
    initializeAppData();
    refreshFlashcards();
  }, [refreshFlashcards]);

  /**
   * Erstellt eine neue Flashcard
   * Verwendet inkrementelles State-Update statt komplettes Neuladen
   */
  const addFlashcard = useCallback(
    async (input: CreateFlashcardInput): Promise<Flashcard | null> => {
      const newCard = await createFlashcardService(input);
      if (newCard) {
        setFlashcards(prev => [...prev, newCard]);
      }
      return newCard;
    },
    []
  );

  /**
   * Aktualisiert eine Flashcard
   * Verwendet inkrementelles State-Update statt komplettes Neuladen
   */
  const updateFlashcard = useCallback(
    async (id: string, updates: UpdateFlashcardInput): Promise<void> => {
      const updatedCard = await updateFlashcardService(id, updates);
      if (updatedCard) {
        setFlashcards(prev =>
          prev.map(card => (card.id === id ? updatedCard : card))
        );
      }
    },
    []
  );

  /**
   * Löscht eine Flashcard
   * Verwendet inkrementelles State-Update statt komplettes Neuladen
   */
  const removeFlashcard = useCallback(async (id: string): Promise<boolean> => {
    const success = await deleteFlashcardService(id);
    if (success) {
      setFlashcards(prev => prev.filter(card => card.id !== id));
    }
    return success;
  }, []);

  /**
   * Findet eine Flashcard anhand der ID
   */
  const getFlashcard = useCallback(
    (id: string): Flashcard | undefined => {
      return flashcards.find(card => card.id === id);
    },
    [flashcards]
  );

  const value: FlashcardContextValue = useMemo(
    () => ({
      flashcards,
      refreshFlashcards,
      addFlashcard,
      updateFlashcard,
      removeFlashcard,
      getFlashcard,
      isLoading,
    }),
    [
      flashcards,
      refreshFlashcards,
      addFlashcard,
      updateFlashcard,
      removeFlashcard,
      getFlashcard,
      isLoading,
    ]
  );

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

/**
 * Custom Hook zum Verwenden des FlashcardContext
 * @throws Error wenn außerhalb des Providers verwendet
 */
export function useFlashcards(): FlashcardContextValue {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}
