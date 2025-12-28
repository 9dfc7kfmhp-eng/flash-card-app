import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFlashcards } from '../context';
import { generateQuiz, saveQuizSession } from '../utils';
import { useHotkeys } from '../hooks';
import type { QuizQuestion } from '../types/session';
import './QuizFillBlank.css';

interface LocationState {
  questionCount?: number;
}

export function QuizFillBlank() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Initialize quiz
  useEffect(() => {
    const state = location.state as LocationState;
    const questionCount = state?.questionCount || 10;

    if (flashcards.length === 0) {
      navigate('/');
      return;
    }

    const questions = generateQuiz('fill-in-blank', flashcards, questionCount);
    setQuiz(questions);
  }, [flashcards, location.state, navigate]);

  const currentQuestion = quiz[currentIndex];

  const handleAnswerClick = (answer: string) => {
    if (isAnswered || showingFeedback) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowingFeedback(true);

    // Update question with user answer
    const updatedQuiz = [...quiz];
    updatedQuiz[currentIndex] = {
      ...updatedQuiz[currentIndex],
      userAnswer: answer,
      isCorrect: answer === currentQuestion.correctAnswer,
    };
    setQuiz(updatedQuiz);

    // Auto-advance after 1 second
    setTimeout(() => {
      setShowingFeedback(false);
      if (currentIndex < quiz.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Quiz completed - save session and update statistics
        saveQuizSession('fill-in-blank', updatedQuiz);
        setQuizCompleted(true);
      }
    }, 1000);
  };

  // Hotkeys: 1-6 for answers, Esc to quit
  useHotkeys(
    [
      {
        key: '1',
        callback: () => {
          if (currentQuestion && !isAnswered && currentQuestion.options?.[0]) {
            handleAnswerClick(currentQuestion.options[0]);
          }
        },
      },
      {
        key: '2',
        callback: () => {
          if (currentQuestion && !isAnswered && currentQuestion.options?.[1]) {
            handleAnswerClick(currentQuestion.options[1]);
          }
        },
      },
      {
        key: '3',
        callback: () => {
          if (currentQuestion && !isAnswered && currentQuestion.options?.[2]) {
            handleAnswerClick(currentQuestion.options[2]);
          }
        },
      },
      {
        key: '4',
        callback: () => {
          if (currentQuestion && !isAnswered && currentQuestion.options?.[3]) {
            handleAnswerClick(currentQuestion.options[3]);
          }
        },
      },
      {
        key: '5',
        callback: () => {
          if (currentQuestion && !isAnswered && currentQuestion.options?.[4]) {
            handleAnswerClick(currentQuestion.options[4]);
          }
        },
      },
      {
        key: '6',
        callback: () => {
          if (currentQuestion && !isAnswered && currentQuestion.options?.[5]) {
            handleAnswerClick(currentQuestion.options[5]);
          }
        },
      },
      {
        key: 'Escape',
        callback: () => {
          if (confirm('Quiz wirklich beenden?')) {
            navigate('/');
          }
        },
      },
    ],
    !quizCompleted
  );

  const handleRetakeQuiz = () => {
    const state = location.state as LocationState;
    const questionCount = state?.questionCount || 10;
    const questions = generateQuiz('fill-in-blank', flashcards, questionCount);
    setQuiz(questions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowingFeedback(false);
    setQuizCompleted(false);
  };

  const handleNewQuiz = () => {
    navigate('/');
  };

  const getWordClass = (word: string) => {
    if (!isAnswered) return '';

    const isCorrect = word === currentQuestion.correctAnswer;
    const isSelected = word === selectedAnswer;

    if (isSelected && isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'wrong';
    if (!isSelected && isCorrect) return 'show-correct';

    return '';
  };

  if (quiz.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="spinner"></div>
          <p>Quiz wird geladen...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const correctCount = quiz.filter(q => q.isCorrect).length;
    const totalCount = quiz.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    return (
      <div className="quiz-page">
        <div className="quiz-results">
          <div className="results-header">
            <div className="results-icon">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
            </div>
            <h1>Quiz abgeschlossen!</h1>
            <p className="results-subtitle">Hier ist dein Ergebnis</p>
          </div>

          <div className="results-score">
            <div className="score-circle">
              <div className="score-percentage">{percentage}%</div>
              <div className="score-fraction">
                {correctCount} / {totalCount}
              </div>
            </div>
          </div>

          <div className="results-breakdown">
            <div className="breakdown-item correct">
              <span className="breakdown-icon">✓</span>
              <span className="breakdown-label">Richtig</span>
              <span className="breakdown-value">{correctCount}</span>
            </div>
            <div className="breakdown-item wrong">
              <span className="breakdown-icon">✕</span>
              <span className="breakdown-label">Falsch</span>
              <span className="breakdown-value">
                {totalCount - correctCount}
              </span>
            </div>
          </div>

          <div className="results-actions">
            <button onClick={handleRetakeQuiz} className="btn-secondary">
              Quiz wiederholen
            </button>
            <button onClick={handleNewQuiz} className="btn-primary">
              Zurück zum Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Lückentext Quiz</h1>
          <div className="quiz-progress">
            <span>
              Frage {currentIndex + 1} von {quiz.length}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentIndex + 1) / quiz.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="quiz-question-card">
          <div className="question-label">Fülle die Lücke:</div>
          <div className="question-display">
            <span className="question-word">{currentQuestion.question}</span>
            <span className="question-arrow">→</span>
            <div className="question-blank">
              {selectedAnswer || '___________'}
            </div>
          </div>
        </div>

        <div className="word-options">
          <div className="words-label">Wähle das richtige Wort:</div>
          <div className="words-grid">
            {currentQuestion.options!.map((option: string, index: number) => (
              <button
                key={index}
                className={`word-button ${getWordClass(option)}`}
                onClick={() => handleAnswerClick(option)}
                disabled={isAnswered}
              >
                <span className="word-number">{index + 1}</span>
                <span className="word-text">{option}</span>
                {isAnswered && option === currentQuestion.correctAnswer && (
                  <span className="word-icon">✓</span>
                )}
                {isAnswered &&
                  option === selectedAnswer &&
                  option !== currentQuestion.correctAnswer && (
                    <span className="word-icon">✕</span>
                  )}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-footer">
          <button onClick={() => navigate('/')} className="btn-quit">
            Quiz beenden
          </button>
          <div className="quiz-hint">
            Tipp: Nutze Tasten 1-{currentQuestion.options?.length || 0} für
            schnelle Antworten
          </div>
        </div>
      </div>
    </div>
  );
}
