R96 ADMIN WORKER · FLUJO POR EMAIL

Flujo correcto:
1. El usuario escribe su correo electrónico.
2. Presiona "Solicitar tu código privado".
3. El Worker envía un código privado temporal a ese correo.
4. El usuario lee su email y pega el código.
5. Entra al panel con correo + código privado.

Ya NO existe:
- Código de administrador.
- Lista de correos autorizados obligatoria.
- ADMIN_EMAILS.

VARIABLES DEL WORKER:
PRIVATE_CODE_SECRET=una-frase-secreta-larga
PRIVATE_CODE_TTL_SECONDS=900
SITE_ORIGIN=https://tuusuario.github.io
ADMIN_PAGE_URL=https://tuusuario.github.io/tu-repo/admin.html
RESEND_API_KEY=tu-api-key-de-resend
RESEND_FROM=RISIN96GAMES <admin@tudominio.com>

KV:
Crea un KV namespace y enlázalo como:
ADMIN_CODES

FRONTEND:
Cuando tengas la URL del Worker, abre js/admin-config.js y pega:
window.R96_ADMIN_API_URL = "https://tu-worker.tuusuario.workers.dev";

NOTA:
Este flujo permite acceso a quien pueda recibir el código en el correo que escribió.
