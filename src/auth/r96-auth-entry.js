import {
  bootstrapAuth,
  exposeAuthInterface
} from "./r96-auth-core.js?v=2.1.0";

import {
  mountAuthUi
} from "./r96-auth-ui.js?v=2.1.0";

async function start() {
  exposeAuthInterface();
  mountAuthUi();
  await bootstrapAuth();
}

start().catch((error) => {
  console.error("[R96 auth] bootstrap failed", error);
});
