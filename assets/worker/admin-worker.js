export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(env);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      if (request.method !== "POST") {
        return json({ ok: false, message: "Método no permitido." }, 405, corsHeaders);
      }

      if (url.pathname === "/request-admin-code") {
        return await requestAdminCode(request, env, corsHeaders);
      }

      if (url.pathname === "/verify-admin-login") {
        return await verifyAdminLogin(request, env, corsHeaders);
      }

      return json({ ok: false, message: "Ruta no encontrada." }, 404, corsHeaders);
    } catch (error) {
      return json({ ok: false, message: error.message || "Error interno." }, 500, corsHeaders);
    }
  }
};

function getCorsHeaders(env) {
  const origin = env.SITE_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers
  });
}

async function requestBody(request) {
  try {
    return await request.json();
  } catch (error) {
    throw new Error("JSON inválido.");
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function allowedEmails(env) {
  return String(env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

function isAllowedEmail(email, env) {
  return allowedEmails(env).includes(normalizeEmail(email));
}

function assertAdminCode(adminCode, env) {
  if (!env.ADMIN_MASTER_CODE) {
    throw new Error("ADMIN_MASTER_CODE no está configurado.");
  }

  if (String(adminCode || "") !== String(env.ADMIN_MASTER_CODE)) {
    throw new Error("Código de administrador incorrecto.");
  }
}

function makePrivateCode() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const number = ((bytes[0] << 16) + (bytes[1] << 8) + bytes[2]) % 1000000;
  return `R96-${String(number).padStart(6, "0")}`;
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function codeHash(email, code, env) {
  const secret = env.PRIVATE_CODE_SECRET || "change-this-secret";
  return sha256(`${secret}:${normalizeEmail(email)}:${String(code || "").trim()}`);
}

function buildRedirectUrl(inputUrl, email, privateCode) {
  const fallback = inputUrl || "";
  try {
    const url = new URL(fallback);
    url.searchParams.set("adminEmail", email);
    url.searchParams.set("privateCode", privateCode);
    return url.toString();
  } catch (error) {
    return fallback;
  }
}

async function requestAdminCode(request, env, corsHeaders) {
  if (!env.ADMIN_CODES) {
    throw new Error("KV ADMIN_CODES no está enlazado.");
  }

  const body = await requestBody(request);
  const email = normalizeEmail(body.email);
  const adminCode = body.adminCode;
  const redirectUrl = body.redirectUrl || env.ADMIN_PAGE_URL || "";

  if (!email) {
    throw new Error("Correo electrónico obligatorio.");
  }

  if (!isAllowedEmail(email, env)) {
    throw new Error("Este correo no está autorizado como administrador.");
  }

  assertAdminCode(adminCode, env);

  const privateCode = makePrivateCode();
  const hash = await codeHash(email, privateCode, env);
  const expiresIn = Number(env.PRIVATE_CODE_TTL_SECONDS || 900);
  const key = `admin-code:${email}`;

  await env.ADMIN_CODES.put(key, JSON.stringify({
    hash,
    createdAt: Date.now()
  }), {
    expirationTtl: expiresIn
  });

  await sendPrivateCodeEmail({
    email,
    privateCode,
    link: buildRedirectUrl(redirectUrl, email, privateCode),
    env
  });

  return json({
    ok: true,
    message: "Código privado enviado."
  }, 200, corsHeaders);
}

async function verifyAdminLogin(request, env, corsHeaders) {
  if (!env.ADMIN_CODES) {
    throw new Error("KV ADMIN_CODES no está enlazado.");
  }

  const body = await requestBody(request);
  const email = normalizeEmail(body.email);
  const adminCode = body.adminCode;
  const privateCode = String(body.privateCode || "").trim();

  if (!email || !adminCode || !privateCode) {
    throw new Error("Correo, código de administrador y código privado son obligatorios.");
  }

  if (!isAllowedEmail(email, env)) {
    throw new Error("Este correo no está autorizado como administrador.");
  }

  assertAdminCode(adminCode, env);

  const key = `admin-code:${email}`;
  const storedRaw = await env.ADMIN_CODES.get(key);

  if (!storedRaw) {
    throw new Error("Código privado vencido o inexistente. Solicita uno nuevo.");
  }

  const stored = JSON.parse(storedRaw);
  const incomingHash = await codeHash(email, privateCode, env);

  if (incomingHash !== stored.hash) {
    throw new Error("Código privado incorrecto.");
  }

  await env.ADMIN_CODES.delete(key);

  const sessionToken = await sha256(`${email}:${Date.now()}:${crypto.randomUUID()}:${env.PRIVATE_CODE_SECRET || ""}`);

  return json({
    ok: true,
    message: "Acceso autorizado.",
    sessionToken
  }, 200, corsHeaders);
}

async function sendPrivateCodeEmail({ email, privateCode, link, env }) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no está configurado.");
  }

  const from = env.RESEND_FROM || "RISIN96AMES <admin@risin96ames.com>";
  const subject = "Tu código privado de administrador R96";

  const text = [
    "Este es tu código privado para entrar al panel administrador:",
    "",
    privateCode,
    "",
    "Este código vence pronto.",
    "",
    link ? `Entrar al panel: ${link}` : ""
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#101828">
      <h2>Tu código privado de administrador</h2>
      <p>Este es tu código privado para entrar al panel administrador:</p>
      <p style="font-size:26px;font-weight:800;letter-spacing:2px">${privateCode}</p>
      <p>Este código vence pronto.</p>
      ${link ? `<p><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#00ffdf;color:#050812;text-decoration:none;font-weight:800">Entrar al panel</a></p>` : ""}
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: email,
      subject,
      text,
      html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No se pudo enviar el correo: ${errorText}`);
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
