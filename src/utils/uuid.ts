/**
 * Generiert eine kryptografisch sichere UUID v4
 * Verwendet crypto.randomUUID() wenn verfügbar (moderne Browser),
 * ansonsten Fallback mit crypto.getRandomValues()
 * @returns Eine eindeutige UUID v4 als String
 */
export function generateUUID(): string {
  // Moderne Browser unterstützen crypto.randomUUID()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback für ältere Browser mit crypto.getRandomValues()
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Last Resort Fallback (sollte nie erreicht werden in modernen Umgebungen)
  console.warn('crypto API not available, using Math.random() fallback');
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
