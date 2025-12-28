import { useMemo, useState } from 'react';
import { useFlashcards } from '../../context/FlashcardContext';
import { useSession } from '../../context/SessionContext';
import type { ActiveLearningSession } from '../../types';
import './SessionSummary.css';

interface SessionSummaryProps {
  session: ActiveLearningSession;
  onClose: () => void;
}

export function SessionSummary({ session, onClose }: SessionSummaryProps) {
  const { flashcards } = useFlashcards();
  const { startLearningSession } = useSession();

  // Calculate duration once at component mount
  const [endTime] = useState(() => Date.now());

  const stats = useMemo(() => {
    const correctCount = session.correctInSession.length;
    const incorrectCount = session.incorrectInSession.length;
    const totalAnswered = correctCount + incorrectCount;
    const successRate =
      totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    const duration = endTime - session.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    return {
      correctCount,
      incorrectCount,
      totalAnswered,
      successRate,
      duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    };
  }, [session, endTime]);

  const incorrectCards = useMemo(() => {
    return flashcards.filter(card =>
      session.incorrectInSession.includes(card.id)
    );
  }, [session.incorrectInSession, flashcards]);

  const handleRepeatIncorrect = () => {
    if (session.incorrectInSession.length > 0) {
      onClose();
      startLearningSession(session.incorrectInSession);
    }
  };

  return (
    <div className="session-summary">
      <div className="summary-container">
        <div className="summary-header">
          <div className="completion-icon">🎉</div>
          <h1>Session abgeschlossen!</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-success">
            <div className="stat-icon">✓</div>
            <div className="stat-value">{stats.correctCount}</div>
            <div className="stat-label">Richtig</div>
          </div>

          <div className="stat-card stat-error">
            <div className="stat-icon">✗</div>
            <div className="stat-value">{stats.incorrectCount}</div>
            <div className="stat-label">Falsch</div>
          </div>

          <div className="stat-card stat-rate">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.successRate}%</div>
            <div className="stat-label">Erfolgsquote</div>
          </div>

          <div className="stat-card stat-time">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{stats.duration}</div>
            <div className="stat-label">Dauer</div>
          </div>
        </div>

        {incorrectCards.length > 0 && (
          <div className="incorrect-section">
            <h2>Falsch beantwortete Karten</h2>
            <div className="incorrect-cards-list">
              {incorrectCards.map(card => (
                <div key={card.id} className="incorrect-card-item">
                  <div className="incorrect-card-words">
                    <span className="word-spanish">{card.spanish}</span>
                    <span className="word-separator">→</span>
                    <span className="word-english">{card.english}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="summary-actions">
          <button onClick={onClose} className="btn-back">
            Zurück zum Dashboard
          </button>
          {incorrectCards.length > 0 && (
            <button onClick={handleRepeatIncorrect} className="btn-repeat">
              🔄 Falsche Karten wiederholen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
