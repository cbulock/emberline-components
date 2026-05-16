import { css, html, LitElement } from "lit";

export type BadgeTone = "neutral" | "accent" | "success";

export class CindorBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 1.75rem;
      max-width: 100%;
      padding: 0.125rem var(--space-2);
      border-radius: var(--radius-full);
      border: 1px solid var(--border);
      background: var(--bg-subtle);
      color: var(--fg);
      box-sizing: border-box;
      font-family: var(--font-mono);
      font-size: var(--text-caption-size);
      font-weight: var(--weight-semibold);
      line-height: var(--text-caption-leading);
      letter-spacing: var(--tracking-mono);
      text-transform: uppercase;
      white-space: normal;
      overflow-wrap: anywhere;
      text-align: center;
    }

    :host([tone="accent"]) span {
      border-color: var(--accent);
      background: var(--accent-muted);
      color: var(--accent);
    }

    :host([tone="success"]) span {
      border-color: color-mix(in srgb, var(--success) 45%, var(--border));
      background: color-mix(in srgb, var(--success) 14%, transparent);
      color: var(--success);
    }
  `;

  static properties = {
    tone: { reflect: true }
  };

  tone: BadgeTone = "neutral";

  protected override render() {
    return html`
      <span part="label">
        <slot></slot>
      </span>
    `;
  }
}
