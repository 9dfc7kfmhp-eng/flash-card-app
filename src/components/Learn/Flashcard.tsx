import type { Flashcard as FlashcardType } from '../../types';
import './Flashcard.css';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className="flashcard-container"
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? `Kartenrückseite: ${card.english}. Klicken oder Enter drücken zum Umdrehen.`
          : `Kartenvorderseite: ${card.spanish}. Klicken oder Enter drücken zum Umdrehen.`
      }
      aria-pressed={isFlipped}
    >
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front" aria-hidden={isFlipped}>
          <div className="card-language-label">Spanisch</div>
          <div className="card-word">{card.spanish}</div>
          <div className="card-hint">Klicken zum Umdrehen</div>
        </div>

        <div className="flashcard-back" aria-hidden={!isFlipped}>
          <div className="card-language-label">Englisch</div>
          <div className="card-word">{card.english}</div>
          {card.notes && (
            <div className="card-notes">
              <div className="notes-label">Notizen:</div>
              <div className="notes-content">{card.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
