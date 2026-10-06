# R96 architecture

## Scope

R96 source code is independent of Mi Espacio, Numa, Nexo runtime helpers and CMS. Native Wix Members sessions are site-scoped: code separation alone does not create a separate login identity. See AUTH_REPAIR.md for the unresolved independent-site requirement.

## Stage 1 — Visual

Visual layout remains in index.html and src/visual/. Existing theme, menu, SVG assets and card layout are preserved. Authentication uses the existing account and hero controls, stable element IDs and an accessible status message.

## Stage 2 — Authentication

Status: 3.1.0 candidate; controlled tests pass, publication and live login are pending.

Exactly one frontend: src/auth/r96-native-auth.js.
Exactly one page adapter: src/pages/Risin96ames.br8x2.js in the Wix repo.
Exactly one real Wix HTML Component: #r96App. Never inject a replacement iframe with Custom Code.

The page adapter owns native Wix login and the real member state. The iframe owns presentation only. Messages have a fixed origin, protocol, request ID and increasing sequence. Missing responses time out with a retry, cancellations restore both buttons, and late state replies cannot overwrite newer operations.

No OAuth, PKCE, custom Google code, token storage, callback pages, redirects, global scripts or Nexo authentication helpers. No developer authorization, invitations or backend access is implemented at this stage. Displaying a member is not authorization.

See AUTH_REPAIR.md before merging or publishing. Do not publish the old pinned Wix UI 403.
