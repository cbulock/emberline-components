import { EmbButton } from "./components/button/emb-button.js";
import { EmbCheckbox } from "./components/checkbox/emb-checkbox.js";
import { EmbInput } from "./components/input/emb-input.js";

const definitions = [
  ["emb-button", EmbButton],
  ["emb-input", EmbInput],
  ["emb-checkbox", EmbCheckbox]
] as const;

export function registerEmberlineUi(): void {
  for (const [tagName, elementClass] of definitions) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, elementClass);
    }
  }
}

registerEmberlineUi();
