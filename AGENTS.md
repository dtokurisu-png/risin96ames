# Rising 96 Games development rules

Read `AUTH_LOCK.md` before touching authentication or account-session code.

## Authentication freeze
The owner locked the working Nexo Group authentication integration on 2026-10-06. The auth client, Wix host bridge, login/logout/switch-account behavior, and authentication-related markup are read-only unless the owner explicitly authorizes an auth unlock in the current task.

Do not use `[AUTH-UNLOCK-BY-OWNER]` without that explicit authorization.

Developer invitations, developer roles, dashboards, game publishing, and community features must be implemented separately and may only consume the already-authenticated Nexo member identity.

Restore branch: `locked/auth-stable-2026-10-06`.
