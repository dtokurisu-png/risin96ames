# R96 architecture

## Rule zero

R96 is developed as an independent product. It must not import, modify, call, or depend on Mi Espacio, Nexo Group runtime code, Numa, Nexo CMS collections, Nexo session helpers, or any legacy R96 implementation.

## Stage 1 — Visual layer

**Status: LOCKED — release 1.0.0.**

Canonical files:
- `index.html`: semantic page composition and module inclusion points.
- `src/visual/r96-visual.css`: visual tokens, layout, responsive rules, light/dark appearance.
- `src/visual/r96-visual.js`: visual-only interactions: theme toggle and navigation menu.
- `src/visual/r96-yester-symbols.svg`: canonical vector lettering generated from the supplied YESTER typeface.

Stage 1 internals remain locked. Stage 2 may only attach behavior to the existing account/login controls through its own module.

## Stage 2 — Authentication

**Status: ACTIVE — 2.0.0 candidate.**

Authentication is isolated under `src/auth/` and uses a dedicated Wix Headless OAuth client named **R96 Headless Auth**.

Files:
- `src/auth/r96-auth-config.js`: public client/site identifiers and R96-only URLs/storage keys.
- `src/auth/r96-auth-core.js`: OAuth state, token lifecycle, Google sign-in, current-member retrieval, logout.
- `src/auth/r96-auth-ui.js`: adapter between auth state and the locked Stage 1 account controls.
- `src/auth/r96-auth-entry.js`: Stage 2 bootstrap only.
- `src/auth/r96-auth.css`: authentication-specific account menu/avatar states.
- `auth/callback.html`: OAuth callback and token exchange.
- `auth/logout.html`: R96 auth-storage cleanup and return path.

Public contract:
- `window.R96Auth.getState()`
- `window.R96Auth.subscribe(listener)`
- `window.R96Auth.signIn()`
- `window.R96Auth.signOut()`
- browser event `r96:auth-state`

Storage namespace:
- `r96.auth.tokens.v1`
- `r96.auth.oauth.v1`
- `r96.auth.return.v1`

Stage 2 does **not** use Nexo sessions, Nexo backend methods, Nexo CMS, Wix page-member state, postMessage bridges, or R96 legacy authentication.

## Stage boundaries

Each functional stage lives in its own module directory and communicates with locked stages only through documented interfaces.

Planned sequence:
1. **Visual — LOCKED.**
2. **Authentication — ACTIVE.**
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.

## Wix boundary

R96 uses its own Wix Headless OAuth client. This creates an R96-specific session flow even though the identity is a Wix site member. No Mi Espacio/Nexo runtime authentication code is reused.
