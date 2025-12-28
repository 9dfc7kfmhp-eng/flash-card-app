import { useState, useEffect } from 'react';
import {
  migrateToSupabase,
  hasLocalStorageData,
  getLocalStorageStats,
  type MigrationProgress,
  type MigrationResult,
} from '../services/migrationService';
import { isUsingSupabase } from '../services/storageAdapter';

/**
 * MigrationPanel Component
 * Zeigt UI für LocalStorage → Supabase Migration
 */
export function MigrationPanel() {
  const [hasData, setHasData] = useState(false);
  const [stats, setStats] = useState({
    flashcards: 0,
    learningSessions: 0,
    quizSessions: 0,
  });
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [result, setResult] = useState<MigrationResult | null>(null);

  // Prüfe ob Supabase aktiv ist
  const supabaseEnabled = isUsingSupabase();

  useEffect(() => {
    if (supabaseEnabled) {
      setHasData(hasLocalStorageData());
      setStats(getLocalStorageStats());
    }
  }, [supabaseEnabled]);

  const handleMigrate = async () => {
    setIsMigrating(true);
    setResult(null);

    const migrationResult = await migrateToSupabase(progress => {
      setProgress(progress);
    });

    setResult(migrationResult);
    setIsMigrating(false);

    // Aktualisiere Statistiken nach Migration
    setHasData(hasLocalStorageData());
    setStats(getLocalStorageStats());
  };

  // Zeige Panel nur wenn Supabase aktiv ist
  if (!supabaseEnabled) {
    return null;
  }

  // Zeige nichts wenn keine Daten vorhanden
  if (!hasData && !result) {
    return null;
  }

  return (
    <div className="migration-panel">
      <div className="migration-panel-content">
        <h3>🔄 Daten-Migration</h3>

        {!result && (
          <>
            <p>
              Du hast noch Daten in LocalStorage, die zu Supabase migriert
              werden können:
            </p>
            <ul>
              <li>{stats.flashcards} Flashcards</li>
              <li>{stats.learningSessions} Learning Sessions</li>
              <li>{stats.quizSessions} Quiz Sessions</li>
            </ul>

            {!isMigrating ? (
              <button onClick={handleMigrate} className="btn-primary">
                Jetzt zu Supabase migrieren
              </button>
            ) : (
              <div className="migration-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress ? (progress.current / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="progress-text">
                  {progress?.message || 'Migration läuft...'}
                </p>
              </div>
            )}
          </>
        )}

        {result && (
          <div
            className={`migration-result ${result.success ? 'success' : 'error'}`}
          >
            <h4>
              {result.success
                ? '✅ Migration erfolgreich!'
                : '⚠️ Migration mit Fehlern'}
            </h4>
            <ul>
              <li>{result.flashcardsMigrated} Flashcards migriert</li>
              <li>
                {result.learningSessionsMigrated} Learning Sessions migriert
              </li>
              <li>{result.quizSessionsMigrated} Quiz Sessions migriert</li>
            </ul>
            {result.errors.length > 0 && (
              <details>
                <summary>Fehler anzeigen ({result.errors.length})</summary>
                <ul className="error-list">
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </details>
            )}
            <button onClick={() => setResult(null)} className="btn-secondary">
              Schließen
            </button>
          </div>
        )}
      </div>

      <style>{`
        .migration-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 400px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          z-index: 1000;
        }

        .migration-panel-content h3 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 18px;
          color: #333;
        }

        .migration-panel-content p {
          margin: 8px 0;
          font-size: 14px;
          color: #666;
        }

        .migration-panel-content ul {
          margin: 12px 0;
          padding-left: 20px;
          font-size: 14px;
          color: #444;
        }

        .migration-panel-content li {
          margin: 4px 0;
        }

        .migration-panel button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
        }

        .migration-panel .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .migration-panel .btn-primary:hover {
          background: #2563eb;
        }

        .migration-panel .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .migration-panel .btn-secondary:hover {
          background: #d1d5db;
        }

        .migration-progress {
          margin-top: 16px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.3s ease;
        }

        .progress-text {
          margin-top: 8px;
          font-size: 13px;
          color: #666;
          text-align: center;
        }

        .migration-result {
          padding: 16px;
          border-radius: 6px;
          margin-top: 12px;
        }

        .migration-result.success {
          background: #ecfdf5;
          border: 1px solid #10b981;
        }

        .migration-result.error {
          background: #fef2f2;
          border: 1px solid #ef4444;
        }

        .migration-result h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
        }

        .migration-result.success h4 {
          color: #059669;
        }

        .migration-result.error h4 {
          color: #dc2626;
        }

        .migration-result details {
          margin-top: 12px;
          font-size: 13px;
        }

        .migration-result summary {
          cursor: pointer;
          color: #dc2626;
          font-weight: 500;
        }

        .migration-result .error-list {
          margin-top: 8px;
          max-height: 200px;
          overflow-y: auto;
          font-size: 12px;
          color: #991b1b;
        }

        @media (max-width: 640px) {
          .migration-panel {
            left: 20px;
            right: 20px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
