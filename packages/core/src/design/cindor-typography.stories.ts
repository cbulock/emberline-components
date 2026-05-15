const monoExample = "const total = items.reduce((sum, item) => sum + item.price, 0);";
const codeBlockExample = `<cindor-button variant="ghost">Cancel</cindor-button>`;

const meta = {
  title: "Foundations/Typography",
  render: () => `
    <section style="display:grid;gap:24px;max-width:880px;padding:8px;">
      <div style="display:grid;gap:12px;">
        <span class="eyebrow">Typography system</span>
        <h1>Display heading</h1>
        <h2>Section heading</h2>
        <h3>Subsection heading</h3>
        <h4>Utility heading</h4>
        <p class="lead">Lead copy gives larger supporting context for a section or hero-style surface.</p>
        <p>Body copy should stay readable and neutral across all supported themes and wrappers.</p>
        <p class="helper">Helper text supports nearby controls or secondary context.</p>
        <p class="caption">Caption text is reserved for compact metadata and low-emphasis labels.</p>
      </div>

      <div style="display:grid;gap:12px;">
        <h3>Label and metadata roles</h3>
        <div style="display:grid;gap:8px;">
          <span class="label">Field label</span>
          <span class="helper">Password must include at least 12 characters.</span>
          <span class="caption">Updated 5 minutes ago</span>
          <span class="data-value">INV-2048-A</span>
          <cindor-badge tone="accent">Live</cindor-badge>
        </div>
      </div>

      <div style="display:grid;gap:12px;">
        <h3>Code and mono surfaces</h3>
        <p>Inline code should read clearly inside running text, like <code>npm run build</code> or <span class="mono">${monoExample}</span>.</p>
        <cindor-code-block
          language="html"
          code="${codeBlockExample.replace(/"/g, "&quot;")}"
        ></cindor-code-block>
      </div>
    </section>
  `
};

export default meta;

export const Reference = {};
