-- Flash Card App Database Schema für Supabase
-- Führe dieses SQL in deinem Supabase SQL Editor aus

-- Table: flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spanish TEXT NOT NULL,
  english TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  times_shown INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  times_incorrect INTEGER NOT NULL DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  success_rate INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'learned')),
  consecutive_correct INTEGER NOT NULL DEFAULT 0
);

-- Table: learning_sessions
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cards_reviewed UUID[] NOT NULL,
  correct_cards UUID[] NOT NULL,
  incorrect_cards UUID[] NOT NULL,
  duration INTEGER NOT NULL
);

-- Table: quiz_sessions
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'fill-in-blank')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  questions JSONB NOT NULL,
  score INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT TRUE
);

-- Indexes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_flashcards_status ON flashcards(status);
CREATE INDEX IF NOT EXISTS idx_flashcards_success_rate ON flashcards(success_rate);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_date ON learning_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_date ON quiz_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_type ON quiz_sessions(type);

-- Row Level Security (RLS) aktivieren
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Public Access Policies (für anonyme Nutzung ohne Auth)
-- Jeder kann lesen
CREATE POLICY "Enable read access for all users" ON flashcards
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON learning_sessions
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON quiz_sessions
  FOR SELECT USING (true);

-- Jeder kann schreiben (für MVP ohne Auth)
CREATE POLICY "Enable insert access for all users" ON flashcards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON flashcards
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON flashcards
  FOR DELETE USING (true);

CREATE POLICY "Enable insert access for all users" ON learning_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert access for all users" ON quiz_sessions
  FOR INSERT WITH CHECK (true);

-- Function: Auto-Update updated_at Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-Update updated_at bei Änderungen
CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Kommentare für Dokumentation
COMMENT ON TABLE flashcards IS 'Speichert alle Flashcards mit ihren Statistiken';
COMMENT ON TABLE learning_sessions IS 'Speichert alle Lern-Sessions';
COMMENT ON TABLE quiz_sessions IS 'Speichert alle Quiz-Sessions';
