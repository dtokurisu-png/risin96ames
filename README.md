# R96

Clean rebuild of the game-development platform.

## Current state

- **Stage 1 — Visual: LOCKED (1.0.0).**
- **Stage 2 — Authentication: ACTIVE (2.0.3 candidate).**

Authentication is implemented as a separate Headless OAuth module under `src/auth/`. It uses a dedicated R96 OAuth client and does not reuse Mi Espacio/Nexo session code.

Current sign-in provider: Google through Wix-managed OAuth.

See `ARCHITECTURE.md` for the isolation rules and stage boundaries.
