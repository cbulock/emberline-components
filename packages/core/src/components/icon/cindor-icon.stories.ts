type IconStoryArgs = {
  label: string;
  name: string;
  size: number;
  strokeWidth: number;
};

const meta = {
  title: "Primitives/Icon",
  args: {
    label: "Search",
    name: "search",
    size: 20,
    strokeWidth: 2
  },
  argTypes: {
    name: {
      control: "text",
      description: 'Use any Lucide icon name. Browse the full catalog at https://lucide.dev/icons/.'
    }
  },
  render: ({ label, name, size, strokeWidth }: IconStoryArgs) =>
    `<cindor-icon label="${label}" name="${name}" size="${size}" stroke-width="${strokeWidth}"></cindor-icon>`
};

export default meta;

export const Default = {};
