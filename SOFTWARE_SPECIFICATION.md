# Software-Spezifikation: Spanish Flashcard Learning App

## 1. Projektübersicht

### 1.1 Projektziel
Entwicklung einer webbasierten Flashcard-Anwendung zum Erlernen spanischer Vokabeln mit interaktiven Lernmodi, Quiz-Funktionen und detaillierter Fortschrittsverfolgung.

### 1.2 Zielgruppe
- Einzelne Lernende (Single-User)
- Desktop-Nutzer
- Spanischlernende auf Anfänger- bis Mittelstufe-Niveau

### 1.3 Kern-Features
- Manuelle Kartenerstellung (Spanisch → Englisch)
- Interaktiver Lern-Modus mit Karten umdrehen
- Quiz-Modi (Multiple Choice, Lückentext)
- Wiederholungsfunktion für falsch beantwortete Karten
- Umfassende Statistiken und Fortschrittsverfolgung
- Tastaturkürzel für effizientes Lernen

---

## 2. Technologie-Stack

### 2.1 Frontend
- **Framework**: React 18+
- **Build-Tool**: Vite
- **Sprache**: TypeScript
- **Styling**: CSS Modules oder Tailwind CSS (zu definieren)
- **State Management**: React Context API / useState
- **Routing**: React Router v6

### 2.2 Datenpersistenz
- **Browser LocalStorage** für alle Benutzerdaten
- JSON-Serialisierung für Karten und Statistiken

### 2.3 Entwicklungstools
- ESLint + Prettier für Code-Qualität
- TypeScript Strict Mode

---

## 3. Funktionale Anforderungen

### 3.1 Kartenverwaltung

#### 3.1.1 Karte erstellen
- **Eingabefelder**:
  - Spanisches Wort (Vorderseite) - Pflichtfeld
  - Englische Übersetzung (Rückseite) - Pflichtfeld
  - Optionale Notizen/Kontext
- **Validierung**:
  - Beide Felder dürfen nicht leer sein
  - Warnung bei doppelten Karten
- **Speichern**: Sofortige Speicherung in LocalStorage

#### 3.1.2 Karte bearbeiten
- Bestehende Karten können editiert werden
- Änderungen überschreiben alte Werte
- Statistiken der Karte bleiben erhalten

#### 3.1.3 Karte löschen
- Bestätigungsdialog vor Löschung
- Entfernt Karte und zugehörige Statistiken

#### 3.1.4 Kartenübersicht
- Tabellarische Darstellung aller Karten
- Sortierung nach: Erstellungsdatum, Alphabetisch, Erfolgsrate
- Suchfunktion nach spanischen oder englischen Begriffen

---

### 3.2 Lern-Modus (Klassischer Flashcard-Modus)

#### 3.2.1 Session-Start
- Button "Neue Karten lernen" auf Dashboard
- Session umfasst alle verfügbaren Karten oder Auswahl
- Karten werden in zufälliger Reihenfolge präsentiert

#### 3.2.2 Karten-Präsentation
- **Vorderseite**: Zeigt spanisches Wort
- **Aktion**: Klick oder Tastaturkürzel (Leertaste) dreht Karte um
- **Rückseite**: Zeigt englische Übersetzung
- **Selbstbewertung**:
  - Button "Richtig" (Hotkey: Pfeil rechts oder 'J')
  - Button "Falsch" (Hotkey: Pfeil links oder 'F')

#### 3.2.3 Fortschritt
- Fortschrittsbalken: "Karte 5 von 20"
- Navigation:
  - Zurück zur vorherigen Karte (falls gewünscht)
  - Überspringen möglich

#### 3.2.4 Session-Ende
- Zusammenfassung:
  - Anzahl richtig beantworteter Karten
  - Anzahl falsch beantworteter Karten
  - Erfolgsquote in %
- **Wiederholungs-Option**:
  - Button "Falsche Karten wiederholen"
  - Startet neue Session nur mit falsch markierten Karten

---

### 3.3 Quiz-Modi

#### 3.3.1 Multiple-Choice-Modus
- **Fragestellung**: Spanisches Wort wird angezeigt
- **Antwortoptionen**: 4 englische Übersetzungen
  - 1 korrekte Antwort
  - 3 falsche Antworten (zufällig aus anderen Karten)
- **Feedback**:
  - Sofortige Anzeige ob richtig/falsch
  - Richtige Antwort wird hervorgehoben bei falscher Wahl
- **Weiter**: Automatisch zur nächsten Frage nach 1 Sekunde

#### 3.3.2 Lückentext-Modus
- **Fragestellung**: Spanisches Wort + Beispielsatz (optional)
- **Interaktion**:
  - Lücke für englische Übersetzung
  - Auswahlfeld mit 4-6 Wortoptionen (inkl. korrekte Antwort)
  - Nutzer wählt Wort per Klick oder Zifferntasten (1-4)
- **Feedback**: Wie bei Multiple Choice

#### 3.3.3 Quiz-Session
- Start über Dashboard: "Quiz starten"
- Moduswahl: Multiple Choice oder Lückentext
- 10-20 Fragen pro Session (konfigurierbar)
- Endergebnis mit Score

---

### 3.4 Wiederholungsfunktion

#### 3.4.1 "Nur unbekannte Karten"
- Filtert Karten mit Erfolgsrate < 70%
- Separate Session nur mit diesen Karten
- Button auf Dashboard: "Wiederholung starten"

#### 3.4.2 Wiederholungs-Logik
- Falsch beantwortete Karten in Session werden markiert
- Am Ende der Session: Option zum nochmaligen Durchgehen
- Karten bleiben in Wiederholungs-Pool bis 2x hintereinander richtig

---

### 3.5 Statistiken

#### 3.5.1 Dashboard-Übersicht
- **Gesamtstatistiken**:
  - Gesamtanzahl Karten
  - Gelernte Karten (Erfolgsrate ≥ 70%)
  - Noch zu lernende Karten
  - Gesamterfolgsquote in %
  - Lernstreak (Tage in Folge)

#### 3.5.2 Detaillierte Statistikseite
**Pro Karte**:
- Spanisches Wort + englische Übersetzung
- Anzahl Wiederholungen
- Richtig beantwortet (absolut + %)
- Falsch beantwortet (absolut + %)
- Letzte Wiederholung (Datum)
- Status: Gelernt / In Arbeit / Neu

**Zeitlicher Verlauf**:
- Liniendiagramm: Täglich gelernte Karten (letzte 7/30 Tage)
- Balkendiagramm: Erfolgsquote pro Tag
- Heatmap: Lernaktivität (optional)

**Quiz-Statistiken**:
- Durchschnittliche Score pro Quiz-Typ
- Beste/schlechteste Karten

#### 3.5.3 Export (optional für später)
- Download als CSV oder JSON

---

## 4. Nicht-funktionale Anforderungen

### 4.1 Performance
- App-Start in < 2 Sekunden
- Karten-Flip Animation: < 300ms
- LocalStorage-Zugriff optimiert (Batch-Updates)

### 4.2 Usability
- Intuitive Navigation
- Klare visuelle Hierarchie
- Responsives Design (primär Desktop, aber mobile-fähig)
- Accessibility: Keyboard-Navigation vollständig unterstützt

### 4.3 Datensicherheit
- LocalStorage-Daten bleiben lokal
- Keine externe Datenübertragung
- Warnung bei Browser-Cache-Löschung (falls möglich)

### 4.4 Browser-Kompatibilität
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

---

## 5. Datenmodell

### 5.1 Flashcard-Objekt
```typescript
interface Flashcard {
  id: string; // UUID
  spanish: string; // Spanisches Wort
  english: string; // Englische Übersetzung
  notes?: string; // Optionale Notizen
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  statistics: CardStatistics;
}

interface CardStatistics {
  timesShown: number; // Wie oft angezeigt
  timesCorrect: number; // Wie oft richtig
  timesIncorrect: number; // Wie oft falsch
  lastReviewed: number | null; // Timestamp der letzten Wiederholung
  successRate: number; // Berechnet: timesCorrect / timesShown
  status: 'new' | 'learning' | 'learned'; // Automatisch berechnet
}
```

### 5.2 Quiz-Session-Objekt
```typescript
interface QuizSession {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  date: number; // Timestamp
  questions: QuizQuestion[];
  score: number; // Erfolgsquote in %
  completed: boolean;
}

interface QuizQuestion {
  cardId: string;
  userAnswer: string;
  correctAnswer: string;
  wasCorrect: boolean;
}
```

### 5.3 Learning-Session-Objekt
```typescript
interface LearningSession {
  id: string;
  date: number;
  cardsReviewed: string[]; // Array von Card IDs
  correctCards: string[];
  incorrectCards: string[];
  duration: number; // Sekunden
}
```

### 5.4 LocalStorage-Struktur
```typescript
{
  "flashcards": Flashcard[],
  "quizSessions": QuizSession[],
  "learningSessions": LearningSession[],
  "appSettings": {
    "cardsPerSession": number,
    "quizQuestionCount": number,
    "theme": "light" | "dark"
  },
  "userStats": {
    "totalCardsLearned": number,
    "currentStreak": number,
    "lastActiveDate": number
  }
}
```

---

## 6. UI/UX Spezifikationen

### 6.1 Navigation/Routing

#### 6.1.1 Route-Struktur
- `/` - Dashboard (Startseite)
- `/cards` - Kartenverwaltung (Liste, Hinzufügen, Bearbeiten)
- `/learn` - Lern-Modus Session
- `/quiz/multiple-choice` - Multiple Choice Quiz
- `/quiz/fill-blank` - Lückentext Quiz
- `/statistics` - Detaillierte Statistikseite
- `/settings` - App-Einstellungen (optional)

#### 6.1.2 Layout
- **Header**: Navigation-Links, App-Titel
- **Main Content**: Route-spezifischer Inhalt
- **Footer**: Copyright, Version (optional)

### 6.2 Tastaturkürzel (Hotkeys)

#### Global
- `Ctrl/Cmd + H` - Zurück zum Dashboard
- `Ctrl/Cmd + K` - Kartenverwaltung öffnen
- `Ctrl/Cmd + L` - Lern-Modus starten
- `Ctrl/Cmd + Q` - Quiz starten
- `Ctrl/Cmd + S` - Statistiken öffnen

#### Lern-Modus
- `Leertaste` - Karte umdrehen
- `Pfeil rechts` oder `J` - Richtig markieren
- `Pfeil links` oder `F` - Falsch markieren
- `Pfeil hoch` - Zurück zur vorherigen Karte
- `Pfeil unten` - Karte überspringen
- `Esc` - Session beenden

#### Quiz-Modus
- `1-4` - Antwort auswählen (Multiple Choice)
- `Enter` - Bestätigen
- `Esc` - Quiz beenden

#### Kartenverwaltung
- `Ctrl/Cmd + N` - Neue Karte hinzufügen
- `Ctrl/Cmd + F` - Suche fokussieren

### 6.3 Visuelles Design

#### Farben (Vorschlag)
- **Primary**: Blau (#3B82F6) - Aktionen, Links
- **Success**: Grün (#10B981) - Richtige Antworten
- **Error**: Rot (#EF4444) - Falsche Antworten
- **Warning**: Orange (#F59E0B) - Warnungen
- **Neutral**: Grau-Töne für Text und Hintergründe

#### Typografie
- **Headlines**: Sans-Serif, Bold (z.B. Inter, Roboto)
- **Body**: Sans-Serif, Regular
- **Flashcard-Text**: Größere Schrift (24-32px) für Lesbarkeit

#### Animationen
- Karten-Flip: 3D-Rotation (rotateY)
- Übergänge: Smooth (300ms ease-in-out)
- Feedback: Kurzes Pulsieren bei richtig/falsch

---

## 7. User Stories

### US-001: Karte erstellen
**Als** Lernender
**möchte ich** eine neue Flashcard mit spanischem Wort und englischer Übersetzung erstellen
**damit** ich meinen persönlichen Wortschatz aufbauen kann.

**Akzeptanzkriterien**:
- Formular mit 2 Pflichtfeldern sichtbar
- Validierung verhindert leere Eingaben
- Karte wird sofort in LocalStorage gespeichert
- Erfolgsbestätigung nach Speichern

---

### US-002: Karten lernen
**Als** Lernender
**möchte ich** meine Flashcards nacheinander durchgehen und selbst bewerten
**damit** ich mein Wissen überprüfen kann.

**Akzeptanzkriterien**:
- Session startet mit zufälliger Kartenreihenfolge
- Karte zeigt zunächst spanisches Wort
- Klick/Leertaste dreht Karte um
- Nach Umdrehen erscheinen "Richtig"/"Falsch"-Buttons
- Fortschritt wird angezeigt

---

### US-003: Falsche Karten wiederholen
**Als** Lernender
**möchte ich** am Ende einer Session nur die falsch beantworteten Karten nochmal sehen
**damit** ich gezielt an meinen Schwächen arbeiten kann.

**Akzeptanzkriterien**:
- Session-Ende zeigt Zusammenfassung
- Button "Falsche Karten wiederholen" ist sichtbar
- Neue Session enthält nur falsch markierte Karten
- Wiederholung kann beliebig oft gestartet werden

---

### US-004: Multiple-Choice-Quiz
**Als** Lernender
**möchte ich** mein Wissen in einem Multiple-Choice-Quiz testen
**damit** ich spielerisch lernen kann.

**Akzeptanzkriterien**:
- Quiz zeigt spanisches Wort
- 4 englische Antwortmöglichkeiten werden angezeigt
- Falsche Antworten stammen aus anderen Karten
- Sofortiges Feedback nach Auswahl
- Score wird am Ende angezeigt

---

### US-005: Fortschritt verfolgen
**Als** Lernender
**möchte ich** detaillierte Statistiken über meinen Lernfortschritt sehen
**damit** ich motiviert bleibe und meine Schwächen erkenne.

**Akzeptanzkriterien**:
- Dashboard zeigt Gesamt-Überblick
- Statistikseite zeigt Details pro Karte
- Zeitlicher Verlauf wird visualisiert
- Erfolgsquoten werden berechnet und angezeigt

---

## 8. Entwicklungsphasen

### Phase 1: MVP (Minimum Viable Product)
- [ ] Projekt-Setup (Vite + React + TypeScript)
- [ ] Routing-Struktur
- [ ] Datenmodell + LocalStorage-Anbindung
- [ ] Kartenverwaltung (CRUD)
- [ ] Basis Lern-Modus (ohne Hotkeys)
- [ ] Einfache Dashboard-Statistik

### Phase 2: Erweiterte Features
- [ ] Tastaturkürzel implementieren
- [ ] Multiple-Choice-Quiz
- [ ] Lückentext-Quiz
- [ ] Wiederholungsfunktion
- [ ] Session-Zusammenfassungen

### Phase 3: Statistiken & Polish
- [ ] Detaillierte Statistikseite
- [ ] Zeitlicher Verlauf (Diagramme)
- [ ] Pro-Karten-Statistiken
- [ ] Animationen & Übergänge
- [ ] Accessibility-Verbesserungen

### Phase 4: Optional (Future Enhancements)
- [ ] Dark Mode
- [ ] Karten-Import/Export
- [ ] Audio-Aussprache (Text-to-Speech)
- [ ] Kategorien/Tags für Karten
- [ ] Spaced Repetition Algorithm

---

## 9. Testing-Strategie

### 9.1 Unit Tests
- LocalStorage-Helper-Funktionen
- Statistik-Berechnungen
- Card-Shuffle-Logik
- Quiz-Antwort-Generierung

### 9.2 Integration Tests
- Vollständiger Lern-Flow
- Quiz-Durchlauf
- Statistik-Updates nach Session

### 9.3 Manuelle Tests
- Browser-Kompatibilität
- Tastaturkürzel-Funktionalität
- Responsive Design

---

## 10. Offene Fragen & Entscheidungen

- [ ] CSS-Framework-Wahl (Plain CSS / Tailwind / Styled Components)
- [ ] Chart-Library für Statistiken (Chart.js / Recharts / Victory)
- [ ] Animationslibrary (Framer Motion / React Spring / CSS)
- [ ] Icon-Set (Heroicons / Font Awesome / Lucide)
- [ ] Beispiel-Datensatz für Demo-Zwecke?

---

## 11. Anhang

### 11.1 Glossar
- **Flashcard**: Digitale Lernkarte mit Vorder- und Rückseite
- **Session**: Einzelne Lern- oder Quiz-Durchgang
- **Success Rate**: Erfolgsquote (Richtig / Gesamt)
- **Streak**: Anzahl aufeinanderfolgender Tage mit Lernaktivität

### 11.2 Referenzen
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

**Dokumentversion**: 1.0
**Erstellt am**: 2025-12-27
**Autor**: Generated for Vibe Coding Udemy Course Practice Project
