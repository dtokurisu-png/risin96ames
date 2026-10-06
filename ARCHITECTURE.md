# R96 architecture

## Rule zero

R96 is developed as an independent product. It must not import, modify, call, or depend on Mi Espacio, Nexo Group runtime code, Numa, Nexo CMS collections, Nexo session helpers, or any legacy R96 implementation.

## Stage 1 — Visual layer

**Status: LOCKED — release 1.0.0.**

Canonical files:
- `index.html`: semantic page composition only.
- `src/visual/r96-visual.css`: visual tokens, layout, responsive rules, light/dark appearance.
- `src/visual/r96-visual.js`: visual-only interactions: theme toggle and navigation menu.
- `src/visual/r96-yester-symbols.svg`: canonical vector lettering generated from the supplied YESTER typeface for the R96 mark, Risin9 6ames wordmark, and cyan/purple accent labels.

Stage 1 contains no authentication, member/session API, Wix SDK/Velo code, backend endpoint, CMS/data fetch, role logic, invitation logic, game persistence, analytics, iframe messaging, or network request.

The visible account/login controls are intentionally inert visual placeholders.

## Stage boundaries

Each functional stage must live in its own module directory and communicate with a locked stage only through a documented interface. Later stages must not rewrite Stage 1 internals unless a visual defect is explicitly reopened.

Planned sequence:
1. **Visual — LOCKED.**
2. Authentication.
3. Authorization / roles.
4. Developer invitations.
5. Game project and build management.
6. Reviews / sessions / community features.

## Wix boundary

The R96 implementation remains independent from Mi Espacio and Nexo. Any Wix integration added in later stages must be R96-specific and must not reuse Nexo authentication, Nexo session helpers, Nexo CMS collections, or Nexo page runtime code.
