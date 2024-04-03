import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";
import persisted from "./persisted";

export interface Fields {
  [key: string]: Field;
}
export interface Field {
  required: boolean;
  enabled?: boolean;
  label: string;
  input: Input;
  hidden?: Signal<boolean>;
}
export type Input =
  | ObjectInput
  | TextInput
  | IntegerInput
  | ToggleInput
  | ArrayInput;
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
export interface ArrayInput extends InputBase<"array"> {
  inputItem: Input;
  default: any[];
}

export interface FieldSignals {
  [key: string]: FieldSignal | FieldSignalArray;
}
export interface FieldSignal {
  enabledSignal: Signal<boolean>;
  valueSignal: Signal<any>;
}
export interface FieldSignalArray extends FieldSignal {
  append: () => void;
  remove: (index: number) => void;
  clear: () => void;
  resize: (length: number) => void;
  getKey: (index: number) => string;
}
export function createFieldSignals(
  storage: Storage,
  keyPrefix: string,
  fields: Fields,
): FieldSignals {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => {
      const pKey = `${keyPrefix}.${key}`;
      const enabledSignal = persisted(
        storage,
        `${pKey}.enabled`,
        field.enabled ?? false,
      );
      let valueSignal;
      if (field.input.type === "object") {
        valueSignal = signal(
          createFieldSignals(storage, pKey, field.input.fields),
        );
      } else if (field.input.type === "array") {
        const inputItem = field.input.inputItem;
        const keySignals: Signal<string[]> = persisted(storage, pKey, []);
        const append = () => {
          keySignals.value = [
            ...keySignals.value,
            `${pKey}.${Math.random().toString(36).slice(2)}`,
          ];
        };
        const remove = (index: number) => {
          keySignals.value = keySignals.value.filter((_, i) => i !== index);
        };
        const clear = () => {
          keySignals.value = [];
        };
        const getKey = (index: number) => {
          return keySignals.value[index];
        };
        const resize = (length: number) => {
          if (length < keySignals.value.length) {
            keySignals.value = keySignals.value.slice(0, length);
          } else {
            while (keySignals.value.length < length) {
              append();
            }
          }
        };
        const valueSignal = computed(() => {
          const keys = keySignals.value;
          const signals: FieldSignal[] = [];
          for (const key of keys) {
            const itemKey = key;
            if (inputItem.type === "object") {
              signals.push({
                enabledSignal: signal(true),
                valueSignal: signal(
                  createFieldSignals(storage, itemKey, inputItem.fields),
                ),
              });
            } else if (inputItem.type === "array") {
              throw new Error("Nested arrays are not supported.");
            } else {
              signals.push({
                enabledSignal: signal(true),
                valueSignal: persisted(storage, itemKey, inputItem.default),
              });
            }
          }
          return signals;
        });
        return [
          key,
          {
            enabledSignal,
            valueSignal,
            append,
            remove,
            clear,
            resize,
            getKey,
          } satisfies FieldSignalArray,
        ];
      } else {
        valueSignal = persisted(storage, pKey, field.input.default);
      }
      return [key, { enabledSignal, valueSignal }];
    }),
  );
}
export function resetFieldSignals(fields: Fields, fieldSignals: FieldSignals) {
  for (const [key, fieldSignal] of Object.entries(fieldSignals)) {
    const field = fields[key as keyof typeof fields];
    const { enabledSignal, valueSignal } = fieldSignal;
    enabledSignal.value = field.enabled ?? false;
    if (field.input.type === "object") {
      resetFieldSignals(field.input.fields, valueSignal.value);
    } else if (field.input.type === "array") {
      (fieldSignal as FieldSignalArray).resize(field.input.default.length);
      for (const itemSignal of valueSignal.value) {
        if (field.input.inputItem.type === "object") {
          resetFieldSignals(field.input.inputItem.fields, itemSignal.value);
        } else if (field.input.inputItem.type === "array") {
          throw new Error("Nested arrays are not supported.");
        } else {
          itemSignal.value = field.input.inputItem.default;
        }
      }
    } else {
      valueSignal.value = field.input.default;
    }
  }
}

export interface JsonSignals {
  jsonTextSignal: Signal<string>;
  jsonValueSignal: ReadonlySignal<any>;
}
export function createJsonSignals(
  storage: Storage,
  key: string,
  initialJsonText: string = "{}",
): JsonSignals {
  const jsonTextSignal = persisted(storage, key, initialJsonText);
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
      if (field.hidden?.value) {
        continue;
      }
      const fieldSignal = fieldSignals[key];
      let value;
      if (field.input.type === "object") {
        value = getObject(field.input.fields, fieldSignal.valueSignal.value);
      } else if (field.input.type === "array") {
        const inputItem = field.input.inputItem;
        value = fieldSignal.valueSignal.value.map((itemSignal: FieldSignal) => {
          if (inputItem.type === "object") {
            return getObject(inputItem.fields, itemSignal.valueSignal.value);
          } else if (inputItem.type === "array") {
            throw new Error("Nested arrays are not supported.");
          } else {
            return itemSignal.valueSignal.value;
          }
        });
      } else {
        value = fieldSignal.valueSignal.value;
      }
      const enabled = fieldSignal.enabledSignal.value;
      if (field.required || enabled) {
        result[key] = value;
      }
    }
    return result;
  }
}
