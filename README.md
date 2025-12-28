# Spanish Flashcard Learning App

Eine webbasierte Flashcard-Anwendung zum Erlernen spanischer Vokabeln, entwickelt mit React, TypeScript und Vite.

## Features

- 🃏 **Interaktive Flashcards** - Spanisch ↔ Englisch
- 📚 **Lern-Modi** - Klassischer Karten-Modus, Multiple Choice, Lückentext
- 🔄 **Intelligente Wiederholung** - Fokus auf schwierige Karten
- 📊 **Detaillierte Statistiken** - Fortschritt & Performance-Tracking
- ⌨️ **Tastaturkürzel** - Effizientes Lernen mit Hotkeys
- 💾 **Lokale Speicherung** - Alle Daten im Browser (LocalStorage)

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Sprache**: TypeScript
- **State Management**: React Context API
- **Routing**: React Router v6
- **Styling**: CSS (TBD: CSS Modules oder Tailwind)

## Projektstruktur

```
src/
├── components/     # React-Komponenten
├── pages/          # Page-Komponenten (Routes)
├── hooks/          # Custom React Hooks
├── utils/          # Hilfsfunktionen & Services
├── types/          # TypeScript Type Definitions
└── context/        # React Context Providers
```

## Installation & Start

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev

# Lint & Format
npm run lint
npm run format

# Build für Produktion
npm run build
```

## Entwicklung

Dieses Projekt wird als Übungsprojekt parallel zum Udemy-Kurs über Vibe Coding entwickelt.

Siehe [SOFTWARE_SPECIFICATION.md](./SOFTWARE_SPECIFICATION.md) für die vollständige Spezifikation und [TODO.md](./TODO.md) für den Entwicklungsplan.

## Lizenz

Private Learning Project
