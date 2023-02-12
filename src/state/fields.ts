import { computed, Signal, signal } from "@preact/signals";

export interface Fields {
  [key: string]: Field;
}
export interface Field {
  required: boolean;
  label: string;
  input: Input;
}
export type Input = ObjectInput | TextInput | IntegerInput | ToggleInput;
interface InputBase<TType extends string> {
  type: TType;
}
export interface ObjectInput extends InputBase<"object"> {
  fields: Fields;
}
export interface TextInput extends InputBase<"text"> {
  default: string;
  placeholder: string;
  generate?: () => string;
}
export interface IntegerInput extends InputBase<"integer"> {
  default: number;
}
export interface ToggleInput extends InputBase<"toggle"> {
  default: boolean;
}

export interface FieldSignals {
  [key: string]: FieldSignal;
}
export interface FieldSignal {
  enabledSignal: Signal<boolean>;
  valueSignal: Signal<any>;
}
export function createFieldSignals(fields: Fields): FieldSignals {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => {
      const enabledSignal = signal(false);
      const valueSignal = (
        field.input.type === "object"
          ? signal(createFieldSignals(field.input.fields))
          : signal(field.input.default)
      );
      return [key, { enabledSignal, valueSignal }];
    }),
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
  return computed(() => ({
    ...getObject(fields, fieldSignals),
    ...jsonValueSignal.value,
  }));
  function getObject(fields: Fields, fieldSignals: FieldSignals): any {
    const result: any = {};
    for (const [key, field] of Object.entries(fields)) {
      const fieldSignal = fieldSignals[key];
      const value = (
        field.input.type === "object"
          ? getObject(field.input.fields, fieldSignal.valueSignal.value)
          : fieldSignal.valueSignal.value
      );
      const enabled = fieldSignal.enabledSignal.value;
      if (field.required || enabled) {
        result[key] = value;
      }
    }
    return result;
  }
}
