# R96 architecture

## Rule zero

R96 is developed as an independent product. It must not import, modify, call, or depend on Mi Espacio, Nexo Group runtime code, Numa, Nexo CMS collections, Nexo session helpers, or any legacy R96 implementation.

## Stage 1 — Visual layer

Current state: active.

Files:
- `index.html`: semantic page composition only.
- `src/visual/r99-visual.css`: visual tokens, layout, responsive rules, light/dark appearance.
- `src/visual/r99-visual.js`: visual-only interactions: theme toggle and navigation menu.

Forbidden in Stage 1:
- authentication;
- member/session APIs;
- Wix SDK or Velo;
- backend endpoints;
- CMS/data fetching;
- developer roles;
- invitations;
- game upload;
- game persistence;
- analytics;
- external runtime dependencies.

The visible login controls are intentionally inert placeholders.

## Stage boundaries

Each functional stage must live in its own module directory and interact with previously frozen stages only through a documented interface. A completed stage is treated as locked: later work should not rewrite its internal implementation unless a defect in that stage is explicitly reopened.

Planned sequence:
1. Visual.
2. Authentication.
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.

No later module exists yet.
