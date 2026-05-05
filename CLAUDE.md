# CLAUDE.md — TBA3 Demo App

## Commands

```bash
npm run dev        # Dev server — http://localhost:5173
npm run build      # Production build → dist/
npm run lint       # ESLint
npm run preview    # Preview production build
```

**CI check (run before every commit):**
```bash
npm run lint && npm run build
```

## Architecture

React 19 + Vite SPA. No TypeScript yet (JSX). Package manager: npm.

### Source structure

```
src/
├── components/
│   ├── charts/        # Recharts-based visualizations
│   ├── common/        # Shared UI components
│   ├── filters/       # Filter controls
│   ├── layout/        # App shell (header, sidebar)
│   └── HelpView.jsx   # MCP connection docs
├── context/
│   └── FilterContext.jsx   # Global filter state
├── hooks/
│   ├── useAggregations.js
│   ├── useCompetenceLevels.js
│   └── useItems.js
├── services/
│   └── tba3Api.js     # API client (axios, proxied via Vite dev / vercel.json prod)
└── utils/             # Data transformers, formatters, export helpers
```

### MCP Server (`mcp-server/`)

Bundled into the main Docker image. Nginx proxies `/mcp` to the MCP server for SSE.
Separate Docker image is also built (`FWU-DE/tba3-demo-app-mcp`).

### API proxy

| Environment | Proxy config |
|---|---|
| Local dev | `vite.config.js` proxy rules |
| Vercel | `vercel.json` rewrites |
| Docker | nginx (`nginx.conf`) |

Backend: `https://apps.indibit.eu/tba3-api` (external, not in this repo).

### Deployment

Two targets:
- **Vercel** — static site + serverless `api/lti-callback.js`
- **Docker** — `Dockerfile` (main app + MCP server via supervisord + nginx)

## Key Conventions

- All new UI components must have `data-testid` attributes.
- API calls go through `src/services/tba3Api.js` — no direct `fetch`/`axios` in components.
- State lives in `FilterContext` — don't add new global state solutions without an ADR.
- No cascade operations — keep side effects explicit.

## Task Workflow

Task tickets live in `docs/tasks/todo/{slug}.md`. Pushing a new file there triggers the Claude Code agent via GitHub Actions. Full workflow: `skills/ai-first-webapp-gitops/01-requirements.md` (in FWU-DE/skills repo).
