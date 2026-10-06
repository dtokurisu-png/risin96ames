# R96 architecture

## Rule zero

R96 is developed as an independent product. It must not import, modify, call, or depend on Mi Espacio, Nexo Group runtime code, Numa, Nexo CMS collections, Nexo session helpers, or any legacy R96 implementation.

## Stage 1 — Visual

**Status: LOCKED — 1.0.0.**

Canonical visual files:
- `index.html`
- `src/visual/r96-visual.css`
- `src/visual/r96-visual.js`
- `src/visual/r96-yester-symbols.svg`

## Stage 2 — Authentication

**Status: REBUILT FROM CLEAN BASELINE — 3.0.0 candidate.**

There is exactly one R96 auth frontend file:

- `src/auth/r96-native-auth.js`

Its only responsibilities are:
- request the current Wix member state;
- request native Wix login;
- render signed-out / signing-in / signed-in state in the existing visual account controls.

There is no URL navigation in R96 authentication.

The Wix page adapter is:
- `src/pages/Risin96ames.br8x2.js`

Its only responsibilities are:
- `currentMember.getMember()`;
- `authentication.promptLogin()`;
- send the normalized member state to the R96 HTML Component.

Explicitly absent:
- hardcoded Wix page paths;
- `r96login`, `r96state`, `r96ab` query parameters;
- OAuthStrategy / Headless OAuth;
- PKCE;
- callback pages;
- custom Google code;
- token storage;
- backend auth/session helpers;
- Nexo/Mi Espacio auth code;
- developer authorization and invitations.

## Stage boundaries

1. **Visual — LOCKED.**
2. **Authentication — ACTIVE.**
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.
