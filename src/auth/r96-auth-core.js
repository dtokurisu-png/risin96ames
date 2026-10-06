import {
  R96_AUTH_CONFIG
} from "./r96-auth-config.js?v=2.1.1";

const listeners = new Set();

let state = Object.freeze({
  status: "booting",
  member: null,
  error: null
});

let readyTimer = null;
let bound = false;

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

  return () => listeners.delete(listener);
}

function parentOrigin() {
  try {
    if (document.referrer) {
      return new URL(document.referrer).origin;
    }
  } catch (_) {}

  return "*";
}

function postToHost(payload) {
  try {
    if (window.parent === window) return false;

    window.parent.postMessage(
      {
        source: "r96-auth",
        release: R96_AUTH_CONFIG.release,
        ...payload
      },
      parentOrigin()
    );

    return true;
  } catch (_) {
    return false;
  }
}

function handleHostMessage(event) {
  if (event.source !== window.parent) return;

  const expected = parentOrigin();
  if (expected !== "*" && event.origin !== expected) return;

  const message = event.data || {};
  if (message.source !== "r96-wix-auth-host") return;

  if (message.type === "state") {
    if (message.status === "signedIn" && message.member) {
      emit({
        status: "signedIn",
        member: message.member,
        error: null
      });
      return;
    }

    if (message.status === "signingIn") {
      emit({
        status: "signingIn",
        member: null,
        error: null
      });
      return;
    }

    if (message.status === "signingOut") {
      emit({
        status: "signingOut",
        member: state.member,
        error: null
      });
      return;
    }

    emit({
      status: "signedOut",
      member: null,
      error: null
    });
    return;
  }

  if (message.type === "error") {
    emit({
      status: "error",
      member: null,
      error: String(
        message.message ||
        "No se pudo completar el inicio de sesión."
      )
    });
  }
}

function bindHostBridge() {
  if (bound) return;
  bound = true;
  window.addEventListener("message", handleHostMessage);
}

function announceReady() {
  let attempts = 0;

  const send = () => {
    attempts += 1;

    postToHost({
      type: "ready"
    });

    if (
      state.status === "booting" &&
      attempts < 14
    ) {
      readyTimer = setTimeout(send, 500);
    }
  };

  send();
}

export async function bootstrapAuth() {
  bindHostBridge();

  emit({
    status: "booting",
    member: null,
    error: null
  });

  announceReady();

  setTimeout(() => {
    if (state.status === "booting") {
      emit({
        status: "error",
        member: null,
        error:
          "No se pudo conectar con el adaptador de autenticación de Wix."
      });
    }
  }, 9000);

  return state;
}

export async function signInWithGoogle() {
  const ok = postToHost({
    type: "action",
    action: "login"
  });

  if (!ok) {
    return emit({
      status: "error",
      member: null,
      error: "R96 debe abrirse desde su página de Wix para iniciar sesión."
    });
  }

  return emit({
    status: "signingIn",
    member: null,
    error: null
  });
}

export async function signOut() {
  const ok = postToHost({
    type: "action",
    action: "logout"
  });

  if (!ok) {
    return emit({
      status: "error",
      member: state.member,
      error: "No se pudo conectar con Wix para cerrar sesión."
    });
  }

  return emit({
    status: "signingOut",
    member: state.member,
    error: null
  });
}

export function exposeAuthInterface() {
  window.R96Auth = Object.freeze({
    getState: getAuthState,
    subscribe: subscribeAuth,
    signIn: signInWithGoogle,
    signOut
  });
}
