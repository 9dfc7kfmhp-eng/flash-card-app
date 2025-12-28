export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: string;
          spanish: string;
          english: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          times_shown: number;
          times_correct: number;
          times_incorrect: number;
          last_reviewed: string | null;
          success_rate: number;
          status: 'new' | 'learning' | 'learned';
          consecutive_correct: number;
        };
        Insert: {
          id?: string;
          spanish: string;
          english: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          times_shown?: number;
          times_correct?: number;
          times_incorrect?: number;
          last_reviewed?: string | null;
          success_rate?: number;
          status?: 'new' | 'learning' | 'learned';
          consecutive_correct?: number;
        };
        Update: {
          id?: string;
          spanish?: string;
          english?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          times_shown?: number;
          times_correct?: number;
          times_incorrect?: number;
          last_reviewed?: string | null;
          success_rate?: number;
          status?: 'new' | 'learning' | 'learned';
          consecutive_correct?: number;
        };
      };
      learning_sessions: {
        Row: {
          id: string;
          date: string;
          cards_reviewed: string[];
          correct_cards: string[];
          incorrect_cards: string[];
          duration: number;
        };
        Insert: {
          id?: string;
          date?: string;
          cards_reviewed: string[];
          correct_cards: string[];
          incorrect_cards: string[];
          duration: number;
        };
        Update: {
          id?: string;
          date?: string;
          cards_reviewed?: string[];
          correct_cards?: string[];
          incorrect_cards?: string[];
          duration?: number;
        };
      };
      quiz_sessions: {
        Row: {
          id: string;
          type: 'multiple-choice' | 'fill-in-blank';
          date: string;
          questions: Json;
          score: number;
          completed: boolean;
        };
        Insert: {
          id?: string;
          type: 'multiple-choice' | 'fill-in-blank';
          date?: string;
          questions: Json;
          score: number;
          completed?: boolean;
        };
        Update: {
          id?: string;
          type?: 'multiple-choice' | 'fill-in-blank';
          date?: string;
          questions?: Json;
          score?: number;
          completed?: boolean;
        };
      };
    };
  };
}
