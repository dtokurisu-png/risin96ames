import {
  createClient,
  OAuthStrategy
} from "https://esm.sh/@wix/sdk@1.21.16";

import {
  members
} from "https://esm.sh/@wix/members@1.0.525";

import {
  R96_AUTH_CONFIG
} from "./r96-auth-config.js";

const listeners = new Set();

let popupWindow = null;
let popupWatch = null;

let state = Object.freeze({
  status: "booting",
  member: null,
  error: null
});

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
}

function loadTokens() {
  try {
    return safeParse(localStorage.getItem(R96_AUTH_CONFIG.tokenStorageKey));
  } catch (_) {
    return null;
  }
}

function saveTokens(tokens) {
  try {
    localStorage.setItem(
      R96_AUTH_CONFIG.tokenStorageKey,
      JSON.stringify(tokens)
    );
  } catch (_) {}
}

function loadOAuthData() {
  try {
    return safeParse(localStorage.getItem(R96_AUTH_CONFIG.oauthStorageKey));
  } catch (_) {
    return null;
  }
}

function saveOAuthData(oauthData) {
  localStorage.setItem(
    R96_AUTH_CONFIG.oauthStorageKey,
    JSON.stringify(oauthData)
  );
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(R96_AUTH_CONFIG.tokenStorageKey);
    localStorage.removeItem(R96_AUTH_CONFIG.oauthStorageKey);
    localStorage.removeItem(R96_AUTH_CONFIG.returnStorageKey);
  } catch (_) {}
}

const initialTokens = loadTokens();

const auth = OAuthStrategy({
  clientId: R96_AUTH_CONFIG.clientId,
  siteId: R96_AUTH_CONFIG.siteId,
  ...(initialTokens ? { tokens: initialTokens } : {})
});

const wixClient = createClient({
  modules: { members },
  auth
});

function emit(next) {
  state = Object.freeze({
    status: next.status,
    member: next.member || null,
    error: next.error || null
  });

  for (const listener of listeners) {
    try {
      listener(state);
    } catch (_) {}
  }

  window.dispatchEvent(
    new CustomEvent("r96:auth-state", {
      detail: state
    })
  );

  return state;
}

export function getAuthState() {
  return state;
}

export function subscribeAuth(listener) {
  listeners.add(listener);
  listener(state);

  return () => {
    listeners.delete(listener);
  };
}

function memberName(member) {
  const nickname = String(member?.profile?.nickname || "").trim();
  const firstName = String(member?.contact?.firstName || "").trim();
  const lastName = String(member?.contact?.lastName || "").trim();
  const email = String(member?.loginEmail || "").trim();

  return (
    nickname ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    email.split("@")[0] ||
    "Mi cuenta"
  );
}

function memberPhoto(member) {
  return String(
    member?.profile?.photo?.url ||
    member?.contact?.picture ||
    ""
  ).trim();
}

function normalizeMember(member) {
  return {
    id: String(member?._id || member?.id || "").trim(),
    displayName: memberName(member),
    email: String(member?.loginEmail || "").trim(),
    photoUrl: memberPhoto(member)
  };
}

async function loadCurrentMember() {
  const response = await wixClient.members.getCurrentMember({
    fieldsets: ["FULL"]
  });

  const member = response?.member || response;

  if (!member) {
    throw new Error("R96_MEMBER_NOT_FOUND");
  }

  return normalizeMember(member);
}

async function emitSignedInMember() {
  const member = await loadCurrentMember();

  return emit({
    status: "signedIn",
    member,
    error: null
  });
}

export async function bootstrapAuth() {
  emit({
    status: "booting",
    member: null,
    error: null
  });

  if (!auth.loggedIn()) {
    return emit({
      status: "signedOut",
      member: null,
      error: null
    });
  }

  try {
    return await emitSignedInMember();
  } catch (_) {
    clearAuthStorage();

    return emit({
      status: "signedOut",
      member: null,
      error: null
    });
  }
}

function isEmbedded() {
  try {
    return window.self !== window.top;
  } catch (_) {
    return true;
  }
}

function resolveReturnUrl() {
  if (isEmbedded()) {
    return R96_AUTH_CONFIG.wixPageUrl;
  }

  return R96_AUTH_CONFIG.appUrl;
}

function navigateTop(url) {
  try {
    window.top.location.href = url;
    return;
  } catch (_) {}

  window.location.href = url;
}

function stopPopupWatch() {
  if (popupWatch) {
    clearInterval(popupWatch);
    popupWatch = null;
  }
}

function startPopupWatch() {
  stopPopupWatch();

  popupWatch = setInterval(() => {
    if (!popupWindow || !popupWindow.closed) return;

    stopPopupWatch();
    popupWindow = null;

    if (state.status === "signingIn") {
      emit({
        status: "signedOut",
        member: null,
        error: null
      });
    }
  }, 500);
}

async function exchangeOAuthResult(payload) {
  const storedOAuth = loadOAuthData();

  if (!storedOAuth) {
    throw new Error("R96_OAUTH_DATA_MISSING");
  }

  if (payload?.error) {
    throw new Error(
      payload.errorDescription ||
      payload.error ||
      "R96_OAUTH_PROVIDER_ERROR"
    );
  }

  if (!payload?.code || !payload?.state) {
    throw new Error("R96_OAUTH_CALLBACK_INVALID");
  }

  if (String(payload.state) !== String(storedOAuth.state)) {
    throw new Error("R96_OAUTH_STATE_MISMATCH");
  }

  const tokens = await auth.getMemberTokens(
    payload.code,
    payload.state,
    storedOAuth
  );

  auth.setTokens(tokens);
  saveTokens(tokens);

  try {
    localStorage.removeItem(R96_AUTH_CONFIG.oauthStorageKey);
    localStorage.removeItem(R96_AUTH_CONFIG.returnStorageKey);
  } catch (_) {}

  stopPopupWatch();
  popupWindow = null;

  return emitSignedInMember();
}

export async function completePopupCallback(payload) {
  try {
    return await exchangeOAuthResult(payload);
  } catch (error) {
    emit({
      status: "error",
      member: null,
      error: "No se pudo completar el inicio de sesión con Google."
    });

    throw error;
  }
}

export async function signInWithGoogle() {
  emit({
    status: "signingIn",
    member: null,
    error: null
  });

  let authPopup = null;

  try {
    const embedded = isEmbedded();
    const returnUrl = resolveReturnUrl();

    if (embedded) {
      authPopup = window.open(
        "about:blank",
        "r96-google-auth",
        "popup=yes,width=520,height=720,resizable=yes,scrollbars=yes"
      );

      if (!authPopup) {
        throw new Error("R96_AUTH_POPUP_BLOCKED");
      }

      authPopup.document.title = "R96 · Iniciar sesión";
      authPopup.document.body.innerHTML =
        '<p style="font-family:system-ui;padding:24px">Abriendo Google…</p>';

      popupWindow = authPopup;
      startPopupWatch();
    }

    const oauthData = auth.generateOAuthData(
      R96_AUTH_CONFIG.callbackUrl,
      returnUrl
    );

    saveOAuthData(oauthData);
    localStorage.setItem(
      R96_AUTH_CONFIG.returnStorageKey,
      returnUrl
    );

    const { authUrl } = await auth.getAuthUrl(oauthData, {
      idp: "google",
      prompt: "login",
      responseMode: "fragment"
    });

    if (embedded && authPopup && !authPopup.closed) {
      authPopup.location.replace(authUrl);
      return;
    }

    window.location.href = authUrl;
  } catch (error) {
    stopPopupWatch();

    try {
      authPopup?.close();
    } catch (_) {}

    popupWindow = null;

    emit({
      status: "error",
      member: null,
      error:
        error?.message === "R96_AUTH_POPUP_BLOCKED"
          ? "El navegador bloqueó la ventana de Google. Permite ventanas emergentes para R96 e inténtalo de nuevo."
          : "No se pudo iniciar el acceso con Google."
    });

    throw error;
  }
}

export async function completeOAuthCallback() {
  const parsed = auth.parseFromUrl();
  const returnUrl =
    localStorage.getItem(R96_AUTH_CONFIG.returnStorageKey) ||
    R96_AUTH_CONFIG.appUrl;

  await exchangeOAuthResult(parsed);

  return returnUrl;
}

export async function signOut() {
  emit({
    status: "signingOut",
    member: state.member,
    error: null
  });

  try {
    const result = await auth.logout(R96_AUTH_CONFIG.wixPageUrl);
    clearAuthStorage();

    if (result?.logoutUrl) {
      navigateTop(result.logoutUrl);
      return;
    }
  } catch (_) {
    clearAuthStorage();
  }

  navigateTop(R96_AUTH_CONFIG.wixPageUrl);
}

export function exposeAuthInterface() {
  window.R96Auth = Object.freeze({
    getState: getAuthState,
    subscribe: subscribeAuth,
    signIn: signInWithGoogle,
    signOut,
    completePopupCallback
  });
}
