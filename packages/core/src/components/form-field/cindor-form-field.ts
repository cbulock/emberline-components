import { css, html, LitElement, nothing } from "lit";

export class CindorFormField extends LitElement {
  private static readonly visuallyHiddenStyles = [
    "position:absolute",
    "inline-size:1px",
    "block-size:1px",
    "padding:0",
    "margin:-1px",
    "overflow:hidden",
    "clip:rect(0 0 0 0)",
    "white-space:nowrap",
    "border:0"
  ].join(";");

  static styles = css`
    :host {
      display: grid;
      gap: var(--space-2);
      width: var(--cindor-field-inline-size, min(100%, 320px));
      max-width: 100%;
      min-width: 0;
      color: var(--fg);
    }

    .label-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-1);
      min-width: 0;
    }

    label {
      color: var(--fg);
      font-size: var(--text-label-size);
      font-weight: var(--text-label-weight);
      line-height: var(--text-label-leading);
    }

    .required {
      color: var(--danger);
    }

    .control {
      min-width: 0;
      --cindor-field-inline-size: 100%;
    }

    .control ::slotted(*) {
      box-sizing: border-box;
      display: block;
      width: 100% !important;
      min-width: 0;
      max-width: 100% !important;
    }
  `;

  static properties = {
    description: { reflect: true },
    error: { reflect: true },
    label: { reflect: true },
    required: { type: Boolean, reflect: true },
    validationError: { attribute: false }
  };

  private static nextId = 0;

  description = "";
  error = "";
  label = "";
  required = false;
  validationError = "";

  private readonly fieldId = `cindor-form-field-${CindorFormField.nextId++}`;
  private hasDescriptionSlot = false;
  private hasErrorSlot = false;
  private hasLabelSlot = false;

  protected override render() {
    const hasLabel = this.label !== "" || this.hasLabelSlot;
    const hasDescription = this.description !== "" || this.hasDescriptionSlot;
    const hasError = this.error !== "" || this.validationError !== "" || this.hasErrorSlot;

    return html`
      ${hasLabel
        ? html`
            <div class="label-row" part="label-row">
              <label part="label">
                ${this.hasLabelSlot ? html`<slot name="label" @slotchange=${this.handleLabelSlotChange}></slot>` : this.label}
              </label>
              ${this.required ? html`<span class="required" part="required-indicator" aria-hidden="true">*</span>` : nothing}
            </div>
          `
        : html`<slot name="label" hidden @slotchange=${this.handleLabelSlotChange}></slot>`}
      <div class="control" part="control">
        <slot @slotchange=${this.handleControlSlotChange}></slot>
      </div>
      ${hasDescription
        ? html`
            <div part="description">
              ${this.hasDescriptionSlot
                ? html`<slot name="description" @slotchange=${this.handleDescriptionSlotChange}></slot>`
                : this.description}
            </div>
          `
        : html`<slot name="description" hidden @slotchange=${this.handleDescriptionSlotChange}></slot>`}
      ${hasError
        ? html`
              <div part="error">
               ${this.hasErrorSlot ? html`<slot name="error" @slotchange=${this.handleErrorSlotChange}></slot>` : this.error || this.validationError}
              </div>
            `
         : html`<slot name="error" hidden @slotchange=${this.handleErrorSlotChange}></slot>`}
      <slot name="a11y-mirror" hidden></slot>
    `;
  }

  protected override updated(): void {
    this.syncControlAssociations();
  }

  private handleControlSlotChange = (): void => {
    this.syncControlAssociations();
  };

  private handleDescriptionSlotChange = (): void => {
    this.hasDescriptionSlot = this.getAssignedElements("description").length > 0;
    this.syncControlAssociations();
  };

  private handleErrorSlotChange = (): void => {
    this.hasErrorSlot = this.getAssignedElements("error").length > 0;
    this.syncControlAssociations();
  };

  private handleLabelSlotChange = (): void => {
    this.hasLabelSlot = this.getAssignedElements("label").length > 0;
    this.syncControlAssociations();
  };

  private syncControlAssociations(): void {
    const control = this.controlElement;
    if (!control) {
      return;
    }

    if (!control.id) {
      control.id = `${this.fieldId}-control`;
    }

    const labelElement = this.renderRoot.querySelector("label");
    if (labelElement instanceof HTMLLabelElement) {
      if (this.isLabelableControl(control)) {
        labelElement.htmlFor = control.id;
      } else {
        labelElement.removeAttribute("for");
      }
    }

    const labelMirrorId = this.syncA11yMirror("label", this.getPartText("label"));
    const descriptionMirrorId = this.syncA11yMirror("description", this.getPartText("description"));
    const errorMirrorId = this.syncA11yMirror("error", this.getPartText("error"));
    const describedBy = [];
    if (descriptionMirrorId) {
      describedBy.push(descriptionMirrorId);
    }
    if (errorMirrorId) {
      describedBy.push(errorMirrorId);
    }

    this.syncManagedTokens(control, "aria-labelledby", labelMirrorId ? [labelMirrorId] : []);
    this.syncManagedTokens(control, "aria-describedby", describedBy);
  }

  private getAssignedElements(slotName?: string): HTMLElement[] {
    const selector = slotName ? `slot[name="${slotName}"]` : "slot:not([name])";
    const slot = this.renderRoot.querySelector(selector);
    if (!(slot instanceof HTMLSlotElement)) {
      return [];
    }

    return slot.assignedElements({ flatten: true }).filter((element): element is HTMLElement => element instanceof HTMLElement);
  }

  private syncManagedTokens(control: HTMLElement, attributeName: "aria-describedby" | "aria-labelledby", managedTokens: string[]): void {
    const managedTokenSet = new Set([this.labelMirrorId, this.descriptionMirrorId, this.errorMirrorId]);
    const existingTokens = (control.getAttribute(attributeName) ?? "")
      .split(/\s+/)
      .filter((token) => token !== "" && !managedTokenSet.has(token));

    const tokens = [...existingTokens, ...managedTokens];

    if (tokens.length === 0) {
      control.removeAttribute(attributeName);
      return;
    }

    control.setAttribute(attributeName, Array.from(new Set(tokens)).join(" "));
  }

  private isLabelableControl(control: HTMLElement): control is
    | HTMLButtonElement
    | HTMLInputElement
    | HTMLMeterElement
    | HTMLOutputElement
    | HTMLProgressElement
    | HTMLSelectElement
    | HTMLTextAreaElement {
    return (
      control instanceof HTMLButtonElement ||
      control instanceof HTMLInputElement ||
      control instanceof HTMLMeterElement ||
      control instanceof HTMLOutputElement ||
      control instanceof HTMLProgressElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement
    );
  }

  private get controlElement(): HTMLElement | null {
    return this.getAssignedElements()[0] ?? null;
  }

  private getPartText(part: "description" | "error" | "label"): string {
    return (this.renderRoot.querySelector(`[part="${part}"]`)?.textContent ?? "").replace(/\s+/g, " ").trim();
  }

  private syncA11yMirror(kind: "description" | "error" | "label", text: string): string | null {
    const selector = `[slot="a11y-mirror"][data-cindor-form-field-a11y="${kind}"]`;
    const existingMirror = this.querySelector(selector);

    if (text === "") {
      existingMirror?.remove();
      return null;
    }

    const mirror = existingMirror instanceof HTMLSpanElement ? existingMirror : document.createElement("span");
    mirror.slot = "a11y-mirror";
    mirror.dataset.cindorFormFieldA11y = kind;
    mirror.id =
      kind === "label" ? this.labelMirrorId : kind === "description" ? this.descriptionMirrorId : this.errorMirrorId;
    mirror.setAttribute("aria-hidden", "true");
    mirror.setAttribute("style", CindorFormField.visuallyHiddenStyles);
    mirror.textContent = text;

    if (mirror.parentElement !== this) {
      this.append(mirror);
    }

    return mirror.id;
  }

  private get descriptionMirrorId(): string {
    return `${this.fieldId}-description-mirror`;
  }

  private get errorMirrorId(): string {
    return `${this.fieldId}-error-mirror`;
  }

  private get labelMirrorId(): string {
    return `${this.fieldId}-label-mirror`;
  }
}
