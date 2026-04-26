import "../../register.js";

import { EmbInput } from "./emb-input.js";

describe("emb-input", () => {
  it("syncs host value from the native input element", async () => {
    const element = document.createElement("emb-input") as EmbInput;
    document.body.append(element);
    await element.updateComplete;

    const input = element.renderRoot.querySelector("input");
    expect(input).not.toBeNull();

    input!.value = "hello";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    await element.updateComplete;

    expect(element.value).toBe("hello");
  });
});
