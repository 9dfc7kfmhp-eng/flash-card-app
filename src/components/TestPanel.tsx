import { useState } from 'react';
import { useFlashcards } from '../context';
import { seedDemoData, resetAppData } from '../utils';

export function TestPanel() {
  const { flashcards, refreshFlashcards } = useFlashcards();
  const [message, setMessage] = useState('');

  const handleSeedData = () => {
    const count = seedDemoData();
    refreshFlashcards();
    setMessage(`✅ ${count} Demo-Karten erfolgreich erstellt!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Alle Daten werden gelöscht! Bist du sicher? (Diese Aktion kann nicht rückgängig gemacht werden)'
      )
    ) {
      resetAppData();
      refreshFlashcards();
      setMessage('🗑️ Alle Daten wurden zurückgesetzt');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleShowStats = () => {
    const stats = {
      totalCards: flashcards.length,
      newCards: flashcards.filter(c => c.statistics.status === 'new').length,
      learning: flashcards.filter(c => c.statistics.status === 'learning')
        .length,
      learned: flashcards.filter(c => c.statistics.status === 'learned').length,
    };

    console.log('📊 Flashcard Statistiken:', stats);
    console.log('📋 Alle Karten:', flashcards);
    setMessage('📊 Statistiken in der Konsole ausgegeben (F12)');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div
      style={{
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0',
        backgroundColor: '#f8fafc',
      }}
    >
      <h2 style={{ marginTop: 0, color: '#1e40af' }}>🧪 Test Panel</h2>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
          }}
        >
          <strong>Aktuelle Karten:</strong> {flashcards.length}
          <div
            style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '0.5rem',
            }}
          >
            Neu: {flashcards.filter(c => c.statistics.status === 'new').length}{' '}
            | Lernen:{' '}
            {flashcards.filter(c => c.statistics.status === 'learning').length}{' '}
            | Gelernt:{' '}
            {flashcards.filter(c => c.statistics.status === 'learned').length}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={handleSeedData}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          📥 Demo-Daten laden (25 Karten)
        </button>

        <button
          onClick={handleShowStats}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          📊 Statistiken anzeigen
        </button>

        <button
          onClick={handleResetData}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          🗑️ Alle Daten löschen
        </button>

        <button
          onClick={refreshFlashcards}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          🔄 Neu laden
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: '6px',
            color: '#1e40af',
          }}
        >
          {message}
        </div>
      )}

      <details style={{ marginTop: '1rem' }}>
        <summary
          style={{
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '0.875rem',
          }}
        >
          💡 Tipp: Browser-Konsole öffnen
        </summary>
        <div
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#64748b',
          }}
        >
          Drücke <kbd>F12</kbd> um die Developer Tools zu öffnen und die
          Konsolen-Ausgaben zu sehen. Du kannst dort auch LocalStorage
          inspizieren unter: Application → Local Storage → localhost:5173
        </div>
      </details>
    </div>
  );
}
