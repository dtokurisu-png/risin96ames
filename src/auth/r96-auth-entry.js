import {
  bootstrapAuth,
  exposeAuthInterface
} from "./r96-auth-core.js";

import {
  mountAuthUi
} from "./r96-auth-ui.js";

async function start() {
  exposeAuthInterface();
  mountAuthUi();
  await bootstrapAuth();
}

start().catch((error) => {
  console.error("[R96 auth] bootstrap failed", error);
});
