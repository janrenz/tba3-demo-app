# Definition of Done

Jeder Feature-PR gilt als fertig, wenn **alle** folgenden Punkte erfüllt sind.
Claude Code Agent arbeitet diese Checkliste sequenziell ab und fügt sie als Markdown-Checklist in den PR-Body ein.

---

## ✅ Funktionalität

- [ ] Alle Akzeptanzkriterien aus dem Spec-Ticket implementiert
- [ ] Kein offener Stub ohne explizites `// TODO(@review): ...`

## ✅ Code-Qualität

- [ ] `npm run lint` grün
- [ ] `npm run build` grün (keine Build-Fehler)

## ✅ Tests

- [ ] E2E-Test (Playwright) für jeden **Happy Path** — Selektoren nur via `data-testid`
- [ ] E2E-Test für relevante **Fehlerfälle** (Validierung, Netzwerkfehler)
- [ ] Unit-Test für reine Utility-/Hook-Logik ohne UI-Äquivalent
- [ ] Alle Tests lokal grün

> Playwright noch nicht konfiguriert? Richte es als Teil der Implementierung ein:
> `npx playwright install` → Konfiguration anpassen → ersten Test schreiben.

## ✅ Screenshots im PR

Für jede geänderte oder neue UI-Seite / UI-Komponente:

1. Dev-Server starten: `npm run dev &` — warten bis Port antwortet
2. Playwright-Screenshot erstellen
3. Screenshots committen: `docs/screenshots/{identifier}/`
4. Im PR-Body einbetten

Pflicht-Screenshots:
- [ ] Normalzustand (Happy Path)
- [ ] Fehlerzustand (falls vorhanden)
- [ ] Mobil-Ansicht bei Layout-Änderungen

## ✅ Housekeeping

- [ ] Spec-Ticket archiviert: `docs/tasks/todo/{slug}.md` → `docs/tasks/archived/{slug}.md`
- [ ] `docs/CHANGELOG.md` aktualisiert
- [ ] Alle neuen UI-Komponenten haben `data-testid`-Attribute

## ✅ Pull Request

- [ ] Draft-PR gegen `main`, Titel: `{prefix}({identifier}): {Feature-Titel}`
- [ ] PR-Body enthält: DoD-Checkliste (Status jedes Punktes), Link zu Issue, Screenshots
- [ ] `Closes #{issue_number}` im PR-Body

---

## Absolutes Verbot

- PR selbst mergen
- Direkt auf `main` pushen
- Committen ohne grünes `npm run lint && npm run build`
- UI-Komponenten ohne `data-testid` anlegen
- Bei Unklarheiten raten statt im PR-Kommentar fragen
