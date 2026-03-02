# TBA3 Demo App - Quick Start Guide

## 🚀 Schnellstart

### 1. Mock Server starten

**Problem mit Python 3.14**: Der Mock Server hat aktuell Kompatibilitätsprobleme mit Python 3.14. Verwende Python 3.11 oder 3.12.

```bash
# Terminal 1 - Mock Server
cd ../tba3-repo/mock-server

# Option A: Mit UV (empfohlen, falls installiert)
uv run uvicorn server:app --reload --port 8000

# Option B: Mit Python 3.11/3.12 venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

Warte bis du siehst:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 2. Frontend Dev Server starten

```bash
# Terminal 2 - Frontend
cd demo-app
npm install  # Falls noch nicht geschehen
npm run dev

# Oder verwende das Startup-Script:
./start.sh
```

**Wichtig**: Tailwind CSS v3 wird verwendet (nicht v4). Falls Fehler auftreten:
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3.4.19
```

### 3. App öffnen

Öffne deinen Browser: **http://localhost:5175** (oder den Port den Vite anzeigt)

---

## 📊 Features im Überblick

### Verfügbare Ansichten

1. **Kompetenzstufen-Verteilung**
   - Balkendiagramm mit 5 Stufen (I-V)
   - Summary-Statistiken (Gesamt, Unter/Über Standard)
   - Farbcodiert (Rot=niedrig, Grün=hoch)

2. **Item-Statistiken**
   - Horizontales Balkendiagramm
   - Lösungshäufigkeiten pro Item
   - Hover für Metadaten (IQB-Parameter)

3. **Aggregationen** _(in Entwicklung)_

### Navigation

**Ebenen-Auswahl** (Sidebar oben):
- **Gruppe**: Einzelne Klassen (z.B. "3a Deutsch")
- **Schule**: Aggregierte Schuldaten
- **Bundesland**: Landesdaten

**Filter**:
- **Fach**: Deutsch, Mathematik, Englisch, Französisch
- **Klassenstufe**: V3 (Klasse 3), V8 (Klasse 8)
- **Datentyp**: Gruppe, Schüler*innen, Beide

### Verfügbare Testdaten

**19 Gruppen**:
- V3: 3a/3b/3c Deutsch, 3a/3b/3c Mathe
- V8: 8a/8b/8c/8d Deutsch, Englisch, Französisch, Mathe

**2 Schulen**:
- Grundschule Musterstadt
- Gymnasium Beispielstadt

**1 Bundesland**:
- Beispielland

---

## 🛠️ Entwicklung

### Projekt-Struktur

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Dashboard
│   ├── charts/          # CompetenceLevelsChart, ItemStatisticsChart
│   ├── common/          # Card, LoadingSkeleton, ErrorMessage
│   └── filters/         # (noch leer)
├── hooks/               # useCompetenceLevels, useItems
├── services/            # tba3Api (Axios client)
├── utils/               # constants, formatters, dataTransformers
├── context/             # FilterContext (Global State)
└── App.jsx              # Main App
```

### Neue Features hinzufügen

1. **Neue Chart-Komponente**:
   ```bash
   # Erstelle Komponente
   src/components/charts/MeinChart.jsx

   # Erstelle Hook für Daten
   src/hooks/useMeineDaten.js

   # Füge zu Dashboard hinzu
   src/components/layout/Dashboard.jsx
   ```

2. **Neuen Filter hinzufügen**:
   ```bash
   # Erweitere FilterContext
   src/context/FilterContext.jsx

   # Füge UI in Sidebar hinzu
   src/components/layout/Sidebar.jsx
   ```

---

## 🐛 Troubleshooting

### Mock Server startet nicht

**Fehler**: `AssertionError` oder `TypeError: _eval_type()`

**Lösung**: Python 3.14 wird nicht unterstützt. Verwende Python 3.11 oder 3.12:
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

### Frontend zeigt "Fehler beim Laden"

**Prüfe**:
1. Läuft der Mock Server? → `curl http://localhost:8000/groups/3a-deutsch/competence-levels`
2. Vite Proxy korrekt? → Siehe `vite.config.js`
3. Browser-Console → Netzwerk-Tab prüfen

### Tailwind Styles werden nicht angewendet

**Lösung**: Tailwind v3 muss installiert sein:
```bash
npm install -D tailwindcss@^3 postcss autoprefixer
```

### Build schlägt fehl

**Fehler**: `Cannot apply unknown utility class`

**Lösung**: Stelle sicher, dass Tailwind v3 (nicht v4) installiert ist:
```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3
```

---

## 📈 Nächste Schritte

1. **Aggregationen implementieren** → Siehe BACKLOG.md
2. **Mehr Filter hinzufügen** (Gender, Sprache)
3. **Export-Funktionen** (CSV, PDF)
4. **Tests schreiben** (Vitest, Cypress)

---

## 💡 Tipps

- **Hot Reload**: Änderungen werden automatisch neu geladen
- **React DevTools**: Installiere die Browser-Extension für besseres Debugging
- **Network Tab**: Prüfe API-Requests im Browser
- **BACKLOG.md**: Füge Feature-Requests hinzu

---

## 📞 Support

Bei Problemen:
1. Prüfe die Browser-Console
2. Prüfe Terminal-Output (beide Server)
3. Siehe README.md für Details
4. Siehe BACKLOG.md für geplante Features
