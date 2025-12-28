import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcards } from '../../context';
import { getCardsToReview } from '../../utils';
import { QuizTypeModal } from '../Quiz';
import './QuickActions.css';

export function QuickActions() {
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();
  const [showQuizModal, setShowQuizModal] = useState(false);

  const cardsToReview = getCardsToReview();
  const hasCards = flashcards.length > 0;
  const hasCardsToReview = cardsToReview.length > 0;

  const actions = [
    {
      title: 'Neue Karten lernen',
      description: 'Starte eine Lern-Session mit allen Karten',
      icon: '📚',
      color: '#3b82f6',
      onClick: () => navigate('/learn'),
      disabled: !hasCards,
    },
    {
      title: 'Wiederholung',
      description: `${cardsToReview.length} Karten zum Wiederholen`,
      icon: '🔄',
      color: '#f59e0b',
      onClick: () => navigate('/learn?mode=review'),
      disabled: !hasCardsToReview,
    },
    {
      title: 'Quiz starten',
      description: 'Teste dein Wissen im Quiz-Modus',
      icon: '🎯',
      color: '#8b5cf6',
      onClick: () => setShowQuizModal(true),
      disabled: !hasCards,
    },
    {
      title: 'Karten verwalten',
      description: 'Erstelle und bearbeite deine Flashcards',
      icon: '⚙️',
      color: '#10b981',
      onClick: () => navigate('/cards'),
      disabled: false,
    },
  ];

  return (
    <div className="quick-actions">
      <h2 className="section-title">Schnellzugriff</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-button ${action.disabled ? 'disabled' : ''}`}
            onClick={action.onClick}
            disabled={action.disabled}
            style={
              {
                '--action-color': action.color,
              } as React.CSSProperties
            }
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {showQuizModal && (
        <QuizTypeModal onClose={() => setShowQuizModal(false)} />
      )}
    </div>
  );
}
