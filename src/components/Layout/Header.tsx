import { NavLink } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          <span role="img" aria-label="Spielkarten">
            🃏
          </span>{' '}
          Spanish Flashcards
        </h1>
        <nav className="main-nav" aria-label="Hauptnavigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {({ isActive }) => (
              <span aria-current={isActive ? 'page' : undefined}>
                Dashboard
              </span>
            )}
          </NavLink>
          <NavLink
            to="/cards"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {({ isActive }) => (
              <span aria-current={isActive ? 'page' : undefined}>Karten</span>
            )}
          </NavLink>
          <NavLink
            to="/learn"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {({ isActive }) => (
              <span aria-current={isActive ? 'page' : undefined}>Lernen</span>
            )}
          </NavLink>
          <NavLink
            to="/statistics"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {({ isActive }) => (
              <span aria-current={isActive ? 'page' : undefined}>
                Statistiken
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
