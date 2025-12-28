import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHotkeys } from '../hooks';
import { useSession } from '../context/SessionContext';
import { useFlashcards } from '../context/FlashcardContext';
import { getCardsToReview } from '../utils';
import { Flashcard } from '../components/Learn/Flashcard';
import { SessionSummary } from '../components/Learn/SessionSummary';
import './LearnMode.css';

export function LearnMode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { flashcards } = useFlashcards();
  const {
    activeLearningSession,
    startLearningSession,
    nextCard,
    previousCard,
    flipCard,
    recordAnswer,
    endLearningSession,
  } = useSession();

  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Check if we're in review mode
  const isReviewMode = searchParams.get('mode') === 'review';

  useEffect(() => {
    // Start session if not already started
    if (!activeLearningSession && flashcards.length > 0) {
      let cardIds: string[];

      if (isReviewMode) {
        // Review mode: Only cards with success rate < 70%
        const reviewCards = getCardsToReview();
        cardIds = reviewCards.map(card => card.id);
      } else {
        // Normal mode: All cards
        cardIds = flashcards.map(card => card.id);
      }

      if (cardIds.length > 0) {
        startLearningSession(cardIds);
      }
    }
  }, [flashcards, activeLearningSession, startLearningSession, isReviewMode]);

  // Check if session is completed
  useEffect(() => {
    if (
      activeLearningSession &&
      activeLearningSession.currentIndex >= activeLearningSession.cards.length
    ) {
      setSessionCompleted(true);
    }
  }, [activeLearningSession]);

  const handleCorrect = () => {
    if (!activeLearningSession) return;
    const currentCardId =
      activeLearningSession.cards[activeLearningSession.currentIndex];
    recordAnswer(currentCardId, true);
    nextCard();
  };

  const handleIncorrect = () => {
    if (!activeLearningSession) return;
    const currentCardId =
      activeLearningSession.cards[activeLearningSession.currentIndex];
    recordAnswer(currentCardId, false);
    nextCard();
  };

  const handleSkip = () => {
    nextCard();
  };

  const handleEndSession = () => {
    endLearningSession();
    navigate('/');
  };

  const handleConfirmEnd = () => {
    setShowConfirmEnd(false);
    handleEndSession();
  };

  // Learn Mode Hotkeys
  useHotkeys(
    [
      {
        key: ' ',
        callback: () => {
          if (activeLearningSession && !sessionCompleted) {
            flipCard();
          }
        },
      },
      {
        key: 'ArrowRight',
        callback: () => {
          if (activeLearningSession?.isFlipped && !sessionCompleted) {
            handleCorrect();
          }
        },
      },
      {
        key: 'j',
        callback: () => {
          if (activeLearningSession?.isFlipped && !sessionCompleted) {
            handleCorrect();
          }
        },
      },
      {
        key: 'ArrowLeft',
        callback: () => {
          if (activeLearningSession?.isFlipped && !sessionCompleted) {
            handleIncorrect();
          }
        },
      },
      {
        key: 'f',
        callback: () => {
          if (activeLearningSession?.isFlipped && !sessionCompleted) {
            handleIncorrect();
          }
        },
      },
      {
        key: 'ArrowUp',
        callback: () => {
          if (activeLearningSession && !sessionCompleted) {
            previousCard();
          }
        },
      },
      {
        key: 'ArrowDown',
        callback: () => {
          if (activeLearningSession && !sessionCompleted) {
            handleSkip();
          }
        },
      },
      {
        key: 'Escape',
        callback: () => {
          if (activeLearningSession && !sessionCompleted && !showConfirmEnd) {
            setShowConfirmEnd(true);
          } else if (showConfirmEnd) {
            setShowConfirmEnd(false);
          }
        },
      },
    ],
    !!activeLearningSession // Only enable hotkeys when session is active
  );

  if (flashcards.length === 0) {
    return (
      <div className="learn-mode">
        <div className="empty-learn-state">
          <div className="empty-icon" role="img" aria-label="Notizblock">
            📝
          </div>
          <h2>Keine Karten zum Lernen</h2>
          <p>Erstelle zuerst einige Flashcards in der Kartenverwaltung!</p>
          <button onClick={() => navigate('/cards')} className="btn-primary">
            Zur Kartenverwaltung
          </button>
        </div>
      </div>
    );
  }

  // Check if review mode has no cards to review
  if (isReviewMode && getCardsToReview().length === 0) {
    return (
      <div className="learn-mode">
        <div className="empty-learn-state">
          <div className="empty-icon" role="img" aria-label="Party">
            🎉
          </div>
          <h2>Keine Karten zum Wiederholen!</h2>
          <p>
            Großartig! Du hast alle Karten mit mindestens 70% Erfolgsrate
            gemeistert.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (sessionCompleted && activeLearningSession) {
    return (
      <SessionSummary
        session={activeLearningSession}
        onClose={handleEndSession}
      />
    );
  }

  if (!activeLearningSession) {
    return (
      <div className="learn-mode">
        <div className="loading">Lade Lern-Session...</div>
      </div>
    );
  }

  const currentCardId =
    activeLearningSession.cards[activeLearningSession.currentIndex];
  const currentCard = flashcards.find(card => card.id === currentCardId);
  const progress =
    (activeLearningSession.currentIndex / activeLearningSession.cards.length) *
    100;
  const isFirstCard = activeLearningSession.currentIndex === 0;

  if (!currentCard) {
    return (
      <div className="learn-mode">
        <div className="error">Karte nicht gefunden</div>
      </div>
    );
  }

  return (
    <div className="learn-mode">
      <div className="learn-header">
        <div className="progress-section">
          <div className="progress-text" aria-live="polite" aria-atomic="true">
            {isReviewMode && (
              <span className="review-badge">
                <span role="img" aria-label="Wiederholung">
                  🔄
                </span>{' '}
                Wiederholung
              </span>
            )}
            Karte {activeLearningSession.currentIndex + 1} von{' '}
            {activeLearningSession.cards.length}
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Lernfortschritt"
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setShowConfirmEnd(true)}
            className="btn-end-session"
            aria-label="Lern-Session beenden"
          >
            Session beenden
          </button>
        </div>
      </div>

      <div className="learn-content">
        <Flashcard
          card={currentCard}
          isFlipped={activeLearningSession.isFlipped}
          onFlip={flipCard}
        />

        <div className="answer-section">
          {activeLearningSession.isFlipped ? (
            <div className="answer-buttons">
              <button
                onClick={handleIncorrect}
                className="btn-incorrect"
                aria-label="Antwort als falsch markieren"
              >
                <span role="img" aria-hidden="true">
                  ✗
                </span>{' '}
                Falsch
              </button>
              <button
                onClick={handleCorrect}
                className="btn-correct"
                aria-label="Antwort als richtig markieren"
              >
                <span role="img" aria-hidden="true">
                  ✓
                </span>{' '}
                Richtig
              </button>
            </div>
          ) : (
            <div className="flip-hint" role="status">
              Klicke auf die Karte, um die Antwort zu sehen
            </div>
          )}
        </div>

        <div className="navigation-section">
          <button
            onClick={previousCard}
            disabled={isFirstCard}
            className="btn-nav"
            aria-label="Zur vorherigen Karte"
          >
            ← Zurück
          </button>
          <button
            onClick={handleSkip}
            className="btn-nav btn-skip"
            aria-label="Karte überspringen"
          >
            Überspringen →
          </button>
        </div>
      </div>

      {showConfirmEnd && (
        <div
          className="modal-backdrop"
          onClick={() => setShowConfirmEnd(false)}
          role="presentation"
        >
          <div
            className="confirm-modal"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
          >
            <h3 id="confirm-modal-title">Session wirklich beenden?</h3>
            <p id="confirm-modal-desc">
              Dein Fortschritt wird gespeichert, aber die Session wird beendet.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="btn-cancel"
                aria-label="Abbrechen und Session fortsetzen"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmEnd}
                className="btn-confirm"
                aria-label="Session beenden bestätigen"
              >
                Beenden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
