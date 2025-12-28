import { useMemo } from 'react';
import { loadAppData } from '../../utils';
import './LearningStreak.css';

export function LearningStreak() {
  // Verwende useMemo für teure Streak-Berechnung
  const { streak, longestStreak } = useMemo(() => {
    const appData = loadAppData();
    const sessions = appData.learningSessions;

    if (sessions.length === 0) {
      return { streak: 0, longestStreak: 0 };
    }

    // Sortiere Sessions nach Datum (neueste zuerst)
    const sortedSessions = [...sessions].sort((a, b) => b.date - a.date);

    // Berechne aktuellen Streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const oneDayMs = 24 * 60 * 60 * 1000;
    let checkDate = todayTimestamp;

    // Prüfe ob heute schon gelernt wurde
    const hasSessionToday = sortedSessions.some(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === todayTimestamp;
    });

    if (!hasSessionToday) {
      // Wenn heute noch nicht gelernt wurde, prüfe ab gestern
      checkDate = todayTimestamp - oneDayMs;
    }

    // Zähle aufeinanderfolgende Tage
    const uniqueDates = new Set(
      sortedSessions.map(session => {
        const d = new Date(session.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    while (uniqueDates.has(checkDate)) {
      currentStreak++;
      checkDate -= oneDayMs;
    }

    // Berechne längsten Streak
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate: number | null = null;

    Array.from(uniqueDates)
      .sort((a, b) => b - a)
      .forEach(date => {
        if (lastDate === null || lastDate - date === oneDayMs) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
        lastDate = date;
      });

    return {
      streak: currentStreak,
      longestStreak: Math.max(maxStreak, currentStreak),
    };
  }, []); // Leeres Dependency Array - berechnet nur einmal beim Mount

  return (
    <div className="learning-streak">
      <div className="streak-main">
        <div className="streak-icon">🔥</div>
        <div className="streak-content">
          <div className="streak-value">{streak} Tage</div>
          <div className="streak-label">Aktueller Streak</div>
        </div>
      </div>
      {longestStreak > 0 && (
        <div className="streak-info">
          <span className="streak-badge">
            🏆 Längster Streak: {longestStreak} Tage
          </span>
        </div>
      )}
      {streak === 0 && (
        <p className="streak-message">
          Starte noch heute eine Lern-Session und baue deinen Streak auf! 💪
        </p>
      )}
    </div>
  );
}
