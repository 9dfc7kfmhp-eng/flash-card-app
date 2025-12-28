import { useState, useEffect } from 'react';
import { useFlashcards } from '../../context/FlashcardContext';
import type { Flashcard } from '../../types';
import './EditCardModal.css';

interface EditCardModalProps {
  card: Flashcard;
  onClose: () => void;
}

export function EditCardModal({ card, onClose }: EditCardModalProps) {
  const { updateFlashcard } = useFlashcards();
  const [spanish, setSpanish] = useState(card.spanish);
  const [english, setEnglish] = useState(card.english);
  const [notes, setNotes] = useState(card.notes || '');

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const spanishTrimmed = spanish.trim();
    const englishTrimmed = english.trim();

    if (!spanishTrimmed || !englishTrimmed) {
      return;
    }

    updateFlashcard(card.id, {
      spanish: spanishTrimmed,
      english: englishTrimmed,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Karte bearbeiten</h2>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="edit-spanish">
              Spanisch <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-spanish"
              value={spanish}
              onChange={e => setSpanish(e.target.value)}
              placeholder="z.B. hola"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-english">
              Englisch <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-english"
              value={english}
              onChange={e => setEnglish(e.target.value)}
              placeholder="z.B. hello"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-notes">Notizen (optional)</label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Zusätzliche Informationen, Kontext, Beispiele..."
              rows={3}
            />
          </div>

          <div className="card-meta">
            <span>
              Erstellt: {new Date(card.createdAt).toLocaleDateString('de-DE')}
            </span>
            {card.updatedAt !== card.createdAt && (
              <span>
                Bearbeitet:{' '}
                {new Date(card.updatedAt).toLocaleDateString('de-DE')}
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Abbrechen
            </button>
            <button type="submit" className="btn-save">
              ✓ Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
