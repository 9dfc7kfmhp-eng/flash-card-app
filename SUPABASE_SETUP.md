# 🚀 Supabase Setup Anleitung

## Schritt 1: Datenbank-Schema erstellen

1. Gehe zu deinem Supabase Dashboard: https://supabase.com/dashboard/project/trzuqpauesshzmltwnkc
2. Klicke im Menü auf **"SQL Editor"**
3. Klicke auf **"New query"**
4. Kopiere den kompletten Inhalt aus `supabase-schema.sql`
5. Füge ihn in den SQL Editor ein
6. Klicke auf **"Run"** (oder drücke Strg/Cmd + Enter)

## Schritt 2: Verifiziere die Tabellen

1. Gehe zu **"Table Editor"** im Menü
2. Du solltest jetzt 3 Tabellen sehen:
   - ✅ `flashcards`
   - ✅ `learning_sessions`
   - ✅ `quiz_sessions`

## Schritt 3: Umgebungsvariablen in Vercel setzen

1. Gehe zu https://vercel.com/bastis-projects-71e61f78/flash-card-app/settings/environment-variables
2. Füge folgende Variablen hinzu:

```
Name: VITE_SUPABASE_URL
Value: https://trzuqpauesshzmltwnkc.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_ywo4z0y7Ryfl7cCuNFUShQ_jxbFTF95
```

3. Scope: **Production**, **Preview**, **Development** (alle auswählen)
4. Klicke **"Save"**

## Schritt 4: Neues Deployment triggern

Nach dem Setzen der Environment-Variablen:
1. Gehe zu **"Deployments"**
2. Wähle das neueste Deployment
3. Klicke auf die drei Punkte **"..."**
4. Klicke **"Redeploy"**

Oder pushe einfach einen neuen Commit zu GitHub - Vercel deployt automatisch!

---

## 🎯 Was wurde implementiert?

### Datenbank-Struktur

**flashcards Table:**
- Speichert alle Vokabeln mit Statistiken
- Auto-Update von `updated_at` bei Änderungen
- Indexes für schnelle Queries

**learning_sessions Table:**
- Speichert alle Lern-Sessions
- Verknüpfung zu Flashcards über UUID-Arrays

**quiz_sessions Table:**
- Speichert alle Quiz-Sessions
- Questions als JSONB für Flexibilität

### Row Level Security (RLS)

- ✅ Aktiviert für alle Tabellen
- ✅ Public Access Policies (jeder kann lesen/schreiben)
- 🔐 Später einfach auf User-basiert umstellbar

### Performance

- ✅ Indexes auf häufig verwendete Felder
- ✅ Auto-Timestamps
- ✅ Optimierte Query-Performance

---

## 📊 Optional: Daten von LocalStorage migrieren

Wenn du bereits Daten in LocalStorage hast, kannst du sie migrieren:

1. Öffne die App im Browser: http://localhost:5173
2. Öffne DevTools (F12) → Console
3. Führe aus:

```javascript
// Exportiere LocalStorage-Daten
const data = JSON.parse(localStorage.getItem('flashcard-app-data'));
console.log(JSON.stringify(data, null, 2));
```

4. Kopiere die JSON-Ausgabe
5. Die App wird automatisch die Daten zu Supabase migrieren beim nächsten Start

---

## ✅ Fertig!

Nach diesen Schritten läuft deine App mit Supabase als Backend! 🎉

**Vorteile:**
- ✅ Cloud-basiertes Backup
- ✅ Sync zwischen Geräten möglich
- ✅ Skalierbar
- ✅ Real-time Updates möglich
- ✅ Einfach auf Multi-User erweiterbar
