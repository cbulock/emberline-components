type CheckboxStoryArgs = {
  checked: boolean;
  disabled: boolean;
  label: string;
};

const meta = {
  title: "Components/Checkbox",
  args: {
    checked: false,
    disabled: false,
    label: "Remember selection"
  },
  render: ({ checked, disabled, label }: CheckboxStoryArgs) =>
    `<emb-checkbox ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>${label}</emb-checkbox>`
};

export default meta;

export const Default = {};

export const Checked = {
  args: {
    checked: true
  }
};
