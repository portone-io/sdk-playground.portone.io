import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";
import persisted from "./persisted";
import { match, P } from "ts-pattern";

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
export type FieldType =
  | "object"
  | "text"
  | "integer"
  | "toggle"
  | "array";
export type Input =
  | ObjectInput
  | TextInput
  | IntegerInput
  | ToggleInput
  | ArrayInput;
interface InputBase<TType extends FieldType> {
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
  [key: string]: FieldSignal;
}
export type FieldSignal =
  | ObjectFieldSignal
  | TextFieldSignal
  | IntegerFieldSignal
  | ToggleFieldSignal
  | ArrayFieldSignal;
interface FieldSignalBase<TType extends FieldType> {
  type: TType;
  enabledSignal: Signal<boolean>;
}
export interface ObjectFieldSignal extends FieldSignalBase<"object"> {
  valueSignal: Signal<FieldSignals>;
}
export interface TextFieldSignal extends FieldSignalBase<"text"> {
  valueSignal: Signal<string>;
}
export interface IntegerFieldSignal extends FieldSignalBase<"integer"> {
  valueSignal: Signal<number>;
}
export interface ToggleFieldSignal extends FieldSignalBase<"toggle"> {
  valueSignal: Signal<boolean>;
}
export interface ArrayFieldSignal extends FieldSignalBase<"array"> {
  valueSignal: Signal<FieldSignal[]>;
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
      return [key, createFieldSignal(storage, pKey, field, field.input)];
    }),
  );
  function createFieldSignal(
    storage: Storage,
    key: string,
    field: Field,
    input: Input,
  ): FieldSignal {
    const enabledSignal = persisted(
      storage,
      `${key}.enabled`,
      field.enabled ?? false,
    );
    return match(input)
      .with({ type: "object" }, (input): ObjectFieldSignal => {
        return {
          type: "object",
          enabledSignal,
          valueSignal: signal(createFieldSignals(storage, key, input.fields)),
        };
      })
      .with({ type: "array" }, (input): ArrayFieldSignal => {
        const keySignals: Signal<string[]> = persisted(storage, key, []);
        const append = () => {
          keySignals.value = [
            ...keySignals.value,
            `${key}.${Math.random().toString(36).slice(2)}`,
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
            signals.push(
              createFieldSignal(storage, itemKey, field, input.inputItem),
            );
          }
          return signals;
        });
        return {
          type: "array",
          enabledSignal,
          valueSignal,
          append,
          remove,
          clear,
          resize,
          getKey,
        };
      })
      .with({ type: P.union("integer", "text", "toggle") }, (input) => {
        return {
          type: input.type,
          enabledSignal,
          valueSignal: persisted(storage, key, input.default),
        } as FieldSignal;
      })
      .exhaustive();
  }
}
export function resetFieldSignals(fields: Fields, fieldSignals: FieldSignals) {
  for (const [key, fieldSignal] of Object.entries(fieldSignals)) {
    const field = fields[key as keyof typeof fields];
    resetFieldSignal(field, field.input, fieldSignal);
  }
  function resetFieldSignal(
    field: Field,
    input: Input,
    fieldSignal: FieldSignal,
  ) {
    fieldSignal.enabledSignal.value = field.enabled ?? false;
    matchFieldSignalType({
      input,
      fieldSignal,
      object: (input, fieldSignal) => {
        resetFieldSignals(input.fields, fieldSignal.valueSignal.value);
      },
      array: (input, fieldSignal) => {
        for (const itemSignal of fieldSignal.valueSignal.value) {
          resetFieldSignal(field, input.inputItem, itemSignal);
        }
      },
      integer: (input, fieldSignal) => {
        fieldSignal.valueSignal.value = input.default;
      },
      text: (input, fieldSignal) => {
        fieldSignal.valueSignal.value = input.default;
      },
      toggle: (input, fieldSignal) => {
        fieldSignal.valueSignal.value = input.default;
      },
    });
  }
}
export type MatchFieldSignalTypeHandler<
  T,
  Input extends InputBase<FieldType>,
  FieldSignal extends FieldSignalBase<FieldType>,
> = (
  input: Input,
  fieldSignal: FieldSignal,
) => T;
export type MatchFieldSignalTypeConfig<T> = {
  input: Input;
  fieldSignal: FieldSignal;
  object: MatchFieldSignalTypeHandler<
    T,
    ObjectInput,
    ObjectFieldSignal
  >;
  array: MatchFieldSignalTypeHandler<
    T,
    ArrayInput,
    ArrayFieldSignal
  >;
  integer: MatchFieldSignalTypeHandler<
    T,
    IntegerInput,
    IntegerFieldSignal
  >;
  text: MatchFieldSignalTypeHandler<T, TextInput, TextFieldSignal>;
  toggle: MatchFieldSignalTypeHandler<T, ToggleInput, ToggleFieldSignal>;
};

export function matchFieldSignalType<T>(
  {
    input,
    fieldSignal,
    object,
    array,
    integer,
    text,
    toggle,
  }: MatchFieldSignalTypeConfig<T>,
): T {
  return match([input, fieldSignal])
    .with(
      [{ type: "object" }, { type: "object" }],
      ([input, fieldSignal]) => object(input, fieldSignal),
    )
    .with(
      [{ type: "array" }, { type: "array" }],
      ([input, fieldSignal]) => array(input, fieldSignal),
    )
    .with(
      [{ type: "integer" }, { type: "integer" }],
      ([input, fieldSignal]) => integer(input, fieldSignal),
    )
    .with(
      [{ type: "text" }, { type: "text" }],
      ([input, fieldSignal]) => text(input, fieldSignal),
    )
    .with(
      [{ type: "toggle" }, { type: "toggle" }],
      ([input, fieldSignal]) => toggle(input, fieldSignal),
    )
    .with(
      P.union(
        [{ type: "object" }, { type: P._ }],
        [{ type: "array" }, { type: P._ }],
        [{ type: "integer" }, { type: P._ }],
        [{ type: "text" }, { type: P._ }],
        [{ type: "toggle" }, { type: P._ }],
      ),
      () => {
        throw new Error(
          `Unsupported combination of input type '${input.type}' and fieldSignal type '${fieldSignal.type}'.`,
        );
      },
    )
    .exhaustive();
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
      let value = getFieldObject(field, field.input, fieldSignal);
      const enabled = fieldSignal.enabledSignal.value;
      if (field.required || enabled) {
        result[key] = value;
      }
    }
    return result;
  }
  function getFieldObject(
    field: Field,
    input: Input,
    fieldSignal: FieldSignal,
  ): any {
    return matchFieldSignalType({
      input,
      fieldSignal,
      object: (input, fieldSignal) =>
        getObject(input.fields, fieldSignal.valueSignal.value),
      array: (input, fieldSignal) =>
        fieldSignal.valueSignal.value.map((itemSignal: FieldSignal) =>
          getFieldObject(field, input.inputItem, itemSignal)
        ),
      integer: (_, fieldSignal) => fieldSignal.valueSignal.value,
      text: (_, fieldSignal) => fieldSignal.valueSignal.value,
      toggle: (_, fieldSignal) => fieldSignal.valueSignal.value,
    });
  }
}
