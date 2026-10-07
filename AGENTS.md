# Rising 96 Games development rules

Read `AUTH_LOCK.md` before touching authentication or account-session code.

## Authentication freeze
The current authentication baseline was validated again by the owner on 2026-10-07. Treat the login/logout/session path as read-only.
The owner locked the working Nexo Group authentication integration on 2026-10-06. The auth client, Wix host bridge, login/logout/switch-account behavior, and authentication-related markup are read-only unless the owner explicitly authorizes an auth unlock in the current task.

Do not use `[AUTH-UNLOCK-BY-OWNER]` without that explicit authorization.

All feature systems must remain separate from the frozen authentication implementation and may only consume the already-authenticated Nexo member identity.

Restore branch: `locked/auth-final-2026-10-07`.


## Regla canónica de desarrollo: sin parches acumulativos

Cuando una implementación falla, no se añaden capas, clones, fallbacks paralelos ni rutas duplicadas para ocultar el fallo.

Flujo obligatorio:
1. Identificar y documentar la causa raíz antes de modificar.
2. Decidir entre corregir el método canónico existente o retirarlo por completo y sustituirlo por uno nuevo.
3. Si se sustituye, eliminar el método anterior y todas sus rutas/cargadores/duplicados relacionados en la misma intervención cuando sea seguro.
4. Mantener una sola fuente canónica por responsabilidad.
5. Verificar publicación y regresión antes de declarar resuelto.
6. Si la corrección toca un área bloqueada, informar primero al propietario y obtener autorización explícita.

No dejar “parches temporales” permanentes. Un fallback solo puede existir si forma parte intencional del diseño canónico y está documentado como tal.


The lock instructions themselves are protected: do not weaken or remove `AUTH_LOCK.md`, this `AGENTS.md`, or `.github/workflows/auth-lock.yml` without explicit owner authorization.
