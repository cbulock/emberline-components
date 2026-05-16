type SplitterStoryArgs = {
  orientation: "horizontal" | "vertical";
};

const meta = {
  title: "Display/Splitter",
  parameters: {
    layout: "fullscreen"
  },
  args: {
    orientation: "horizontal"
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    }
  },
  render: ({ orientation }: SplitterStoryArgs) => `
    <div style="${orientation === "horizontal" ? "width: 72rem; min-width: 52.5rem; max-width: none;" : "width: min(100%, 32rem);"} padding: var(--space-4);">
      <cindor-splitter orientation="${orientation}" style="${orientation === "vertical" ? "height: 24rem;" : "height: 18rem;"}">
        <cindor-splitter-panel size="28" style="padding: var(--space-4);">
          <strong>Navigation</strong>
          <p>Resizable side content for filters and app structure.</p>
        </cindor-splitter-panel>
        <cindor-splitter-panel size="72" style="padding: var(--space-4);">
          <strong>Workspace</strong>
          <p>Main panel content that grows as adjacent panels shrink.</p>
        </cindor-splitter-panel>
      </cindor-splitter>
    </div>
  `
};

export default meta;

export const Default = {};
