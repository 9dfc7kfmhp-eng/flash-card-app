import { useState, useMemo } from 'react';
import { useFlashcards } from '../context/FlashcardContext';
import { CreateCardForm } from '../components/Cards/CreateCardForm';
import { EditCardModal } from '../components/Cards/EditCardModal';
import { DeleteConfirmation } from '../components/Cards/DeleteConfirmation';
import type { Flashcard } from '../types';
import './CardManagement.css';

type SortField = 'createdAt' | 'spanish' | 'english' | 'successRate';
type SortDirection = 'asc' | 'desc';

export function CardManagement() {
  const { flashcards, removeFlashcard } = useFlashcards();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [deletingCard, setDeletingCard] = useState<Flashcard | null>(null);

  // Filter cards based on search term
  const filteredCards = useMemo(() => {
    if (!searchTerm) return flashcards;

    const search = searchTerm.toLowerCase();
    return flashcards.filter(
      card =>
        card.spanish.toLowerCase().includes(search) ||
        card.english.toLowerCase().includes(search) ||
        card.notes?.toLowerCase().includes(search)
    );
  }, [flashcards, searchTerm]);

  // Sort filtered cards
  const sortedCards = useMemo(() => {
    const sorted = [...filteredCards];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'createdAt':
          compareValue = a.createdAt - b.createdAt;
          break;
        case 'spanish':
          compareValue = a.spanish.localeCompare(b.spanish);
          break;
        case 'english':
          compareValue = a.english.localeCompare(b.english);
          break;
        case 'successRate':
          compareValue = a.statistics.successRate - b.statistics.successRate;
          break;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [filteredCards, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (card: Flashcard) => {
    setDeletingCard(card);
  };

  const confirmDelete = () => {
    if (deletingCard) {
      removeFlashcard(deletingCard.id);
      setDeletingCard(null);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="card-management">
      <div className="management-header">
        <h1>Kartenverwaltung</h1>
        <p className="subtitle">
          Erstelle, bearbeite und verwalte deine Flashcards
        </p>
      </div>

      <CreateCardForm />

      <div className="cards-section">
        <div className="cards-controls">
          <div className="search-box">
            <span className="search-icon" role="img" aria-label="Suche">
              🔍
            </span>
            <input
              type="text"
              placeholder="Suche nach Spanisch, Englisch oder Notizen..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Karten durchsuchen"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
                aria-label="Suche löschen"
              >
                ✕
              </button>
            )}
          </div>

          <div className="results-count" role="status" aria-live="polite">
            {filteredCards.length === flashcards.length ? (
              <span>
                {flashcards.length}{' '}
                {flashcards.length === 1 ? 'Karte' : 'Karten'}
              </span>
            ) : (
              <span>
                {filteredCards.length} von {flashcards.length}{' '}
                {flashcards.length === 1 ? 'Karte' : 'Karten'} gefunden
              </span>
            )}
          </div>
        </div>

        {sortedCards.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? (
              <>
                <div className="empty-icon" role="img" aria-label="Lupe">
                  🔍
                </div>
                <h3>Keine Karten gefunden</h3>
                <p>
                  Keine Karten entsprechen deiner Suche nach &quot;{searchTerm}
                  &quot;
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-secondary"
                >
                  Suche zurücksetzen
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon" role="img" aria-label="Notizblock">
                  📝
                </div>
                <h3>Noch keine Karten vorhanden</h3>
                <p>Erstelle deine erste Flashcard mit dem Formular oben!</p>
              </>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="cards-table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('spanish')}
                    className="sortable"
                    role="button"
                    tabIndex={0}
                    aria-sort={
                      sortField === 'spanish'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    aria-label={`Nach Spanisch sortieren. Aktuell ${sortField === 'spanish' ? (sortDirection === 'asc' ? 'aufsteigend' : 'absteigend') : 'nicht'} sortiert`}
                  >
                    Spanisch{' '}
                    <span role="img" aria-hidden="true">
                      {getSortIcon('spanish')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('english')}
                    className="sortable"
                    role="button"
                    tabIndex={0}
                    aria-sort={
                      sortField === 'english'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    aria-label={`Nach Englisch sortieren. Aktuell ${sortField === 'english' ? (sortDirection === 'asc' ? 'aufsteigend' : 'absteigend') : 'nicht'} sortiert`}
                  >
                    Englisch{' '}
                    <span role="img" aria-hidden="true">
                      {getSortIcon('english')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('successRate')}
                    className="sortable"
                    role="button"
                    tabIndex={0}
                    aria-sort={
                      sortField === 'successRate'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    aria-label={`Nach Erfolgsquote sortieren. Aktuell ${sortField === 'successRate' ? (sortDirection === 'asc' ? 'aufsteigend' : 'absteigend') : 'nicht'} sortiert`}
                  >
                    Erfolgsquote{' '}
                    <span role="img" aria-hidden="true">
                      {getSortIcon('successRate')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('createdAt')}
                    className="sortable"
                    role="button"
                    tabIndex={0}
                    aria-sort={
                      sortField === 'createdAt'
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    aria-label={`Nach Erstelldatum sortieren. Aktuell ${sortField === 'createdAt' ? (sortDirection === 'asc' ? 'aufsteigend' : 'absteigend') : 'nicht'} sortiert`}
                  >
                    Erstellt{' '}
                    <span role="img" aria-hidden="true">
                      {getSortIcon('createdAt')}
                    </span>
                  </th>
                  <th className="actions-col">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {sortedCards.map(card => (
                  <tr key={card.id}>
                    <td className="spanish-col">{card.spanish}</td>
                    <td className="english-col">{card.english}</td>
                    <td className="stats-col">
                      <div className="success-rate">
                        <div className="rate-bar">
                          <div
                            className="rate-fill"
                            style={{
                              width: `${card.statistics.successRate}%`,
                              backgroundColor:
                                card.statistics.successRate >= 70
                                  ? '#10b981'
                                  : card.statistics.successRate >= 40
                                    ? '#f59e0b'
                                    : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="rate-text">
                          {card.statistics.successRate}%
                        </span>
                      </div>
                      <div className="stats-detail">
                        {card.statistics.timesShown > 0 ? (
                          <span>
                            {card.statistics.timesCorrect}/
                            {card.statistics.timesShown} richtig
                          </span>
                        ) : (
                          <span className="not-practiced">
                            Noch nicht geübt
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="date-col">
                      {new Date(card.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="actions-col">
                      <button
                        onClick={() => setEditingCard(card)}
                        className="btn-action btn-edit"
                        aria-label="Karte bearbeiten"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(card)}
                        className="btn-action btn-delete"
                        aria-label="Karte löschen"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
        />
      )}

      {deletingCard && (
        <DeleteConfirmation
          card={deletingCard}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingCard(null)}
        />
      )}
    </div>
  );
}
