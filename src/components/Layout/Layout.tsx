import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useHotkeys } from '../../hooks';
import { Header } from './Header';
import { HotkeyHelp } from '../HotkeyHelp';
import './Layout.css';

export function Layout() {
  const navigate = useNavigate();
  const [showHotkeyHelp, setShowHotkeyHelp] = useState(false);

  // Global Navigation Hotkeys
  useHotkeys([
    {
      key: 'cmd+h',
      callback: () => navigate('/'),
    },
    {
      key: 'cmd+k',
      callback: () => navigate('/cards'),
    },
    {
      key: 'cmd+l',
      callback: () => navigate('/learn'),
    },
    {
      key: 'cmd+q',
      callback: () => navigate('/quiz/multiple-choice'),
    },
    {
      key: 'cmd+s',
      callback: () => navigate('/statistics'),
    },
    {
      key: '?',
      callback: () => setShowHotkeyHelp(true),
      ignoreInputs: true,
    },
    {
      key: 'cmd+/',
      callback: () => setShowHotkeyHelp(true),
    },
  ]);

  return (
    <div className="app-layout">
      {/* Skip to Content Link für Keyboard-Navigation & Screen Reader */}
      <a href="#main-content" className="skip-to-content">
        Zum Hauptinhalt springen
      </a>
      <Header />
      <main id="main-content" className="main-content" role="main">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
      <footer className="app-footer">
        <p>© 2025 Spanish Flashcard App - Vibe Coding Übungsprojekt</p>
      </footer>

      {showHotkeyHelp && (
        <HotkeyHelp onClose={() => setShowHotkeyHelp(false)} />
      )}
    </div>
  );
}
