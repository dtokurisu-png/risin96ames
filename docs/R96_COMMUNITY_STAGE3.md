# Risin9 6ames — Community Stage 3

Estado: **frontend publicado / backend implementado en repositorio / publicación Wix pendiente por fallo de runner**

Fecha: 2026-10-12

## Alcance

Community Stage 3 añade:

- respuestas en hilo sobre comentarios;
- reportes privados de reseñas y comentarios;
- cola de reportes para propietario del juego/Wonder.

## Hilos

Los comentarios reutilizan el campo canónico existente `parentCommentId`.

No existe una segunda colección de respuestas.

La UI v3:

- muestra `Responder`;
- envía `parentCommentId` al crear la respuesta;
- renderiza recursivamente la conversación;
- conserva Editar/Eliminar sólo para el autor;
- si un comentario padre deja de estar visible, sus respuestas visibles pueden seguir apareciendo como raíces huérfanas en vez de perderse.

## Reportes

Colección Wix privada:

`R96CommunityReports`

Motivos:

- spam;
- acoso;
- contenido ofensivo;
- spoiler no señalado;
- suplantación;
- otro.

Reglas:

- sólo miembros autenticados pueden reportar;
- no se puede reportar contenido propio;
- una cuenta no puede mantener dos reportes abiertos sobre el mismo aporte;
- el reportante no se expone al moderador;
- el feed público no contiene reportes.

## Moderación

Propietario/Wonder recibe en el panel:

- reportes pendientes;
- resueltos;
- descartados;
- motivo;
- detalle;
- referencia al aporte afectado.

Acciones:

- Resolver;
- Descartar.

Cerrar un reporte no cambia automáticamente el texto ni el estado del aporte. Ocultar/Restaurar sigue siendo una decisión separada.

## Frontend

Módulo:

`src/games/r96-community-ui.js?v=3.0.0`

GitHub Pages publicó la UI v3 correctamente.

## Backend

Código implementado y presente en `main` Wix:

- `createR96CommunityReportWithCapability()`;
- `resolveR96CommunityReportWithCapability()`;
- extensión de `moderation.feed`;
- acciones HTTP `report.create` y `report.resolve`.

La colección `R96CommunityReports` fue creada directamente en Wix CMS.

La publicación de Velo desde GitHub Actions permanece pendiente porque los jobs están terminando en failure sin iniciar steps. No se declara backend publicado hasta que ese pipeline vuelva a ejecutar.
