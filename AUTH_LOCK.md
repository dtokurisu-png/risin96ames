# AUTHENTICATION LOCK — RISING 96 GAMES

Status: **LOCKED by owner instruction on 2026-10-06**.

The currently working Nexo Group sign-in integration is frozen. Do not alter the auth client, Wix host bridge, login/logout/switch-account behavior, or auth-related markup unless the owner explicitly unlocks authentication.

Protected restore branch: `locked/auth-stable-2026-10-06`.

Intentional override marker: `[AUTH-UNLOCK-BY-OWNER]`.
Do not use it without explicit owner authorization in the current task.

The developer-invitation system must be implemented separately. It may use an already-authenticated Nexo member identity and Rising role/permission data, but it must not change authentication.
