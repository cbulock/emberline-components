import { css, html, LitElement } from "lit";

export class CindorSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      color: var(--accent);
    }

    span {
      position: relative;
      inline-size: 16px;
      block-size: 16px;
      border-radius: 50%;
      border: 2px solid color-mix(in srgb, currentColor 20%, transparent);
      border-top-color: currentColor;
      animation: cindor-spinner-rotate 0.7s linear infinite;
    }

    :host-context([data-theme='retro']) span,
    :host-context([data-theme='retro-light']) span {
      inline-size: 18px;
      block-size: 18px;
      border: 0;
      border-radius: 0;
      background: color-mix(in srgb, currentColor 14%, transparent);
      box-shadow: inset 0 0 0 2px currentColor;
      animation: none;
    }

    :host-context([data-theme='retro']) span::before,
    :host-context([data-theme='retro-light']) span::before {
      content: "";
      position: absolute;
      inset: 2px;
      background:
        linear-gradient(currentColor 0 0) top left / 100% 4px no-repeat,
        linear-gradient(currentColor 0 0) top left / 4px 100% no-repeat;
      animation: cindor-spinner-pixel-rotate 0.8s steps(4, end) infinite;
      transform-origin: center;
    }

    :host-context([data-theme='retro']) span::before {
      filter: drop-shadow(0 0 4px currentColor);
    }

    @keyframes cindor-spinner-rotate {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes cindor-spinner-pixel-rotate {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  protected override render() {
    return html`<span part="indicator" aria-hidden="true"></span>`;
  }
}
