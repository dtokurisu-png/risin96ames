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

## Stage 2 — Authentication

**Status: REBUILDING — 2.2.0 / login trigger only.**

The failed Headless OAuth implementation was completely removed before this rebuild.

Current scope is intentionally minimal:

- `src/auth/r96-login-trigger.js` only navigates the top-level browser to the R96 Wix page with `r96login=1`.
- `src/pages/Risin96ames.br8x2.js` on Wix owns the actual member login using Wix native member APIs.
- After the native login finishes or is cancelled, Wix returns to clean `/blank-9`.

Not present in 2.2.0:
- OAuthStrategy
- PKCE
- Google SDK/API code
- callback pages
- local token storage
- popup windows
- iframe account-state bridge
- role or developer logic
- Nexo backend/session code

Account state display is deliberately postponed until this login path is confirmed working.

## Stage boundaries

1. **Visual — LOCKED.**
2. **Authentication — REBUILDING.**
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.
