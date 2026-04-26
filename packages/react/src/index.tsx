import * as React from "react";
import { createComponent } from "@lit/react";

import { EmbButton as EmbButtonElement, EmbCheckbox as EmbCheckboxElement, EmbInput as EmbInputElement } from "emberline-ui-core";
import "emberline-ui-core/register";

export const EmbButton = createComponent({
  react: React,
  tagName: "emb-button",
  elementClass: EmbButtonElement
});

export const EmbInput = createComponent({
  react: React,
  tagName: "emb-input",
  elementClass: EmbInputElement,
  events: {
    onChange: "change",
    onInput: "input"
  }
});

export const EmbCheckbox = createComponent({
  react: React,
  tagName: "emb-checkbox",
  elementClass: EmbCheckboxElement,
  events: {
    onChange: "change",
    onInput: "input"
  }
});
