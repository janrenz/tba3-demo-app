# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.1.0] — 2026-05-05

### Added
- React 19 + Vite SPA for TBA3 VERA test data visualization
- Competence level distribution charts (Recharts)
- Item statistics charts
- Multi-level navigation (Group / School / State)
- Filters: subject, grade level, gender, language
- PDF, ZIP, QR code export
- LTI OAuth callback (`api/lti-callback.js`)
- MCP server integration (SSE via nginx proxy at `/mcp`)
- Docker deployment (main app + MCP server in single image via supervisord)
- GHCR CI/CD for both Docker images
- MUNDO educational materials search integration
