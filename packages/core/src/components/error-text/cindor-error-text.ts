import { css, html, LitElement } from "lit";

export class CindorErrorText extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: var(--danger);
      font-size: var(--text-helper-size);
      font-weight: var(--text-helper-weight);
      line-height: var(--text-helper-leading);
    }
  `;

  protected override render() {
    return html`<span role="alert" aria-live="polite"><slot></slot></span>`;
  }
}
