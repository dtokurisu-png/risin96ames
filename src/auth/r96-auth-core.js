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
    const member = await wixClient.members.getCurrentMember({
      fieldsets: ["FULL"]
    });

    return emit({
      status: "signedIn",
      member: normalizeMember(member),
      error: null
    });
  } catch (error) {
    clearAuthStorage();

    return emit({
      status: "signedOut",
      member: null,
      error: null
    });
  }
}

function resolveReturnUrl() {
  try {
    const referrer = String(document.referrer || "");

    if (
      referrer.startsWith("https://dtokurisu.wixstudio.com/") &&
      referrer.includes("/blank-9")
    ) {
      return R96_AUTH_CONFIG.wixPageUrl;
    }

    if (window.top === window && location.pathname.includes("/risin96ames")) {
      return R96_AUTH_CONFIG.appUrl;
    }
  } catch (_) {}

  return R96_AUTH_CONFIG.wixPageUrl;
}

function navigateTop(url) {
  try {
    const opened = window.open(url, "_top");
    if (opened !== null) return;
  } catch (_) {}

  try {
    window.top.location.href = url;
    return;
  } catch (_) {}

  window.location.href = url;
}

export async function signInWithGoogle() {
  emit({
    status: "signingIn",
    member: null,
    error: null
  });

  try {
    const returnUrl = resolveReturnUrl();

    const oauthData = auth.generateOAuthData(
      R96_AUTH_CONFIG.callbackUrl,
      returnUrl
    );

    localStorage.setItem(
      R96_AUTH_CONFIG.oauthStorageKey,
      JSON.stringify(oauthData)
    );
    localStorage.setItem(
      R96_AUTH_CONFIG.returnStorageKey,
      returnUrl
    );

    const { authUrl } = await auth.getAuthUrl(oauthData, {
      idp: "google",
      prompt: "login",
      responseMode: "fragment"
    });

    navigateTop(authUrl);
  } catch (error) {
    emit({
      status: "error",
      member: null,
      error: "No se pudo iniciar el acceso con Google."
    });

    throw error;
  }
}

export async function completeOAuthCallback() {
  const storedOAuth = safeParse(
    localStorage.getItem(R96_AUTH_CONFIG.oauthStorageKey)
  );

  if (!storedOAuth) {
    throw new Error("R96_OAUTH_DATA_MISSING");
  }

  const parsed = auth.parseFromUrl();

  if (parsed.error) {
    throw new Error(parsed.errorDescription || parsed.error);
  }

  if (!parsed.code || !parsed.state) {
    throw new Error("R96_OAUTH_CALLBACK_INVALID");
  }

  if (String(parsed.state) !== String(storedOAuth.state)) {
    throw new Error("R96_OAUTH_STATE_MISMATCH");
  }

  const tokens = await auth.getMemberTokens(
    parsed.code,
    parsed.state,
    storedOAuth
  );

  auth.setTokens(tokens);
  saveTokens(tokens);

  try {
    localStorage.removeItem(R96_AUTH_CONFIG.oauthStorageKey);
  } catch (_) {}

  return (
    localStorage.getItem(R96_AUTH_CONFIG.returnStorageKey) ||
    storedOAuth.originalUrl ||
    R96_AUTH_CONFIG.wixPageUrl
  );
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
    signOut
  });
}
