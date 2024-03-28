import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";
import persisted from "./persisted";

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
export function createFieldSignals(
  storage: Storage,
  keyPrefix: string,
  fields: Fields,
): FieldSignals {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => {
      const pKey = `${keyPrefix}.${key}`;
      const enabledSignal = persisted(storage, `${pKey}.enabled`, false);
      const valueSignal = field.input.type === "object"
        ? signal(createFieldSignals(storage, pKey, field.input.fields))
        : persisted(storage, pKey, field.input.default);
      return [key, { enabledSignal, valueSignal }];
    }),
  );
}
export function resetFieldSignals(fields: Fields, fieldSignals: FieldSignals) {
  for (const [key, fieldSignal] of Object.entries(fieldSignals)) {
    const field = fields[key as keyof typeof fields];
    const { enabledSignal, valueSignal } = fieldSignal;
    enabledSignal.value = false;
    if (field.input.type === "object") {
      resetFieldSignals(field.input.fields, valueSignal.value);
    } else {
      valueSignal.value = field.input.default;
    }
  }
}

export type ExtraFields = Signal<Fields>;
export type ExtraFieldSignals = ReadonlySignal<FieldSignals>;
export function createExtraFields(
  storage: Storage,
  key: string,
): ExtraFields {
  return persisted(storage, key, {});
}
export function createExtraFieldSignals(
  storage: Storage,
  keyPrefix: string,
  extraFields: ExtraFields,
): ExtraFieldSignals {
  return computed(() => createFieldSignals(storage, keyPrefix, extraFields.value));
}
export function resetExtraFieldSignals(fields: ExtraFields, extraFieldSignals: ExtraFieldSignals) {
  fields.value = {};
}

interface CreateConfigObjectSignalConfig {
  fields: Fields;
  fieldSignals: FieldSignals;
  extraFields: ExtraFields;
  extraFieldSignals: ExtraFieldSignals;
}
export function createConfigObjectSignal({
  fields,
  fieldSignals,
  extraFields,
  extraFieldSignals,
}: CreateConfigObjectSignalConfig) {
  return computed(() => ({
    ...getObject(fields, fieldSignals),
    ...getObject(extraFields.value, extraFieldSignals.value),
  }));
  function getObject(fields: Fields, fieldSignals: FieldSignals): any {
    const result: any = {};
    for (const [key, field] of Object.entries(fields)) {
      const fieldSignal = fieldSignals[key];
      const value = field.input.type === "object"
        ? getObject(field.input.fields, fieldSignal.valueSignal.value)
        : fieldSignal.valueSignal.value;
      const enabled = fieldSignal.enabledSignal.value;
      if (field.required || enabled) {
        result[key] = value;
      }
    }
    return result;
  }
}
