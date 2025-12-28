import { useEffect } from 'react';

/**
 * Hotkey-Konfiguration
 */
export interface HotkeyConfig {
  /** Key-Kombination (z.B. "cmd+h", "ctrl+h", "ArrowRight", " " für Leertaste) */
  key: string;
  /** Callback wenn Hotkey gedrückt wird */
  callback: (event: KeyboardEvent) => void;
  /** Ob Default-Verhalten verhindert werden soll (default: true) */
  preventDefault?: boolean;
  /** Ob der Hotkey nur aktiv sein soll wenn kein Input-Element fokussiert ist (default: true) */
  ignoreInputs?: boolean;
}

/**
 * Prüft ob das aktuelle Event einem Hotkey entspricht
 */
function matchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const parts = hotkey.toLowerCase().split('+');

  // Extract modifiers and key
  const modifiers = parts.slice(0, -1);
  const key = parts[parts.length - 1];

  // Check modifiers
  const needsCtrl = modifiers.includes('ctrl') || modifiers.includes('control');
  const needsCmd = modifiers.includes('cmd') || modifiers.includes('meta');
  const needsShift = modifiers.includes('shift');
  const needsAlt = modifiers.includes('alt');

  // Platform-aware: cmd on Mac, ctrl on Windows/Linux
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const needsModifier = needsCtrl || needsCmd;
  const hasModifier = isMac ? event.metaKey : event.ctrlKey;

  if (needsModifier && !hasModifier) return false;
  if (!needsModifier && (event.metaKey || event.ctrlKey)) return false;
  if (needsShift && !event.shiftKey) return false;
  if (!needsShift && event.shiftKey) return false;
  if (needsAlt && !event.altKey) return false;
  if (!needsAlt && event.altKey) return false;

  // Check key
  const eventKey = event.key.toLowerCase();

  // Handle space specially
  if (key === ' ' || key === 'space') {
    return eventKey === ' ';
  }

  return eventKey === key;
}

/**
 * Prüft ob ein Input-Element fokussiert ist
 */
function isInputElement(element: Element | null): boolean {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.getAttribute('contenteditable') === 'true'
  );
}

/**
 * Custom Hook für Tastaturkürzel
 *
 * @param hotkeys - Array von Hotkey-Konfigurationen
 * @param enabled - Ob Hotkeys aktiv sind (default: true)
 *
 * @example
 * useHotkeys([
 *   { key: 'cmd+h', callback: () => navigate('/') },
 *   { key: 'ArrowRight', callback: handleNext },
 *   { key: ' ', callback: handleFlip }
 * ]);
 */
export function useHotkeys(
  hotkeys: HotkeyConfig[],
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if an input element is focused
      const isInput = isInputElement(document.activeElement);

      // Try to match each hotkey
      for (const hotkey of hotkeys) {
        if (matchesHotkey(event, hotkey.key)) {
          // Skip if we should ignore inputs and an input is focused
          if (hotkey.ignoreInputs !== false && isInput) {
            continue;
          }

          // Prevent default if requested
          if (hotkey.preventDefault !== false) {
            event.preventDefault();
          }

          // Execute callback
          hotkey.callback(event);
          break;
        }
      }
    };

    // Register event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeys, enabled]);
}
