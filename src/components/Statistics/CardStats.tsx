import { useState, useMemo } from 'react';
import type { Flashcard } from '../../types';
import './CardStats.css';

interface CardStatsProps {
  cards: Flashcard[];
}

type SortField =
  | 'spanish'
  | 'english'
  | 'timesShown'
  | 'timesCorrect'
  | 'timesIncorrect'
  | 'successRate'
  | 'lastReviewed'
  | 'status';

type SortDirection = 'asc' | 'desc';

export function CardStats({ cards }: CardStatsProps) {
  const [sortField, setSortField] = useState<SortField>('spanish');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCards = useMemo(() => {
    const sorted = [...cards].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'spanish':
          aValue = a.spanish.toLowerCase();
          bValue = b.spanish.toLowerCase();
          break;
        case 'english':
          aValue = a.english.toLowerCase();
          bValue = b.english.toLowerCase();
          break;
        case 'timesShown':
          aValue = a.statistics.timesShown;
          bValue = b.statistics.timesShown;
          break;
        case 'timesCorrect':
          aValue = a.statistics.timesCorrect;
          bValue = b.statistics.timesCorrect;
          break;
        case 'timesIncorrect':
          aValue = a.statistics.timesIncorrect;
          bValue = b.statistics.timesIncorrect;
          break;
        case 'successRate':
          aValue = a.statistics.successRate;
          bValue = b.statistics.successRate;
          break;
        case 'lastReviewed':
          aValue = a.statistics.lastReviewed || 0;
          bValue = b.statistics.lastReviewed || 0;
          break;
        case 'status':
          aValue = getStatus(a);
          bValue = getStatus(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [cards, sortField, sortDirection]);

  const getStatus = (card: Flashcard): 'new' | 'learning' | 'learned' => {
    if (card.statistics.timesShown === 0) return 'new';
    if (card.statistics.successRate >= 70 && card.statistics.timesShown >= 3)
      return 'learned';
    return 'learning';
  };

  const getStatusLabel = (status: 'new' | 'learning' | 'learned'): string => {
    switch (status) {
      case 'new':
        return 'Neu';
      case 'learning':
        return 'Lernen';
      case 'learned':
        return 'Gelernt';
    }
  };

  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getSortIcon = (field: SortField): string => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (cards.length === 0) {
    return (
      <div className="card-stats-empty">
        <p>Keine Karten vorhanden</p>
      </div>
    );
  }

  return (
    <div className="card-stats-container">
      <div className="card-stats-table-wrapper">
        <table className="card-stats-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('spanish')}>
                Spanisch {getSortIcon('spanish')}
              </th>
              <th onClick={() => handleSort('english')}>
                Englisch {getSortIcon('english')}
              </th>
              <th onClick={() => handleSort('timesShown')}>
                Wiederh. {getSortIcon('timesShown')}
              </th>
              <th onClick={() => handleSort('timesCorrect')}>
                Richtig {getSortIcon('timesCorrect')}
              </th>
              <th onClick={() => handleSort('timesIncorrect')}>
                Falsch {getSortIcon('timesIncorrect')}
              </th>
              <th onClick={() => handleSort('successRate')}>
                Quote {getSortIcon('successRate')}
              </th>
              <th onClick={() => handleSort('lastReviewed')}>
                Letztes Mal {getSortIcon('lastReviewed')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map(card => {
              const status = getStatus(card);
              return (
                <tr key={card.id} className={`status-${status}`}>
                  <td className="cell-spanish">{card.spanish}</td>
                  <td className="cell-english">{card.english}</td>
                  <td className="cell-number">{card.statistics.timesShown}</td>
                  <td className="cell-number cell-correct">
                    {card.statistics.timesCorrect}
                  </td>
                  <td className="cell-number cell-incorrect">
                    {card.statistics.timesIncorrect}
                  </td>
                  <td className="cell-rate">
                    <div className="rate-bar-container">
                      <div
                        className={`rate-bar ${
                          card.statistics.successRate >= 70
                            ? 'success'
                            : card.statistics.successRate >= 40
                              ? 'warning'
                              : 'danger'
                        }`}
                        style={{
                          width: `${card.statistics.successRate}%`,
                        }}
                      />
                      <span className="rate-label">
                        {card.statistics.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className="cell-date">
                    {formatDate(card.statistics.lastReviewed)}
                  </td>
                  <td className="cell-status">
                    <span className={`status-badge status-${status}`}>
                      {getStatusLabel(status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
