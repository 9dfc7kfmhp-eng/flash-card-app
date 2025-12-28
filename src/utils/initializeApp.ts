import { STORAGE_KEYS, DEFAULT_APP_DATA } from '../types';
import { hasLocalStorageKey, saveToLocalStorage } from './localStorage';

/**
 * Initialisiert die App-Daten beim ersten Start
 * Erstellt Default-Daten in LocalStorage wenn noch nicht vorhanden
 */
export function initializeAppData(): void {
  if (!hasLocalStorageKey(STORAGE_KEYS.APP_DATA)) {
    console.log('First app launch - initializing default data');
    saveToLocalStorage(STORAGE_KEYS.APP_DATA, DEFAULT_APP_DATA);
  } else {
    console.log('App data found in localStorage');
  }
}

/**
 * Resettet alle App-Daten auf Default-Werte
 * VORSICHT: Löscht alle Flashcards und Statistiken!
 */
export function resetAppData(): void {
  console.warn('Resetting all app data to defaults');
  saveToLocalStorage(STORAGE_KEYS.APP_DATA, DEFAULT_APP_DATA);
}
