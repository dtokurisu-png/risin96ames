R96 ADMIN WORKER · CÓDIGO ADMIN ÚNICO

Código de administrador único actual:
R96-ADMIN-9633

Flujo:
1. El usuario escribe correo electrónico.
2. Escribe el código de administrador único.
3. Presiona "Solicitar tu código privado".
4. El Worker valida el código de administrador.
5. El Worker envía un código privado temporal al correo escrito.
6. El usuario entra con correo + código administrador + código privado.

VARIABLES DEL WORKER:
ADMIN_MASTER_CODE=R96-ADMIN-9633
PRIVATE_CODE_SECRET=una-frase-secreta-larga
PRIVATE_CODE_TTL_SECONDS=900
SITE_ORIGIN=https://tuusuario.github.io
ADMIN_PAGE_URL=https://tuusuario.github.io/tu-repo/admin.html
RESEND_API_KEY=tu-api-key-de-resend
RESEND_FROM=RISIN96AMES <admin@tudominio.com>

KV:
Crea un KV namespace y enlázalo como:
ADMIN_CODES

FRONTEND:
Cuando tengas la URL del Worker, abre js/admin-config.js y pega:
window.R96_ADMIN_API_URL = "https://tu-worker.tuusuario.workers.dev";

NOTA:
El código de administrador está en el Worker/configuración, no en js/admin.js.
