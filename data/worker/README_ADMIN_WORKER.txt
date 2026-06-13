R96 ADMIN WORKER · CONFIGURACIÓN

Este Worker es el backend real para:
1. Solicitar código privado por correo.
2. Verificar correo + código de administrador + código privado.
3. Mantener el código privado fuera del HTML/JS público.

ARCHIVOS:
- worker/admin-worker.js
- js/admin-config.js
- admin.html
- js/admin.js

VARIABLES DEL WORKER:
ADMIN_EMAILS=tu@email.com,otroadmin@email.com
ADMIN_MASTER_CODE=pon-tu-codigo-admin
PRIVATE_CODE_SECRET=una-frase-secreta-larga
PRIVATE_CODE_TTL_SECONDS=900
SITE_ORIGIN=https://tuusuario.github.io
ADMIN_PAGE_URL=https://tuusuario.github.io/tu-repo/admin.html
RESEND_API_KEY=tu-api-key-de-resend
RESEND_FROM=RISIN96AMES <admin@tudominio.com>

KV:
Crea un KV namespace y enlázalo como:
ADMIN_CODES

ENDPOINTS:
POST /request-admin-code
body:
{
  "email": "admin@email.com",
  "adminCode": "codigo-admin",
  "redirectUrl": "https://tuweb/admin.html"
}

POST /verify-admin-login
body:
{
  "email": "admin@email.com",
  "adminCode": "codigo-admin",
  "privateCode": "R96-000000"
}

FRONTEND:
Cuando tengas la URL del Worker, abre js/admin-config.js y pega:
window.R96_ADMIN_API_URL = "https://tu-worker.tuusuario.workers.dev";

IMPORTANTE:
El código de administrador ya no queda dentro de js/admin.js.
El código privado nunca queda fijo en el frontend.
