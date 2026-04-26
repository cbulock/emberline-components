type InputStoryArgs = {
  disabled: boolean;
  placeholder: string;
  value: string;
};

const meta = {
  title: "Components/Input",
  args: {
    disabled: false,
    placeholder: "Search projects",
    value: ""
  },
  render: ({ disabled, placeholder, value }: InputStoryArgs) =>
    `<emb-input ${disabled ? "disabled" : ""} placeholder="${placeholder}" value="${value}"></emb-input>`
};

export default meta;

export const Default = {};

export const Filled = {
  args: {
    value: "Terminal dashboard"
  }
};
