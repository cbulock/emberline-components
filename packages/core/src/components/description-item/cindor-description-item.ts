import { css, html, LitElement } from "lit";

/**
 * Term-and-value pair used inside {@link CindorDescriptionList}.
 *
 * @slot term - Label for the value.
 * @slot - Value content.
 */
export class CindorDescriptionItem extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    .term {
      color: var(--fg-muted);
      font-size: var(--text-label-size);
      font-weight: var(--text-label-weight);
      line-height: var(--text-label-leading);
    }

    .detail {
      color: var(--fg);
    }
  `;

  protected override render() {
    return html`
      <dt class="term" part="term"><slot name="term"></slot></dt>
      <dd class="detail" part="detail"><slot></slot></dd>
    `;
  }
}
