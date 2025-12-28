import { useEffect } from 'react';
import type { Flashcard } from '../../types';
import './DeleteConfirmation.css';

interface DeleteConfirmationProps {
  card: Flashcard;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({
  card,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="delete-modal">
        <div className="delete-icon">⚠️</div>

        <h2>Karte wirklich löschen?</h2>

        <div className="card-preview">
          <div className="preview-row">
            <span className="preview-label">Spanisch:</span>
            <span className="preview-value">{card.spanish}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">Englisch:</span>
            <span className="preview-value">{card.english}</span>
          </div>
        </div>

        <p className="warning-text">
          Diese Aktion kann nicht rückgängig gemacht werden. Alle
          Lernfortschritte für diese Karte gehen verloren.
        </p>

        <div className="delete-actions">
          <button onClick={onCancel} className="btn-cancel-delete">
            Abbrechen
          </button>
          <button onClick={onConfirm} className="btn-confirm-delete">
            🗑️ Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
