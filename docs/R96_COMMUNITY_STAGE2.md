# Risin9 6ames — Community Stage 2

Estado: **implementado y publicado técnicamente / QA humano pendiente**

Fecha: 2026-10-12

## Alcance

Community Stage 2 añade moderación visual al módulo público de Comunidad sin crear una segunda arquitectura.

El panel se muestra únicamente cuando el backend confirma que la cuenta autenticada es:

- propietaria real del juego seleccionado; o
- Wonder.

Ser Developer por sí solo no concede moderación sobre juegos ajenos.

## UI

Módulo activo:

`src/games/r96-community-ui.js?v=2.0.0`

La sección existente de Comunidad conserva:

- reseñas 1–5;
- comentarios;
- edición/eliminación de aportes propios;
- lectura pública.

Y añade, sólo para moderadores autorizados:

- botón `Moderación`;
- conteos de reseñas/comentarios visibles y ocultos;
- filtro por tipo: Todo / Reseñas / Comentarios;
- filtro por estado: Todos / Visibles / Ocultos;
- botón `Ocultar` para contenido visible;
- botón `Restaurar` para contenido oculto;
- identificación pública del autor;
- versión del juego asociada al aporte.

No existe control de edición del texto ajeno.

Contenido con estado `deleted` no aparece en moderación y no puede restaurarse desde este panel.

## Seguridad

La interfaz no decide permisos.

La UI intenta cargar `moderation.feed`; si el backend responde `COMMUNITY_MODERATION_REQUIRED`, el botón de Moderación no aparece.

Las mutaciones siguen usando la community capability temporal ya creada en Stage 1.

Autenticación Nexo sigue congelada y no fue modificada.
