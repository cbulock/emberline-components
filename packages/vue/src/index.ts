import { defineComponent, h, type PropType } from "vue";

import type { ButtonType, ButtonVariant } from "emberline-ui-core";
import "emberline-ui-core/register";

type InputHost = HTMLElement & { value: string };
type CheckboxHost = HTMLElement & { checked: boolean };

export const EmbButton = defineComponent({
  name: "EmbButton",
  props: {
    disabled: { type: Boolean, default: false },
    type: { type: String as PropType<ButtonType>, default: "button" },
    variant: { type: String as PropType<ButtonVariant>, default: "solid" }
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "emb-button",
        {
          ...attrs,
          disabled: props.disabled || undefined,
          type: props.type,
          variant: props.variant
        },
        slots.default?.()
      );
  }
});

export const EmbInput = defineComponent({
  name: "EmbInput",
  props: {
    autocomplete: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    modelValue: { type: String, default: "" },
    name: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    type: { type: String, default: "text" }
  },
  emits: ["update:modelValue", "input", "change"],
  setup(props, { attrs, emit }) {
    const handleInput = (event: Event) => {
      const target = event.currentTarget as InputHost;
      emit("update:modelValue", target.value);
      emit("input", event);
    };

    const handleChange = (event: Event) => {
      const target = event.currentTarget as InputHost;
      emit("update:modelValue", target.value);
      emit("change", event);
    };

    return () =>
      h("emb-input", {
        ...attrs,
        autocomplete: props.autocomplete,
        disabled: props.disabled || undefined,
        name: props.name || undefined,
        placeholder: props.placeholder || undefined,
        readonly: props.readonly || undefined,
        required: props.required || undefined,
        type: props.type,
        value: props.modelValue,
        onInput: handleInput,
        onChange: handleChange
      });
  }
});

export const EmbCheckbox = defineComponent({
  name: "EmbCheckbox",
  props: {
    disabled: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: false },
    name: { type: String, default: "" },
    required: { type: Boolean, default: false },
    value: { type: String, default: "on" }
  },
  emits: ["update:modelValue", "input", "change"],
  setup(props, { attrs, emit, slots }) {
    const handleInput = (event: Event) => {
      const target = event.currentTarget as CheckboxHost;
      emit("update:modelValue", target.checked);
      emit("input", event);
    };

    const handleChange = (event: Event) => {
      const target = event.currentTarget as CheckboxHost;
      emit("update:modelValue", target.checked);
      emit("change", event);
    };

    return () =>
      h(
        "emb-checkbox",
        {
          ...attrs,
          checked: props.modelValue || undefined,
          disabled: props.disabled || undefined,
          name: props.name || undefined,
          required: props.required || undefined,
          value: props.value,
          onInput: handleInput,
          onChange: handleChange
        },
        slots.default?.()
      );
  }
});
