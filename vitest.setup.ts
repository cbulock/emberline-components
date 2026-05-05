import { afterEach } from "vitest";

import "./packages/core/src/register.ts";

afterEach(() => {
  document.body.innerHTML = "";
});
