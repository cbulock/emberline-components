type TagInputStoryArgs = {
  disabled: boolean;
  required: boolean;
};

const meta = {
  title: "Forms/Tag Input",
  args: {
    disabled: false,
    required: false
  },
  argTypes: {
    disabled: {
      control: "boolean"
    },
    required: {
      control: "boolean"
    }
  },
  render: ({ disabled, required }: TagInputStoryArgs) => `
    <cindor-tag-input aria-label="Labels" ${disabled ? "disabled" : ""} ${required ? "required" : ""} placeholder="Add labels"></cindor-tag-input>
  `
};

export default meta;

export const Default = {};

export const WithSuggestions = {
  render: ({ disabled, required }: TagInputStoryArgs) => `
    <cindor-tag-input id="tag-input-suggestions-story" aria-label="Labels" ${disabled ? "disabled" : ""} ${required ? "required" : ""} placeholder="Add labels"></cindor-tag-input>
    <script>
      const element = document.getElementById("tag-input-suggestions-story");
      if (element) {
        element.suggestions = [
          { label: "Accessibility", keywords: ["a11y"] },
          { label: "Bug" },
          { label: "Design System", keywords: ["tokens", "theme"] },
          { label: "Performance", keywords: ["speed"] }
        ];
      }
    </script>
  `
};
