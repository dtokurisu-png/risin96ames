const R96_RUNTIME_PREFIX = "/risin96ames/runtime/";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

function runtimeSessionFromPath(pathname) {
  const match = pathname.match(
    /^\/risin96ames\/runtime\/([^/]+)\//
  );
  return match ? match[1] : "";
}

async function cachedResponseFor(request, event) {
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return null;
  }

  if (url.pathname.startsWith(R96_RUNTIME_PREFIX)) {
    return caches.match(request, { ignoreSearch: true });
  }

  if (!event.clientId) {
    return null;
  }

  const client = await self.clients.get(event.clientId);
  if (!client?.url) {
    return null;
  }

  const clientUrl = new URL(client.url);
  const session = runtimeSessionFromPath(clientUrl.pathname);

  if (!session) {
    return null;
  }

  const relativePath = url.pathname.replace(/^\/+/, "");
  if (!relativePath) {
    return null;
  }

  const mappedUrl = new URL(
    R96_RUNTIME_PREFIX +
      encodeURIComponent(session) +
      "/" +
      relativePath,
    self.location.origin
  );

  return caches.match(mappedUrl.href, { ignoreSearch: true });
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cached = await cachedResponseFor(
        event.request,
        event
      );

      if (cached) return cached;

      return fetch(event.request);
    })()
  );
});
