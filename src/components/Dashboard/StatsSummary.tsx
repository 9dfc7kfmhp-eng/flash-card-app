import { useFlashcards } from '../../context';
import './StatsSummary.css';

export function StatsSummary() {
  const { flashcards } = useFlashcards();

  // Berechne Statistiken
  const totalCards = flashcards.length;
  const learnedCards = flashcards.filter(
    card => card.statistics.status === 'learned'
  ).length;
  const toLearnCards = totalCards - learnedCards;

  // Berechne Gesamterfolgsquote
  const totalShown = flashcards.reduce(
    (sum, card) => sum + card.statistics.timesShown,
    0
  );
  const totalCorrect = flashcards.reduce(
    (sum, card) => sum + card.statistics.timesCorrect,
    0
  );
  const overallSuccessRate =
    totalShown > 0 ? Math.round((totalCorrect / totalShown) * 100) : 0;

  const stats = [
    {
      label: 'Gesamte Karten',
      value: totalCards,
      icon: '🃏',
      color: '#3b82f6',
    },
    {
      label: 'Gelernte Karten',
      value: learnedCards,
      icon: '✅',
      color: '#10b981',
    },
    {
      label: 'Zu lernen',
      value: toLearnCards,
      icon: '📚',
      color: '#f59e0b',
    },
    {
      label: 'Erfolgsquote',
      value: `${overallSuccessRate}%`,
      icon: '📊',
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="stats-summary">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card"
          style={{ borderColor: stat.color }}
        >
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
