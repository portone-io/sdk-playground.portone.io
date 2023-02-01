import { computed, Signal, signal } from "@preact/signals";

export interface Fields {
  [key: string]: Field;
}
export interface Field {
  required: boolean;
  label: string;
  input: Input;
}
export type Input = TextInput | IntegerInput | ToggleInput;
interface InputBase<TType extends string, TDefault> {
  type: TType;
  default: TDefault;
}
export interface TextInput extends InputBase<"text", string> {
  placeholder: string;
  generate?: () => string;
}
export interface IntegerInput extends InputBase<"integer", number> {}
export interface ToggleInput extends InputBase<"toggle", boolean> {}

export interface FieldSignals {
  [key: string]: FieldSignal;
}
export interface FieldSignal {
  enabledSignal: Signal<boolean>;
  valueSignal: Signal<any>;
}
export function createFieldSignals(fields: Fields): FieldSignals {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, {
      enabledSignal: signal(false),
      valueSignal: signal(field.input.default),
    }]),
  );
}

export interface JsonSignals {
  jsonTextSignal: Signal<string>;
  jsonValueSignal: Signal<any>;
}
export function createJsonSignals(initialJsonText: string = "{}"): JsonSignals {
  const jsonTextSignal = signal(initialJsonText);
  const jsonValueSignal = computed(() => {
    const jsonText = jsonTextSignal.value;
    try {
      return JSON.parse(jsonText);
    } catch {
      return undefined;
    }
  });
  return { jsonTextSignal, jsonValueSignal };
}

interface CreateConfigObjectSignalConfig {
  fields: Fields;
  fieldSignals: FieldSignals;
  jsonValueSignal: Signal<any>;
}
export function createConfigObjectSignal({
  fields,
  fieldSignals,
  jsonValueSignal,
}: CreateConfigObjectSignalConfig) {
  const configObjectSignal = computed(() => {
    const result: any = {};
    const jsonValue = jsonValueSignal.value;
    for (const [key, field] of Object.entries(fields)) {
      const fieldSignal = fieldSignals[key];
      const value = fieldSignal.valueSignal.value;
      const enabled = fieldSignal.enabledSignal.value;
      if (field.required || enabled) {
        result[key] = value;
      }
    }
    Object.assign(result, jsonValue);
    return result;
  });
  return configObjectSignal;
}
