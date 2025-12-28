import { useState } from 'react';
import { useFlashcards } from '../../context/FlashcardContext';
import { isDuplicateCard } from '../../utils/flashcardService';
import './CreateCardForm.css';

interface ValidationErrors {
  spanish?: string;
  english?: string;
  notes?: string;
}

export function CreateCardForm() {
  const { addFlashcard } = useFlashcards();
  const [spanish, setSpanish] = useState('');
  const [english, setEnglish] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    spanish: false,
    english: false,
    notes: false,
  });

  const validateField = (
    field: 'spanish' | 'english' | 'notes',
    value: string
  ): string | undefined => {
    const trimmed = value.trim();

    if (field === 'spanish' || field === 'english') {
      if (!trimmed) {
        return 'Dieses Feld ist erforderlich';
      }
      if (trimmed.length < 2) {
        return 'Mindestens 2 Zeichen erforderlich';
      }
      if (trimmed.length > 100) {
        return 'Maximal 100 Zeichen erlaubt';
      }
      if (field === 'spanish' && isDuplicateCard(trimmed)) {
        return 'Diese Karte existiert bereits';
      }
    }

    if (field === 'notes' && trimmed.length > 500) {
      return 'Maximal 500 Zeichen erlaubt';
    }

    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: ValidationErrors = {
      spanish: validateField('spanish', spanish),
      english: validateField('english', english),
      notes: validateField('notes', notes),
    };

    setErrors(newErrors);
    return !newErrors.spanish && !newErrors.english && !newErrors.notes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ spanish: true, english: true, notes: true });

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate async operation (in a real app, this might be an API call)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create card
      addFlashcard({
        spanish: spanish.trim(),
        english: english.trim(),
        notes: notes.trim() || undefined,
      });

      // Reset form
      setSpanish('');
      setEnglish('');
      setNotes('');
      setErrors({});
      setTouched({ spanish: false, english: false, notes: false });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating card:', error);
      setErrors({ spanish: 'Fehler beim Erstellen der Karte' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: 'spanish' | 'english' | 'notes') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value =
      field === 'spanish' ? spanish : field === 'english' ? english : notes;
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (
    field: 'spanish' | 'english' | 'notes',
    value: string
  ) => {
    // Update value
    if (field === 'spanish') setSpanish(value);
    else if (field === 'english') setEnglish(value);
    else setNotes(value);

    // Clear error when user starts typing
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  return (
    <div className="create-card-form-container">
      <h2>Neue Karte erstellen</h2>

      <form onSubmit={handleSubmit} className="create-card-form" noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="spanish">
              Spanisch <span className="required">*</span>
            </label>
            <input
              type="text"
              id="spanish"
              value={spanish}
              onChange={e => handleChange('spanish', e.target.value)}
              onBlur={() => handleBlur('spanish')}
              placeholder="z.B. hola"
              className={errors.spanish && touched.spanish ? 'input-error' : ''}
              aria-invalid={!!(errors.spanish && touched.spanish)}
              aria-describedby={
                errors.spanish && touched.spanish ? 'spanish-error' : undefined
              }
              disabled={isSubmitting}
              required
            />
            {errors.spanish && touched.spanish && (
              <span id="spanish-error" className="error-message" role="alert">
                <span role="img" aria-label="Fehler">
                  ⚠️
                </span>{' '}
                {errors.spanish}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="english">
              Englisch <span className="required">*</span>
            </label>
            <input
              type="text"
              id="english"
              value={english}
              onChange={e => handleChange('english', e.target.value)}
              onBlur={() => handleBlur('english')}
              placeholder="z.B. hello"
              className={errors.english && touched.english ? 'input-error' : ''}
              aria-invalid={!!(errors.english && touched.english)}
              aria-describedby={
                errors.english && touched.english ? 'english-error' : undefined
              }
              disabled={isSubmitting}
              required
            />
            {errors.english && touched.english && (
              <span id="english-error" className="error-message" role="alert">
                <span role="img" aria-label="Fehler">
                  ⚠️
                </span>{' '}
                {errors.english}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">
            Notizen (optional)
            <span className="char-count">{notes.length}/500</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => handleChange('notes', e.target.value)}
            onBlur={() => handleBlur('notes')}
            placeholder="Zusätzliche Informationen, Kontext, Beispiele..."
            rows={3}
            className={errors.notes && touched.notes ? 'input-error' : ''}
            aria-invalid={!!(errors.notes && touched.notes)}
            aria-describedby={
              errors.notes && touched.notes ? 'notes-error' : undefined
            }
            disabled={isSubmitting}
            maxLength={500}
          />
          {errors.notes && touched.notes && (
            <span id="notes-error" className="error-message" role="alert">
              <span role="img" aria-label="Fehler">
                ⚠️
              </span>{' '}
              {errors.notes}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn-create"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true"></span> Erstelle...
            </>
          ) : (
            <>
              <span role="img" aria-hidden="true">
                ➕
              </span>{' '}
              Karte erstellen
            </>
          )}
        </button>
      </form>

      {showSuccess && (
        <div className="success-toast" role="status" aria-live="polite">
          <span role="img" aria-label="Erfolgreich">
            ✅
          </span>{' '}
          Karte erfolgreich erstellt!
        </div>
      )}
    </div>
  );
}
