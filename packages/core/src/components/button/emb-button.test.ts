import "../../register.js";

import { EmbButton } from "./emb-button.js";

describe("emb-button", () => {
  it("renders a native button and forwards text content", async () => {
    const element = document.createElement("emb-button") as EmbButton;
    element.textContent = "Save";
    document.body.append(element);
    await element.updateComplete;

    const button = element.renderRoot.querySelector("button");
    const slot = element.renderRoot.querySelector("slot");

    expect(button).not.toBeNull();
    expect(slot).not.toBeNull();
    expect(element.textContent?.trim()).toBe("Save");
    expect(button?.getAttribute("type")).toBe("button");
  });
});
