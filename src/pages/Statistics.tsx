import { useState, lazy, Suspense } from 'react';
import { useFlashcards } from '../context';
import { getAllQuizSessions, getAverageQuizScore } from '../utils';
import './Statistics.css';

// Lazy Load Chart-Komponenten (Recharts ist groß: ~250KB)
const CardStats = lazy(() =>
  import('../components/Statistics/CardStats').then(module => ({
    default: module.CardStats,
  }))
);
const ActivityStats = lazy(() =>
  import('../components/Statistics/ActivityStats').then(module => ({
    default: module.ActivityStats,
  }))
);
const QuizStats = lazy(() =>
  import('../components/Statistics/QuizStats').then(module => ({
    default: module.QuizStats,
  }))
);

type TabType = 'overview' | 'cards' | 'activity' | 'quizzes';

export function Statistics() {
  const { flashcards } = useFlashcards();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const quizSessions = getAllQuizSessions();
  const avgScoreOverall = getAverageQuizScore();
  const avgScoreMC = getAverageQuizScore('multiple-choice');
  const avgScoreFB = getAverageQuizScore('fill-in-blank');

  // Calculate statistics
  const totalCards = flashcards.length;
  const newCards = flashcards.filter(c => c.statistics.timesShown === 0).length;
  const learningCards = flashcards.filter(
    c => c.statistics.timesShown > 0 && c.statistics.successRate < 70
  ).length;
  const learnedCards = flashcards.filter(
    c => c.statistics.successRate >= 70 && c.statistics.timesShown >= 3
  ).length;

  const totalReviews = flashcards.reduce(
    (sum, card) => sum + card.statistics.timesShown,
    0
  );
  const totalCorrect = flashcards.reduce(
    (sum, card) => sum + card.statistics.timesCorrect,
    0
  );
  const overallSuccessRate =
    totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const tabs = [
    { id: 'overview' as TabType, label: 'Übersicht', icon: '📊' },
    { id: 'cards' as TabType, label: 'Pro-Karte', icon: '📇' },
    { id: 'activity' as TabType, label: 'Aktivität', icon: '📈' },
    { id: 'quizzes' as TabType, label: 'Quizze', icon: '🎯' },
  ];

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>Statistiken</h1>
        <p>Detaillierte Übersicht über deinen Lernfortschritt</p>
      </div>

      <div className="statistics-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="statistics-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-value">{totalCards}</div>
                <div className="stat-label">Gesamte Karten</div>
              </div>

              <div className="stat-card new">
                <div className="stat-icon">✨</div>
                <div className="stat-value">{newCards}</div>
                <div className="stat-label">Neue Karten</div>
              </div>

              <div className="stat-card learning">
                <div className="stat-icon">📖</div>
                <div className="stat-value">{learningCards}</div>
                <div className="stat-label">In Bearbeitung</div>
              </div>

              <div className="stat-card learned">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{learnedCards}</div>
                <div className="stat-label">Gelernt</div>
              </div>

              <div className="stat-card wide">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{totalReviews}</div>
                <div className="stat-label">Gesamt Wiederholungen</div>
              </div>

              <div className="stat-card wide success">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{overallSuccessRate}%</div>
                <div className="stat-label">Erfolgsquote</div>
              </div>

              <div className="stat-card quiz">
                <div className="stat-icon">🎮</div>
                <div className="stat-value">{quizSessions.length}</div>
                <div className="stat-label">Quizze Abgeschlossen</div>
              </div>

              <div className="stat-card quiz">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{avgScoreOverall}%</div>
                <div className="stat-label">Ø Quiz-Score</div>
              </div>
            </div>

            <div className="quiz-breakdown">
              <h2>Quiz-Statistiken</h2>
              <div className="quiz-stats-grid">
                <div className="quiz-stat-card">
                  <div className="quiz-type">Multiple Choice</div>
                  <div className="quiz-score">{avgScoreMC}%</div>
                  <div className="quiz-count">
                    {
                      quizSessions.filter(s => s.type === 'multiple-choice')
                        .length
                    }{' '}
                    Quizze
                  </div>
                </div>
                <div className="quiz-stat-card">
                  <div className="quiz-type">Lückentext</div>
                  <div className="quiz-score">{avgScoreFB}%</div>
                  <div className="quiz-count">
                    {
                      quizSessions.filter(s => s.type === 'fill-in-blank')
                        .length
                    }{' '}
                    Quizze
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="cards-tab">
            <Suspense
              fallback={
                <div className="loading-fallback">Lade Statistiken...</div>
              }
            >
              <CardStats cards={flashcards} />
            </Suspense>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <Suspense
              fallback={
                <div className="loading-fallback">Lade Aktivitätsdaten...</div>
              }
            >
              <ActivityStats />
            </Suspense>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="quizzes-tab">
            <Suspense
              fallback={
                <div className="loading-fallback">Lade Quiz-Statistiken...</div>
              }
            >
              <QuizStats />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
