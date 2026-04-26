import "../../register.js";

import { EmbCheckbox } from "./emb-checkbox.js";

describe("emb-checkbox", () => {
  it("syncs checked state from the native checkbox", async () => {
    const element = document.createElement("emb-checkbox") as EmbCheckbox;
    document.body.append(element);
    await element.updateComplete;

    const input = element.renderRoot.querySelector("input");
    expect(input).not.toBeNull();

    input!.checked = true;
    input!.dispatchEvent(new Event("change", { bubbles: true }));
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });
});
