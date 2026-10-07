(() => {
  "use strict";

  if (window.__r96AccessUi) return;
  window.__r96AccessUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_BRIDGE = "r96-access-bridge";
  const SOURCE_UI = "r96-access-ui";
  const PROTOCOL = 1;
  const BUTTON_ID = "r96-invite-developer";

  let access = {
    signedIn: false,
    roleKey: "visitor",
    canInviteDeveloper: false,
    isDeveloper: false,
    isWonder: false
  };

  function ensureStyle() {
    if (document.getElementById("r96-access-ui-style")) return;

    const style = document.createElement("style");
    style.id = "r96-access-ui-style";
    style.textContent = `
      #${BUTTON_ID}{
        width:100%;
        padding:11px 12px;
        border:0;
        border-radius:10px;
        background:transparent;
        color:var(--r96-muted);
        font:inherit;
        font-size:.84rem;
        font-weight:800;
        text-align:left;
        cursor:pointer;
        transition:color .18s ease,background .18s ease;
      }
      #${BUTTON_ID}:hover{
        color:var(--r96-text);
        background:var(--r96-panel);
      }
    `;
    document.head.appendChild(style);
  }

  function render() {
    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    let button = document.getElementById(BUTTON_ID);

    if (access.isWonder !== true) {
      button?.remove();
      return;
    }

    ensureStyle();

    if (button) return;

    button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Invitar desarrollador";
    button.setAttribute("aria-label", "Invitar desarrollador");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    panel.appendChild(button);
  }

  function postReady() {
    if (window.parent === window) return;
    window.parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type: "ready"
    }, HOST_ORIGIN);
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== HOST_ORIGIN || event.source !== window.parent) return;

    const message = event.data;
    if (!message || message.source !== SOURCE_BRIDGE || message.protocol !== PROTOCOL) return;
    if (message.type !== "access") return;

    const data = message.data || {};
    access = {
      signedIn: data.signedIn === true,
      roleKey: String(data.roleKey || "visitor"),
      canInviteDeveloper: data.canInviteDeveloper === true,
      isDeveloper: data.isDeveloper === true,
      isWonder: data.isWonder === true
    };

    render();
  });

  render();
  postReady();

  let attempts = 0;
  const retry = setInterval(() => {
    attempts += 1;
    postReady();
    if (attempts >= 8) clearInterval(retry);
  }, 1000);
})();
