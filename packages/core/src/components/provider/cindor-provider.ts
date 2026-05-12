import { css, html, LitElement } from "lit";

import {
  derivePrimaryColorThemeTokens,
  normalizeThemeTokens,
  type ProviderResolvedTheme,
  type ProviderThemeTokens
} from "./provider-theme.js";

export type ProviderTheme = "inherit" | "light" | "dark";
export type ProviderColorScheme = "inherit" | "light" | "dark";
export {
  cindorAmethystTheme,
  cindorCobaltTheme,
  cindorEvergreenTheme,
  cindorOceanTheme,
  cindorRoseTheme,
  cindorThemePresets
} from "./provider-theme.js";
export type { ProviderThemePreset, ProviderThemeTokens } from "./provider-theme.js";

/**
 * Lightweight theme scope for Cindor tokens and descendant components.
 *
 * @slot - Descendant application or component content.
 */
export class CindorProvider extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
      color: var(--fg);
    }
  `;

  static properties = {
    colorScheme: { attribute: "color-scheme", reflect: true },
    darkThemeTokens: { attribute: false },
    lightThemeTokens: { attribute: false },
    primaryColor: { attribute: "primary-color", reflect: true },
    themeTokens: { attribute: false },
    theme: { reflect: true }
  };

  colorScheme: ProviderColorScheme = "inherit";
  darkThemeTokens: ProviderThemeTokens = {};
  lightThemeTokens: ProviderThemeTokens = {};
  primaryColor = "";
  themeTokens: ProviderThemeTokens = {};
  theme: ProviderTheme = "inherit";
  private readonly appliedThemeTokens = new Set<`--${string}`>();
  private readonly themeScopeObserver = new MutationObserver(() => {
    this.syncPresentation();
    this.syncThemeScopeObserver();
  });

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncThemeScopeObserver();
    this.syncPresentation();
  }

  override disconnectedCallback(): void {
    this.themeScopeObserver.disconnect();
    super.disconnectedCallback();
  }

  protected override updated(): void {
    this.syncPresentation();
    this.syncThemeScopeObserver();
  }

  protected override render() {
    return html`<slot></slot>`;
  }

  private syncPresentation(): void {
    if (this.theme === "inherit") {
      this.removeAttribute("data-theme");
    } else {
      this.setAttribute("data-theme", this.theme);
    }

    if (this.colorScheme === "inherit") {
      this.style.removeProperty("color-scheme");
    } else {
      this.style.setProperty("color-scheme", this.colorScheme);
    }

    this.applyThemeTokens(this.createThemeTokens(this.resolveEffectiveTheme()));
  }

  private createThemeTokens(theme: ProviderResolvedTheme): ProviderThemeTokens {
    return {
      ...derivePrimaryColorThemeTokens(this.primaryColor, theme),
      ...normalizeThemeTokens(this.themeTokens),
      ...normalizeThemeTokens(theme === "dark" ? this.darkThemeTokens : this.lightThemeTokens)
    };
  }

  private applyThemeTokens(tokens: ProviderThemeTokens): void {
    const nextTokenNames = new Set<`--${string}`>();

    for (const [tokenName, tokenValue] of Object.entries(tokens)) {
      if (typeof tokenValue !== "string") {
        continue;
      }

      const themeTokenName = tokenName as `--${string}`;
      nextTokenNames.add(themeTokenName);
      this.style.setProperty(themeTokenName, tokenValue);
    }

    for (const tokenName of this.appliedThemeTokens) {
      if (!nextTokenNames.has(tokenName)) {
        this.style.removeProperty(tokenName);
      }
    }

    this.appliedThemeTokens.clear();

    for (const tokenName of nextTokenNames) {
      this.appliedThemeTokens.add(tokenName);
    }
  }

  private resolveEffectiveTheme(): ProviderResolvedTheme {
    if (this.theme === "light" || this.theme === "dark") {
      return this.theme;
    }

    const inheritedTheme = this.findInheritedThemeScope()?.getAttribute("data-theme");
    return inheritedTheme === "dark" ? "dark" : "light";
  }

  private findInheritedThemeScope(): Element | null {
    const getParentNode = (node: Node): Node | null => {
      const rootNode = node.getRootNode();
      return node.parentNode ?? (rootNode instanceof ShadowRoot ? rootNode.host : null);
    };

    for (let parentNode = getParentNode(this); parentNode; parentNode = getParentNode(parentNode)) {
      if (parentNode instanceof Element && parentNode.hasAttribute("data-theme")) {
        return parentNode;
      }
    }

    return this.ownerDocument?.documentElement ?? null;
  }

  private syncThemeScopeObserver(): void {
    this.themeScopeObserver.disconnect();

    if (this.theme !== "inherit") {
      return;
    }

    const ownerDocument = this.ownerDocument;

    if (!ownerDocument) {
      return;
    }

    const observerOptions: MutationObserverInit = {
      attributeFilter: ["data-theme"],
      attributes: true
    };
    const inheritedThemeScope = this.findInheritedThemeScope();

    this.themeScopeObserver.observe(ownerDocument.documentElement, observerOptions);

    if (inheritedThemeScope && inheritedThemeScope !== ownerDocument.documentElement) {
      this.themeScopeObserver.observe(inheritedThemeScope, observerOptions);
    }
  }
}
