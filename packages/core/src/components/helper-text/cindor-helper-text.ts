import { css, html, LitElement } from "lit";

export class CindorHelperText extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: var(--fg-muted);
      font-size: var(--text-helper-size);
      font-weight: var(--text-helper-weight);
      line-height: var(--text-helper-leading);
    }
  `;

  protected override render() {
    return html`<slot></slot>`;
  }
}
