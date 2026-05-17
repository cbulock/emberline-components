import { CindorTabs } from "./cindor-tabs.js";

type TabsStoryArgs = {
  activityLabel: string;
  activityText: string;
  mobileBreakpoint: number;
  mobileMode: "none" | "select";
  overviewLabel: string;
  overviewText: string;
  settingsLabel: string;
  settingsText: string;
  value: string;
};

const meta = {
  title: "Components/Tabs",
  args: {
    activityLabel: "Activity",
    activityText: "Activity content",
    mobileBreakpoint: 640,
    mobileMode: "select",
    overviewLabel: "Overview",
    overviewText: "Overview content",
    settingsLabel: "Settings",
    settingsText: "Settings content",
    value: "overview"
  },
  argTypes: {
    mobileMode: {
      control: { type: "inline-radio" },
      options: ["none", "select"]
    },
    value: {
      control: { type: "radio" },
      options: ["overview", "activity", "settings"]
    }
  },
  render: ({ activityLabel, activityText, mobileBreakpoint, mobileMode, overviewLabel, overviewText, settingsLabel, settingsText, value }: TabsStoryArgs) => {
    const element = document.createElement("cindor-tabs") as CindorTabs;
    element.setAttribute("aria-label", "Project sections");
    element.mobileBreakpoint = mobileBreakpoint;
    element.mobileMode = mobileMode;
    element.value = value;
    element.addEventListener("change", (event) => {
      event.stopPropagation();
    });

    const panels = [
      { label: overviewLabel, text: overviewText, value: "overview" },
      { label: activityLabel, text: activityText, value: "activity" },
      { label: settingsLabel, text: settingsText, value: "settings" }
    ];

    for (const panel of panels) {
      const section = document.createElement("cindor-tab-panel");
      section.setAttribute("label", panel.label);
      section.setAttribute("value", panel.value);
      section.textContent = panel.text;
      element.append(section);
    }

    return element;
  }
};

export default meta;

export const Default = {};

export const Activity = {
  args: {
    value: "activity"
  }
};

export const MobileSelectMode = {
  render: ({ activityLabel, activityText, mobileBreakpoint, mobileMode, overviewLabel, overviewText, settingsLabel, settingsText, value }: TabsStoryArgs) => {
    const element = document.createElement("cindor-tabs") as CindorTabs;
    element.setAttribute("aria-label", "Project sections");
    element.mobileBreakpoint = mobileBreakpoint;
    element.mobileMode = mobileMode;
    element.value = value;
    element.style.width = "min(100%, 26rem)";

    const panels = [
      { label: overviewLabel, text: overviewText, value: "overview" },
      { label: activityLabel, text: activityText, value: "activity" },
      { label: settingsLabel, text: settingsText, value: "settings" }
    ];

    for (const panel of panels) {
      const section = document.createElement("cindor-tab-panel");
      section.setAttribute("label", panel.label);
      section.setAttribute("value", panel.value);
      section.textContent = panel.text;
      element.append(section);
    }

    return element;
  }
};

export const HorizontalOnly = {
  args: {
    mobileMode: "none"
  }
};
