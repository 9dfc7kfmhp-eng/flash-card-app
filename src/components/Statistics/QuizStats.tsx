import { useState } from 'react';
import { getAllQuizSessions, getAverageQuizScore } from '../../utils';
import './QuizStats.css';

export function QuizStats() {
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);

  const quizSessions = getAllQuizSessions();
  const avgScoreOverall = getAverageQuizScore();
  const avgScoreMC = getAverageQuizScore('multiple-choice');
  const avgScoreFB = getAverageQuizScore('fill-in-blank');

  // Sortiere Sessions nach Datum (neueste zuerst)
  const sortedSessions = [...quizSessions].sort((a, b) => b.date - a.date);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQuizTypeLabel = (
    type: 'multiple-choice' | 'fill-in-blank'
  ): string => {
    return type === 'multiple-choice' ? 'Multiple Choice' : 'Lückentext';
  };

  const toggleQuizDetails = (quizId: string) => {
    setExpandedQuizId(expandedQuizId === quizId ? null : quizId);
  };

  const getScoreClass = (score: number): string => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  if (quizSessions.length === 0) {
    return (
      <div className="quiz-stats-empty">
        <div className="empty-icon">🎯</div>
        <h3>Noch keine Quizze absolviert</h3>
        <p>Starte dein erstes Quiz, um hier Statistiken zu sehen!</p>
      </div>
    );
  }

  return (
    <div className="quiz-stats-container">
      {/* Overview Cards */}
      <div className="quiz-overview-cards">
        <div className="quiz-overview-card overall">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <div className="card-value">{avgScoreOverall}%</div>
            <div className="card-label">Durchschnittlicher Score</div>
          </div>
        </div>

        <div className="quiz-overview-card mc">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <div className="card-value">{avgScoreMC}%</div>
            <div className="card-label">Multiple Choice</div>
          </div>
        </div>

        <div className="quiz-overview-card fb">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <div className="card-value">{avgScoreFB}%</div>
            <div className="card-label">Lückentext</div>
          </div>
        </div>

        <div className="quiz-overview-card total">
          <div className="card-icon">🎮</div>
          <div className="card-content">
            <div className="card-value">{quizSessions.length}</div>
            <div className="card-label">Absolvierte Quizze</div>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="quiz-history-section">
        <h2>Quiz-Historie</h2>
        <div className="quiz-history-list">
          {sortedSessions.map(session => (
            <div
              key={session.id}
              className={`quiz-history-item ${expandedQuizId === session.id ? 'expanded' : ''}`}
            >
              <div
                className="quiz-summary"
                onClick={() => toggleQuizDetails(session.id)}
              >
                <div className="quiz-info">
                  <div className="quiz-type-badge">
                    {getQuizTypeLabel(session.type)}
                  </div>
                  <div className="quiz-date">{formatDate(session.date)}</div>
                </div>

                <div className="quiz-stats-inline">
                  <div className={`quiz-score ${getScoreClass(session.score)}`}>
                    {session.score}%
                  </div>
                  <div className="quiz-questions">
                    {session.questions.length} Fragen
                  </div>
                </div>

                <div className="expand-icon">
                  {expandedQuizId === session.id ? '▼' : '▶'}
                </div>
              </div>

              {expandedQuizId === session.id && (
                <div className="quiz-details">
                  <h4>Fragen & Antworten</h4>
                  <div className="questions-list">
                    {session.questions.map((question, index: number) => (
                      <div
                        key={index}
                        className={`question-item ${question.wasCorrect ? 'correct' : 'incorrect'}`}
                      >
                        <div className="question-header">
                          <span className="question-number">
                            Frage {index + 1}
                          </span>
                          <span
                            className={`question-result ${question.wasCorrect ? 'correct' : 'incorrect'}`}
                          >
                            {question.wasCorrect ? '✓ Richtig' : '✗ Falsch'}
                          </span>
                        </div>
                        <div className="question-content">
                          <div className="answer-row">
                            <span className="answer-label">Deine Antwort:</span>
                            <span
                              className={`answer-value ${question.wasCorrect ? 'correct' : 'incorrect'}`}
                            >
                              {question.userAnswer}
                            </span>
                          </div>
                          {!question.wasCorrect && (
                            <div className="answer-row">
                              <span className="answer-label">
                                Richtig wäre:
                              </span>
                              <span className="answer-value correct">
                                {question.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
