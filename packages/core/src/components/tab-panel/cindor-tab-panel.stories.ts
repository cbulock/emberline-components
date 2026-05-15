type TabPanelStoryArgs = {
  activityText: string;
  label: string;
  text: string;
  value: string;
};

const meta = {
  title: "Primitives/Tab Panel",
  args: {
    activityText: "Recent release activity and notes.",
    label: "Overview",
    text: "Overview details for the current release.",
    value: "overview"
  },
  render: ({ activityText, label, text, value }: TabPanelStoryArgs) => `
    <cindor-tabs value="${value}" aria-label="Release sections" style="max-width: 32rem;">
      <cindor-tab-panel label="${label}" value="${value}">${text}</cindor-tab-panel>
      <cindor-tab-panel label="Activity" value="activity">${activityText}</cindor-tab-panel>
    </cindor-tabs>
  `
};

export default meta;

export const Default = {};
