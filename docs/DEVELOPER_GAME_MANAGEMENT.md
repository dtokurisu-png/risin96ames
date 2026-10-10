# Risin9 6ames — Estado de publicación y gestión de desarrollador

Fecha de checkpoint: 2026-10-09

## Estado confirmado por prueba real

Los siguientes bloques ya fueron probados y no deben reabrirse salvo regresión comprobada:

- Inicio de sesión y sesión de usuario.
- Flujo de publicación de juegos HTML.
- Selección y carga de archivos.
- Publicación de un juego.
- Ficha pública del juego: portada, nombre, información y botón **Jugar**.
- Ejecución mediante **Jugar**.
- Biblioteca / catálogo: el juego publicado aparece correctamente.
- No existe flujo de descarga: Risin9 6ames ejecuta los juegos HTML desde la plataforma.

Nota: los dos juegos usados en prueba presentan bloqueos propios del contenido/juego. Eso no se considera un fallo del flujo de publicación de Risin9 6ames.

## Pendiente canónico

### Etapa siguiente — Gestión de versiones

Objetivo: permitir al creador mantener un juego publicado sin reemplazar destructivamente la versión anterior.

Modelo recomendado:

- Un **Game** representa la identidad estable del juego.
- Cada publicación de archivos crea una **GameVersion** inmutable.
- El juego mantiene un puntero a una sola versión activa.
- Una versión nueva no elimina la anterior.
- El creador puede activar una versión anterior para rollback.
- Los archivos de una versión publicada no se editan en sitio; cualquier cambio de archivos crea una versión nueva.
- Los cambios de metadatos del juego (nombre, descripción, portada, visibilidad) no necesitan crear una versión binaria/HTML nueva.
- El botón **Jugar** siempre resuelve la versión activa.

Estados mínimos de versión:
- uploading
- validating
- ready
- active
- archived
- failed

Datos mínimos por versión:
- versionId interno automático
- gameId
- versionLabel visible
- createdAt
- createdBy
- entryFile
- files/location
- status
- releaseNotes
- publishedAt

Reglas:
- Solo una versión puede estar activa por juego.
- Activar otra versión desactiva la anterior de forma atómica.
- No borrar físicamente una versión publicada desde la UI normal.
- Rollback = cambiar activeVersionId; no volver a subir archivos.
- Una versión failed nunca puede ser activada.

### Etapa posterior — Espacio del desarrollador

Crear un área privada donde el desarrollador vea únicamente sus juegos y pueda:

- Ver todos sus juegos publicados.
- Abrir la administración de cada juego.
- Editar nombre, descripción, portada y otros metadatos públicos.
- Cambiar visibilidad/estado.
- Ver la versión activa.
- Ver historial de versiones.
- Publicar una actualización.
- Escribir notas de versión.
- Activar una versión anterior.
- Previsualizar cómo se ve la ficha para el usuario.

### Etapa posterior — Permisos

Autorización en backend, nunca confiando en el estado visual:

- El creador puede administrar únicamente juegos donde ownerMemberId coincida con su identidad autorizada.
- Un desarrollador no puede editar, publicar versiones ni cambiar visibilidad de juegos ajenos.
- El fundador/administrador conserva autorización administrativa global según la política de Risin9 6ames.
- Todas las operaciones de edición, publicación, activación y rollback deben revalidar permisos en backend.

### QA final

Flujo a validar al completar estas etapas:

inicio de sesión → espacio de desarrollador → seleccionar juego propio → editar ficha → publicar versión nueva → activar versión → jugar → rollback → jugar versión anterior → verificar rechazo al intentar administrar juego ajeno.

## Regla de implementación

No reescribir ni parchear módulos ya validados para añadir esta funcionalidad. La gestión de desarrollador/versiones debe construirse como módulo separado y conectarse mediante contratos claros con publicación, catálogo y ejecución.
