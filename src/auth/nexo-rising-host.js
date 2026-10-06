(() => {
  'use strict';
  const PATH = '/my-site-1/blank-9';
  if (location.pathname.replace(/\/+$/, '') !== PATH || window.__nexoRisingHost) return;
  window.__nexoRisingHost = true;
  const ORIGIN = 'https://dtokurisu-png.github.io';
  const frame = document.createElement('iframe');
  frame.id = 'nexo-rising-app';
  frame.title = 'Rising Games · Nexo Group';
  frame.src = ORIGIN + '/risin96ames/?v=4.0.0';
  frame.referrerPolicy = 'no-referrer';
  frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100dvh;border:0;z-index:100;background:#070912';
  let requestId = 0, sequence = 0, member = null, status = 'connecting', consumed = '', exchanging = false;
  let started = Date.now();
  // Reserve the actual Wix banner height instead of placing the header behind it.
  function positionFrame() {
    const banner = document.getElementById('WIX_ADS');
    const rect = banner?.getBoundingClientRect();
    const offset = rect && rect.width > 0 && rect.height > 0 ? Math.max(0, Math.ceil(rect.bottom)) : 0;
    const top = offset + 'px';
    if (frame.style.top !== top) {
      frame.style.top = top;
      frame.style.height = 'calc(100dvh - ' + top + ')';
    }
  }
  function send() {
    if (!requestId) return;
    frame.contentWindow.postMessage({source:'r96-wix-auth',protocol:1,requestId,sequence:++sequence,status,member}, ORIGIN);
  }
  function goLogin() {
    const url = new URL(location.href);
    ['nxb','nxa','nxav','nexoReturn'].forEach(k=>url.searchParams.delete(k));
    url.searchParams.set('nexoAuth','login');
    location.assign(url.href);
  }
  function receive(event) {
    if (event.source !== frame.contentWindow || event.origin !== ORIGIN) return;
    const d = event.data;
    if (!d || d.source !== 'r96-auth' || d.protocol !== 1 || !Number.isSafeInteger(d.requestId)) return;
    requestId = d.requestId;
    if (d.type === 'r96-account-action' && d.action === 'login') { goLogin(); return; }
    if (d.type === 'r96-account-ready') send();
  }
  async function poll() {
    if (location.pathname.replace(/\/+$/, '') !== PATH) { cleanup(); return; }
    positionFrame();
    const q = new URLSearchParams(location.search);
    const state = q.get('nxa');
    // Native Wix login remains visible above the product. No simulated login UI.
    frame.style.visibility = state === 'LOGIN' ? 'hidden' : 'visible';
    if (state === 'SIGNED_OUT') { status = 'signedOut'; member = null; }
    else if (state === 'FAILED') { status = 'error'; member = null; }
    else if (state === 'LOGIN') status = 'signingIn';
    else if (state === 'READY' && q.get('nxb') && q.get('nxb') !== consumed && !exchanging) {
      const token = q.get('nxb'); consumed = token; exchanging = true;
      // Remove one-use boot credential immediately. Never send it to the iframe.
      const clean = new URL(location.href); clean.searchParams.delete('nxb');
      history.replaceState(history.state, '', clean.href);
      try {
        const controller = new AbortController();
        const deadline = setTimeout(()=>controller.abort(),15000);
        let response;
        try { response = await fetch('/my-site-1/_functions/nexoRisingUi', {
          method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',
          body:JSON.stringify({action:'exchange',bootToken:token}),signal:controller.signal
        }); } finally { clearTimeout(deadline); }
        const data = await response.json();
        if (!response.ok || !data.ok || !data.member?.id) throw new Error('AUTH_REQUIRED');
        member = data.member; status = 'signedIn';
      } catch (_) { status = 'error'; member = null; }
      finally { exchanging = false; }
    } else if (status === 'connecting' && Date.now()-started > 25000) status = 'error';
    send();
  }
  function cleanup() {
    clearInterval(timer); window.removeEventListener('message',receive);
    window.removeEventListener('resize', positionFrame);
    frame.remove(); window.__nexoRisingHost = false;
  }
  window.addEventListener('message',receive);
  window.addEventListener('pagehide',cleanup,{once:true});
  positionFrame();
  window.addEventListener('resize', positionFrame);
  document.body.appendChild(frame);
  const timer = setInterval(poll,500);
  poll();
})();
