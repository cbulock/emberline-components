import { cindorAmethystTheme, cindorEvergreenTheme } from "./cindor-provider.js";
import type { CindorProvider, ProviderThemeTokens } from "./cindor-provider.js";

type ProviderStoryArgs = {
  colorScheme: "inherit" | "light" | "dark";
  darkThemeTokens: ProviderThemeTokens;
  lightThemeTokens: ProviderThemeTokens;
  primaryColor: string;
  themeTokens: ProviderThemeTokens;
  theme: "inherit" | "light" | "dark";
};

const meta = {
  title: "Layout/Provider",
  args: {
    colorScheme: "inherit",
    darkThemeTokens: {},
    lightThemeTokens: {},
    primaryColor: "",
    themeTokens: {},
    theme: "dark"
  },
  argTypes: {
    colorScheme: {
      control: "select",
      options: ["inherit", "light", "dark"]
    },
    darkThemeTokens: {
      control: "object"
    },
    lightThemeTokens: {
      control: "object"
    },
    primaryColor: {
      control: "color"
    },
    themeTokens: {
      control: "object"
    },
    theme: {
      control: "select",
      options: ["inherit", "light", "dark"]
    }
  },
  render: ({ colorScheme, darkThemeTokens, lightThemeTokens, primaryColor, theme, themeTokens }: ProviderStoryArgs) => {
    const provider = document.createElement("cindor-provider") as CindorProvider;
    provider.theme = theme;
    provider.colorScheme = colorScheme;
    provider.primaryColor = primaryColor;
    provider.themeTokens = themeTokens;
    provider.lightThemeTokens = lightThemeTokens;
    provider.darkThemeTokens = darkThemeTokens;
    provider.innerHTML = `
      <cindor-card>
        <div style="padding: var(--space-4); display: grid; gap: var(--space-3);">
          <h3 style="margin: 0;">Scoped theme boundary</h3>
          <p style="margin: 0;">Wrap any standard web component consumer and keep token-driven theming local to that subtree.</p>
          <cindor-stack direction="horizontal" gap="2" wrap>
            <cindor-badge tone="accent">Provider</cindor-badge>
            <cindor-badge>Theme aware</cindor-badge>
          </cindor-stack>
          <cindor-button>Save theme</cindor-button>
        </div>
      </cindor-card>
    `;

    return provider;
  }
};

export default meta;

export const Default = {};

export const PrimaryColor = {
  args: {
    primaryColor: "#7c3aed"
  }
};

export const FullCustomTheme = {
  args: {
    darkThemeTokens: {
      "--accent": "#c084fc",
      "--accent-fg": "#160f24",
      "--accent-hover": "#d8b4fe",
      "--accent-muted": "rgba(192, 132, 252, 0.18)",
      "--accent-press": "#ede9fe",
      "--bg": "#120d1d",
      "--border": "#5b21b6",
      "--fg": "#f5f3ff",
      "--surface": "#1b1230"
    }
  }
};

export const AmethystPreset = {
  args: {
    darkThemeTokens: cindorAmethystTheme.darkThemeTokens,
    lightThemeTokens: cindorAmethystTheme.lightThemeTokens,
    primaryColor: cindorAmethystTheme.primaryColor
  }
};

export const EvergreenPreset = {
  args: {
    darkThemeTokens: cindorEvergreenTheme.darkThemeTokens,
    lightThemeTokens: cindorEvergreenTheme.lightThemeTokens,
    primaryColor: cindorEvergreenTheme.primaryColor
  }
};
