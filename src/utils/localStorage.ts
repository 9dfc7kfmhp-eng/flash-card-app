/**
 * LocalStorage Utility mit TypeScript-Generics
 * Bietet typsichere Funktionen zum Speichern und Laden von Daten
 */

/**
 * Speichert Daten im LocalStorage
 * @param key - LocalStorage-Key
 * @param data - Zu speichernde Daten (werden als JSON serialisiert)
 * @throws Error wenn Speichern fehlschlägt
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
    throw new Error(`Failed to save data to localStorage: ${error}`);
  }
}

/**
 * Lädt Daten aus dem LocalStorage
 * @param key - LocalStorage-Key
 * @returns Die gespeicherten Daten oder null wenn nicht vorhanden
 * @throws Error wenn Parsing fehlschlägt
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Error loading from localStorage (key: ${key}):`, error);
    throw new Error(`Failed to parse data from localStorage: ${error}`);
  }
}

/**
 * Entfernt einen Eintrag aus dem LocalStorage
 * @param key - LocalStorage-Key
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
  }
}

/**
 * Löscht alle Daten aus dem LocalStorage
 * Vorsicht: Entfernt ALLE localStorage-Daten, nicht nur App-spezifische!
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Überprüft ob ein Key im LocalStorage existiert
 * @param key - LocalStorage-Key
 * @returns true wenn Key existiert
 */
export function hasLocalStorageKey(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
