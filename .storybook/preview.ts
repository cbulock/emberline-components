import "../packages/core/src/register.ts";
import "../packages/core/src/styles.css";
import {
  cindorAmethystTheme,
  cindorCobaltTheme,
  cindorEvergreenTheme,
  cindorOceanTheme,
  cindorRoseTheme,
  type ProviderThemePreset
} from "../packages/core/src/index.js";
import { derivePrimaryColorThemeTokens } from "../packages/core/src/components/provider/provider-theme.js";

import type { Preview } from "@storybook/web-components-vite";

type StorybookThemeMode = "light" | "dark";
type StorybookThemePresetKey = "default" | "amethyst" | "evergreen" | "cobalt" | "rose" | "ocean";

const themePresets: Record<StorybookThemePresetKey, ProviderThemePreset | null> = {
  default: null,
  amethyst: cindorAmethystTheme,
  evergreen: cindorEvergreenTheme,
  cobalt: cindorCobaltTheme,
  rose: cindorRoseTheme,
  ocean: cindorOceanTheme
};

const appliedRootThemeTokens = new Set<`--${string}`>();

function applyRootTheme(mode: StorybookThemeMode, presetKey: StorybookThemePresetKey): void {
  const documentElement = document.documentElement;
  const preset = themePresets[presetKey];
  const nextTokens = preset
    ? {
        ...derivePrimaryColorThemeTokens(preset.primaryColor, mode),
        ...(mode === "dark" ? preset.darkThemeTokens : preset.lightThemeTokens)
      }
    : {};
  const nextTokenNames = new Set<`--${string}`>();

  documentElement.setAttribute("data-theme", mode);
  documentElement.style.colorScheme = mode;

  for (const [tokenName, tokenValue] of Object.entries(nextTokens)) {
    if (!tokenName.startsWith("--") || typeof tokenValue !== "string" || tokenValue.trim().length === 0) {
      continue;
    }

    const themeTokenName = tokenName as `--${string}`;
    nextTokenNames.add(themeTokenName);
    documentElement.style.setProperty(themeTokenName, tokenValue);
  }

  for (const tokenName of appliedRootThemeTokens) {
    if (!nextTokenNames.has(tokenName)) {
      documentElement.style.removeProperty(tokenName);
    }
  }

  appliedRootThemeTokens.clear();

  for (const tokenName of nextTokenNames) {
    appliedRootThemeTokens.add(tokenName);
  }
}

const preview = {
  globalTypes: {
    themeMode: {
      name: "Theme mode",
      description: "Global light or dark theme for Storybook stories.",
      toolbar: {
        icon: "mirror",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" }
        ],
        dynamicTitle: true
      }
    },
    themePreset: {
      name: "Theme preset",
      description: "Global Cindor theme preset for Storybook stories.",
      toolbar: {
        icon: "paintbrush",
        items: [
          { title: "Default", value: "default" },
          { title: "Amethyst", value: "amethyst" },
          { title: "Evergreen", value: "evergreen" },
          { title: "Cobalt", value: "cobalt" },
          { title: "Rose", value: "rose" },
          { title: "Ocean", value: "ocean" }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    themeMode: "light",
    themePreset: "default"
  },
  decorators: [
    (Story, context) => {
      const themeMode = (context.globals.themeMode as StorybookThemeMode | undefined) ?? "light";
      const themePreset = (context.globals.themePreset as StorybookThemePresetKey | undefined) ?? "default";

      applyRootTheme(themeMode, themePreset);

      return Story();
    }
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    layout: "centered",

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  tags: ["autodocs"],
} satisfies Preview;

export default preview;
