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

Stage 1 remains locked.

## Stage 2 — Authentication

**Status: ACTIVE — 2.1.0 candidate.**

R96 authentication uses the Wix page as the identity host and the R96 iframe as a presentation client.

### R96 iframe module

Files:
- `src/auth/r96-auth-config.js`
- `src/auth/r96-auth-core.js`
- `src/auth/r96-auth-ui.js`
- `src/auth/r96-auth-entry.js`
- `src/auth/r96-auth.css`

The iframe never owns Wix credentials or Wix member tokens. It only sends:
- `ready`
- `login`
- `logout`

and receives:
- `signedOut`
- `signingIn`
- `signedIn + member`
- `signingOut`
- `error`

### Wix host module

The single R96 custom embed on the Wix page owns authentication. It uses Wix site-member APIs directly and is isolated from Mi Espacio/Nexo code.

No Headless OAuth, PKCE, callback page, custom R96 token, Nexo session, or Nexo CMS is part of Stage 2.

## Stage boundaries

1. **Visual — LOCKED.**
2. **Authentication — ACTIVE.**
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.
