import { computed, Signal, signal } from "@preact/signals";

export const userCodeSignal = signal("");
export const jsonTextSignal = signal("{}");
export const jsonValueSignal = computed(() => {
  const jsonText = jsonTextSignal.value;
  try {
    return JSON.parse(jsonText);
  } catch {
    return undefined;
  }
});

export const fields = {
  pg: {
    required: false,
    label: "지원 PG사",
    input: {
      type: "text",
      placeholder: "html5_inicis",
      default: "",
    },
  },
  pay_method: {
    required: true,
    label: "결제 수단",
    input: {
      type: "text",
      placeholder: "html5_inicis",
      default: "",
    },
  },
  escrow: {
    required: false,
    label: "에스크로 여부",
    input: {
      type: "toggle",
      default: false,
    },
  },
} satisfies Fields;
interface Fields {
  [key: string]: Field;
}
interface Field {
  required: boolean;
  label: string;
  input: Input;
}
type Input = TextInput | ToggleInput;
interface InputBase<TType extends string, TDefault> {
  type: TType;
  default: TDefault;
}
interface TextInput extends InputBase<"text", string> {
  placeholder: string;
}
interface ToggleInput extends InputBase<"toggle", boolean> {}

export const fieldSignals = createFieldSignals(fields);

interface FieldSignals {
  [key: string]: FieldSignal;
}
interface FieldSignal {
  enabledSignal: Signal<boolean>;
  valueSignal: Signal<any>;
}
function createFieldSignals(fields: Fields): FieldSignals {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, {
      enabledSignal: signal(false),
      valueSignal: signal(field.input.default),
    }]),
  );
}
