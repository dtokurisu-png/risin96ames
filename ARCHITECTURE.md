# R96 architecture

## Rule zero

R96 is developed as an independent product. It must not import, modify, call, or depend on Mi Espacio, Nexo Group runtime code, Numa, Nexo CMS collections, Nexo session helpers, or any legacy R96 implementation.

## Stage 1 — Visual layer

**Status: LOCKED — release 1.0.0.**

Canonical files:
- `index.html`
- `src/visual/r96-visual.css`
- `src/visual/r96-visual.js`
- `src/visual/r96-yester-symbols.svg`

The account and login controls are visual placeholders while Stage 2 is reset.

## Stage 2 — Authentication

**Status: RESET / CLEAN BASELINE.**

All previous R96 authentication experiments have been removed:
- Headless OAuth client integration
- PKCE state
- Google-specific OAuth code
- callback/logout pages
- token storage
- popup/web_message flows
- previous iframe auth bridge

The next implementation must be built from this clean baseline and remain page-local to R96 on Wix.

## Stage boundaries

1. **Visual — LOCKED.**
2. **Authentication — RESET.**
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.
