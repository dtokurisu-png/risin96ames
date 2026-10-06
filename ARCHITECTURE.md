# Rising Games · Nexo Group

Decisión vigente 2026-10-06: cuenta universal Nexo para todos los productos. Sustituye la separación de cuentas solicitada anteriormente. La identidad es Wix Members del sitio Nexo; los permisos de cada producto se autorizan en backend de forma independiente.

## Acceso 4.0.0

- URL canónica: https://dtokurisu.wixstudio.com/my-site-1/blank-9
- GitHub Pages aloja la interfaz. El acceso directo lleva al sitio canónico.
- Un solo Custom Embed carga src/auth/nexo-rising-host.js. Este monta el iframe visual; no intenta conectarlo como un HtmlComponent de Velo.
- El botón solicita navegación nativa a la misma página con nexoAuth=login. El código Velo abre authentication.promptLogin. La ventana nativa queda visible mientras el producto se oculta temporalmente.
- Wix Members reutiliza la misma cuenta y sesión de Mi Espacio y de los demás productos del sitio.
- nexo-rising-entry.web.js exige Permissions.SiteMember. Emite un boot de un uso ligado a rising con el servicio Nexo existente. El bridge del mismo origen lo canjea, recibe únicamente identidad pública y revoca la credencial transitoria. El iframe no recibe tokens ni correo.
- No se interpreta un ID, nombre o parámetro de URL como autorización. El estado visual no autoriza operaciones. Publicar juegos/administrar sigue pendiente de la siguiente etapa y requerirá autorización backend.
- Origen y ventana de postMessage verificados en ambos extremos; sin comodines, con ID de solicitud y secuencia. Sin almacenamiento de credenciales en localStorage.
- Logo: bytes exactos del PNG proporcionado por el usuario, src/visual/nexo-group-logo.png.

## Corrección de despliegue

El repositorio Wix estaba fijado al diseño 403, que omitía Rising. Se recuperó el diseño guardado 435 y se alinea wix.config.json con esa revisión observada. Mantener la revisión sincronizada cuando se edite la estructura en Wix Studio.

## Verificación

Pruebas automatizadas de recuperación, timeout, mensajes falsificados/obsoletos, sesión existente, concurrencia y rutas internas. Una prueba automatizada no demuestra un login real con Google. La validación con credenciales del usuario queda separada.
