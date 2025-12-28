import { useEffect } from 'react';
import { useHotkeys } from '../../hooks';
import './HotkeyHelp.css';

interface HotkeyHelpProps {
  onClose: () => void;
}

interface HotkeyItem {
  keys: string[];
  description: string;
}

interface HotkeyCategory {
  title: string;
  icon: string;
  hotkeys: HotkeyItem[];
}

export function HotkeyHelp({ onClose }: HotkeyHelpProps) {
  // Close on Escape key
  useHotkeys([
    {
      key: 'Escape',
      callback: onClose,
    },
  ]);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Detect platform for display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? '⌘' : 'Ctrl';

  const categories: HotkeyCategory[] = [
    {
      title: 'Navigation',
      icon: '🧭',
      hotkeys: [
        { keys: [modifierKey, 'H'], description: 'Zum Dashboard' },
        { keys: [modifierKey, 'K'], description: 'Zur Kartenverwaltung' },
        { keys: [modifierKey, 'L'], description: 'Zum Lern-Modus' },
        { keys: [modifierKey, 'Q'], description: 'Zum Quiz' },
        { keys: [modifierKey, 'S'], description: 'Zu Statistiken' },
      ],
    },
    {
      title: 'Lern-Modus',
      icon: '📚',
      hotkeys: [
        { keys: ['Leertaste'], description: 'Karte umdrehen' },
        { keys: ['→', 'J'], description: 'Als richtig markieren' },
        { keys: ['←', 'F'], description: 'Als falsch markieren' },
        { keys: ['↑'], description: 'Zurück zur vorherigen Karte' },
        { keys: ['↓'], description: 'Karte überspringen' },
        { keys: ['Esc'], description: 'Session beenden' },
      ],
    },
    {
      title: 'Hilfe',
      icon: '❓',
      hotkeys: [
        { keys: ['?'], description: 'Diese Hilfe öffnen' },
        { keys: [modifierKey, '/'], description: 'Diese Hilfe öffnen' },
        { keys: ['Esc'], description: 'Hilfe schließen' },
      ],
    },
  ];

  return (
    <div className="hotkey-help-backdrop" onClick={onClose} role="presentation">
      <div
        className="hotkey-help-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotkey-help-title"
      >
        <div className="hotkey-help-header">
          <h2 id="hotkey-help-title">
            <span role="img" aria-label="Tastatur">
              ⌨️
            </span>{' '}
            Tastaturkürzel
          </h2>
          <button
            onClick={onClose}
            className="hotkey-help-close"
            aria-label="Hilfe schließen"
          >
            ✕
          </button>
        </div>

        <div className="hotkey-help-content">
          {categories.map(category => (
            <div key={category.title} className="hotkey-category">
              <h3 className="category-title">
                <span className="category-icon" role="img" aria-hidden="true">
                  {category.icon}
                </span>
                {category.title}
              </h3>
              <div className="hotkey-list">
                {category.hotkeys.map((hotkey, index) => (
                  <div key={index} className="hotkey-item">
                    <div className="hotkey-keys">
                      {hotkey.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="hotkey-key">{key}</kbd>
                          {keyIndex < hotkey.keys.length - 1 && (
                            <span className="hotkey-separator">oder</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="hotkey-description">
                      {hotkey.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hotkey-help-footer">
          <p>Drücke Esc oder klicke außerhalb, um zu schließen</p>
        </div>
      </div>
    </div>
  );
}
