type ButtonStoryArgs = {
  disabled: boolean;
  label: string;
  variant: "solid" | "ghost";
};

const meta = {
  title: "Components/Button",
  args: {
    disabled: false,
    label: "Save",
    variant: "solid"
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["solid", "ghost"]
    }
  },
  render: ({ disabled, label, variant }: ButtonStoryArgs) =>
    `<emb-button ${disabled ? "disabled" : ""} variant="${variant}">${label}</emb-button>`
};

export default meta;

export const Default = {};

export const Ghost = {
  args: {
    variant: "ghost"
  }
};
