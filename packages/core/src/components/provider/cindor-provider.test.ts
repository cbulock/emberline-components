import "../../register.js";

import {
  cindorAmethystTheme,
  cindorCobaltTheme,
  cindorEvergreenTheme,
  cindorOceanTheme,
  cindorRoseTheme,
  cindorThemePresets,
  CindorProvider
} from "./cindor-provider.js";

describe("cindor-provider", () => {
  it("uses theme as the default control for both data-theme and color-scheme", async () => {
    const element = document.createElement("cindor-provider") as CindorProvider;
    element.theme = "dark";
    document.body.append(element);
    await element.updateComplete;

    expect(element.getAttribute("data-theme")).toBe("dark");
    expect(element.style.colorScheme).toBe("dark");
  });

  it("uses the inherited theme for color-scheme when the provider theme is inherit", async () => {
    const outer = document.createElement("cindor-provider") as CindorProvider;
    outer.theme = "dark";

    const inner = document.createElement("cindor-provider") as CindorProvider;
    outer.append(inner);
    document.body.append(outer);
    await outer.updateComplete;
    await inner.updateComplete;

    expect(inner.hasAttribute("data-theme")).toBe(false);
    expect(inner.style.colorScheme).toBe("dark");
  });

  it("removes theme-specific presentation overrides when set back to inherit", async () => {
    const element = document.createElement("cindor-provider") as CindorProvider;
    element.theme = "dark";
    element.primaryColor = "#2563eb";
    document.body.append(element);
    await element.updateComplete;

    element.theme = "inherit";
    element.primaryColor = "";
    await element.updateComplete;

    expect(element.hasAttribute("data-theme")).toBe(false);
    expect(element.style.colorScheme).toBe("light");
    expect(element.style.getPropertyValue("--accent")).toBe("");
  });

  it("derives accent tokens from the primary color", async () => {
    const element = document.createElement("cindor-provider") as CindorProvider;
    element.theme = "dark";
    element.primaryColor = "#2563eb";
    document.body.append(element);
    await element.updateComplete;

    expect(element.style.getPropertyValue("--accent")).toBe("#4c7fef");
    expect(element.style.getPropertyValue("--accent-hover")).toBe("#739bf2");
    expect(element.style.getPropertyValue("--accent-press")).toBe("#9bb7f6");
    expect(element.style.getPropertyValue("--accent-fg")).toBe("#0f0e0c");
    expect(element.style.getPropertyValue("--ring-focus")).toBe("0 0 0 2px #4c7fef");
  });

  it("applies token overrides and lets theme-specific tokens win", async () => {
    const element = document.createElement("cindor-provider") as CindorProvider;
    element.theme = "dark";
    element.primaryColor = "#2563eb";
    element.themeTokens = {
      "--accent": "#abcdef",
      "--border": "#123456"
    };
    element.darkThemeTokens = {
      "--accent": "#fedcba",
      "--surface": "#111111"
    };
    document.body.append(element);
    await element.updateComplete;

    expect(element.style.getPropertyValue("--accent")).toBe("#fedcba");
    expect(element.style.getPropertyValue("--border")).toBe("#123456");
    expect(element.style.getPropertyValue("--surface")).toBe("#111111");
  });

  it("recomputes inherited theme tokens when the ancestor theme changes", async () => {
    const outer = document.createElement("cindor-provider") as CindorProvider;
    outer.theme = "dark";

    const inner = document.createElement("cindor-provider") as CindorProvider;
    inner.primaryColor = "#2563eb";
    outer.append(inner);
    document.body.append(outer);
    await outer.updateComplete;
    await inner.updateComplete;

    expect(inner.style.getPropertyValue("--accent")).toBe("#4c7fef");

    outer.theme = "light";
    await outer.updateComplete;
    await Promise.resolve();

    expect(inner.style.getPropertyValue("--accent")).toBe("#2563eb");
  });

  it("exports reusable theme presets", () => {
    expect(cindorAmethystTheme.primaryColor).toBe("#7c3aed");
    expect(cindorAmethystTheme.darkThemeTokens["--surface"]).toBe("#1b1230");
    expect(cindorEvergreenTheme.primaryColor).toBe("#15803d");
    expect(cindorEvergreenTheme.lightThemeTokens["--fg"]).toBe("#052e16");
    expect(cindorCobaltTheme.primaryColor).toBe("#2563eb");
    expect(cindorRoseTheme.darkThemeTokens["--border"]).toBe("#be185d");
    expect(cindorOceanTheme.lightThemeTokens["--fg"]).toBe("#134e4a");
    expect(Object.keys(cindorThemePresets)).toEqual(["amethyst", "evergreen", "cobalt", "rose", "ocean"]);
  });
});
