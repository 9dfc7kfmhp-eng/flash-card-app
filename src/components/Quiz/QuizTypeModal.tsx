import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from '../../hooks';
import type { QuizType } from '../../types/session';
import './QuizTypeModal.css';

interface QuizTypeModalProps {
  onClose: () => void;
}

interface QuizTypeOption {
  mode: QuizType;
  title: string;
  description: string;
  icon: string;
  route: string;
}

const quizTypes: QuizTypeOption[] = [
  {
    mode: 'multiple-choice',
    title: 'Multiple Choice',
    description:
      'Wähle die richtige englische Übersetzung aus 4 Antwortmöglichkeiten. Perfekt für schnelles Vokabeln-Training.',
    icon: '✓',
    route: '/quiz/multiple-choice',
  },
  {
    mode: 'fill-in-blank',
    title: 'Lückentext',
    description:
      'Fülle die Lücke mit dem richtigen englischen Wort aus. Ideal für intensives Lernen und Gedächtnistraining.',
    icon: '⌨',
    route: '/quiz/fill-blank',
  },
];

const questionCounts = [10, 20, 30];

export function QuizTypeModal({ onClose }: QuizTypeModalProps) {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<QuizType>('multiple-choice');
  const [questionCount, setQuestionCount] = useState(10);

  // Close on Escape
  useHotkeys([
    {
      key: 'Escape',
      callback: onClose,
    },
  ]);

  const handleStart = () => {
    const selectedQuiz = quizTypes.find(q => q.mode === selectedMode);
    if (selectedQuiz) {
      // Navigate with question count as state
      navigate(selectedQuiz.route, { state: { questionCount } });
      onClose();
    }
  };

  return (
    <div className="quiz-type-backdrop" onClick={onClose}>
      <div className="quiz-type-modal" onClick={e => e.stopPropagation()}>
        <div className="quiz-type-header">
          <h2>🎯 Quiz-Modus wählen</h2>
          <button onClick={onClose} className="quiz-type-close">
            ✕
          </button>
        </div>

        <div className="quiz-type-content">
          <div className="quiz-type-grid">
            {quizTypes.map(quiz => (
              <button
                key={quiz.mode}
                className={`quiz-type-card ${selectedMode === quiz.mode ? 'selected' : ''}`}
                onClick={() => setSelectedMode(quiz.mode)}
              >
                <div className="quiz-type-icon">{quiz.icon}</div>
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                {selectedMode === quiz.mode && (
                  <div className="quiz-type-checkmark">✓</div>
                )}
              </button>
            ))}
          </div>

          <div className="quiz-settings">
            <h3>Anzahl der Fragen</h3>
            <div className="question-count-selector">
              {questionCounts.map(count => (
                <button
                  key={count}
                  className={`count-option ${questionCount === count ? 'selected' : ''}`}
                  onClick={() => setQuestionCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="quiz-type-footer">
          <button onClick={onClose} className="btn-cancel">
            Abbrechen
          </button>
          <button onClick={handleStart} className="btn-start-quiz">
            Quiz starten
          </button>
        </div>
      </div>
    </div>
  );
}
