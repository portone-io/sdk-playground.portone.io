import { batch, computed, signal } from "@preact/signals";
import type { ReadonlySignal, Signal } from "@preact/signals";
import { compact, omit, union } from "es-toolkit";
import { defaultsDeep } from "lodash-es";
import { P, match } from "ts-pattern";
import { isRecord } from "../misc/utils";
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
export type FieldType =
	| "object"
	| "text"
	| "integer"
	| "toggle"
	| "array"
	| "enum"
	| "union";
export type Input =
	| ObjectInput
	| TextInput
	| IntegerInput
	| ToggleInput
	| ArrayInput
	| EnumInput
	| UnionInput;
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
	default: unknown[];
}
export interface EnumInput extends InputBase<"enum"> {
	default: string;
	placeholder: string;
	options: string[];
}
export interface UnionInput extends InputBase<"union"> {
	fields: Fields;
}

export interface FieldSignals {
	[key: string]: FieldSignal;
}
export type FieldSignal =
	| ObjectFieldSignal
	| TextFieldSignal
	| IntegerFieldSignal
	| ToggleFieldSignal
	| ArrayFieldSignal
	| EnumFieldSignal
	| UnionFieldSignal;
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
export interface EnumFieldSignal extends FieldSignalBase<"enum"> {
	valueSignal: Signal<string>;
}
export interface UnionFieldSignal extends FieldSignalBase<"union"> {
	valueSignal: Signal<FieldSignals>;
	activeKeySignal: Signal<string>;
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
			.with({ type: "union" }, (input): UnionFieldSignal => {
				return {
					type: "union",
					enabledSignal,
					valueSignal: signal(createFieldSignals(storage, key, input.fields)),
					activeKeySignal: persisted(
						storage,
						`${key}.selectedKey`,
						Object.keys(input.fields)[0],
					),
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
			.with({ type: "enum" }, (input): EnumFieldSignal => {
				return {
					type: "enum",
					enabledSignal,
					valueSignal: persisted(storage, key, input.default),
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
		union: (input, fieldSignal) => {
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
		enum: (input, fieldSignal) => {
			fieldSignal.valueSignal.value = input.default;
		},
	});
}
export type MatchFieldSignalTypeHandler<
	T,
	Input extends InputBase<FieldType>,
	FieldSignal extends FieldSignalBase<FieldType>,
> = (input: Input, fieldSignal: FieldSignal) => T;
export type MatchFieldSignalTypeConfig<T> = {
	input: Input;
	fieldSignal: FieldSignal;
	object: MatchFieldSignalTypeHandler<T, ObjectInput, ObjectFieldSignal>;
	union: MatchFieldSignalTypeHandler<T, UnionInput, UnionFieldSignal>;
	array: MatchFieldSignalTypeHandler<T, ArrayInput, ArrayFieldSignal>;
	integer: MatchFieldSignalTypeHandler<T, IntegerInput, IntegerFieldSignal>;
	text: MatchFieldSignalTypeHandler<T, TextInput, TextFieldSignal>;
	toggle: MatchFieldSignalTypeHandler<T, ToggleInput, ToggleFieldSignal>;
	enum: MatchFieldSignalTypeHandler<T, EnumInput, EnumFieldSignal>;
};

export function matchFieldSignalType<T>({
	input,
	fieldSignal,
	object,
	union,
	array,
	integer,
	text,
	toggle,
	enum: _enum,
}: MatchFieldSignalTypeConfig<T>): T {
	return match([input, fieldSignal])
		.with([{ type: "object" }, { type: "object" }], ([input, fieldSignal]) =>
			object(input, fieldSignal),
		)
		.with([{ type: "union" }, { type: "union" }], ([input, fieldSignal]) =>
			union(input, fieldSignal),
		)
		.with([{ type: "array" }, { type: "array" }], ([input, fieldSignal]) =>
			array(input, fieldSignal),
		)
		.with([{ type: "integer" }, { type: "integer" }], ([input, fieldSignal]) =>
			integer(input, fieldSignal),
		)
		.with([{ type: "text" }, { type: "text" }], ([input, fieldSignal]) =>
			text(input, fieldSignal),
		)
		.with([{ type: "toggle" }, { type: "toggle" }], ([input, fieldSignal]) =>
			toggle(input, fieldSignal),
		)
		.with([{ type: "enum" }, { type: "enum" }], ([input, fieldSignal]) =>
			_enum(input, fieldSignal),
		)
		.with(
			P.union(
				[{ type: "object" }, { type: P._ }],
				[{ type: "union" }, { type: P._ }],
				[{ type: "array" }, { type: P._ }],
				[{ type: "integer" }, { type: P._ }],
				[{ type: "text" }, { type: P._ }],
				[{ type: "toggle" }, { type: P._ }],
				[{ type: "enum" }, { type: P._ }],
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
	jsonValueSignal: ReadonlySignal<Record<string, unknown>>;
	isEmptyJsonSignal: ReadonlySignal<boolean>;
}
export function createJsonSignals(
	storage: Storage,
	key: string,
	initialJsonText = "{}",
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
	const isEmptyJsonSignal = computed(() => {
		return Boolean(
			jsonValueSignal.value && Object.keys(jsonValueSignal.value).length,
		);
	});
	return { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal };
}

interface CreateConfigObjectSignalConfig {
	fields: Fields;
	fieldSignals: FieldSignals;
	jsonValueSignal: ReadonlySignal<Record<string, unknown>>;
}
export function createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
}: CreateConfigObjectSignalConfig): ReadonlySignal<Record<string, unknown>> {
	return computed(() =>
		defaultsDeep({}, jsonValueSignal.value, getObject(fields, fieldSignals)),
	);
	function getObject(
		fields: Fields,
		fieldSignals: FieldSignals,
	): Record<string, unknown> {
		const result: Record<string, unknown> = {};
		for (const [key, field] of Object.entries(fields)) {
			if (field.hidden?.value) {
				continue;
			}
			const fieldSignal = fieldSignals[key];
			const value = getFieldObject(field, field.input, fieldSignal);
			const enabled = fieldSignal.enabledSignal.value;
			const required = import.meta.env.VITE_SDK_PREVIEW
				? false
				: field.required;
			if (required || enabled) {
				result[key] = value;
			}
		}
		return result;
	}
	function getFieldObject(
		field: Field,
		input: Input,
		fieldSignal: FieldSignal,
	): unknown {
		return matchFieldSignalType<unknown>({
			input,
			fieldSignal,
			object: (input, fieldSignal) =>
				getObject(input.fields, fieldSignal.valueSignal.value),
			union: (input, fieldSignal) => {
				const key = fieldSignal.activeKeySignal.value;
				const selectedField = input.fields[key];
				const selectedFieldSignal = fieldSignal.valueSignal.value[key];
				return {
					[key]: getFieldObject(
						selectedField,
						selectedField.input,
						selectedFieldSignal,
					),
				};
			},
			array: (input, fieldSignal) =>
				fieldSignal.valueSignal.value.map((itemSignal: FieldSignal) =>
					getFieldObject(field, input.inputItem, itemSignal),
				),
			integer: (_, fieldSignal) => fieldSignal.valueSignal.value,
			text: (_, fieldSignal) => fieldSignal.valueSignal.value,
			toggle: (_, fieldSignal) => fieldSignal.valueSignal.value,
			enum: (_, fieldSignal) => fieldSignal.valueSignal.value,
		});
	}
}

export function updateSignalsFromJson(
	json: Record<string, unknown>,
	fields: Fields,
	fieldSignals: FieldSignals,
	jsonTextSignal: Signal<string>,
) {
	batch(() => {
		const extraFields = updateFields(json, fields, fieldSignals);
		jsonTextSignal.value = JSON.stringify(extraFields, null, 2);
	});

	function updateFields(
		json: Record<string, unknown>,
		fields: Fields,
		fieldSignals: FieldSignals,
	): Record<string, unknown> {
		const extraFields: Record<string, unknown> = {};

		const keys = Object.keys(json);
		for (const key of keys) {
			const value: unknown = json[key];
			const field: Field | undefined = fields[key];
			const fieldSignal: FieldSignal | undefined = fieldSignals[key];
			if (field && fieldSignal) {
				extraFields[key] = updateField(value, field, field.input, fieldSignal);
			} else {
				extraFields[key] = value;
			}
		}
		resetFieldSignals(omit(fields, keys), omit(fieldSignals, keys));

		return extraFields;
	}
	function updateField(
		value: unknown,
		field: Field,
		input: Input,
		fieldSignal: FieldSignal,
	): unknown {
		return match([input, fieldSignal, value])
			.with(
				[{ type: "object" }, { type: "object" }, P.when(isRecord)],
				([input, fieldSignal, value]) => {
					fieldSignal.enabledSignal.value = true;
					return updateFields(
						value,
						input.fields,
						fieldSignal.valueSignal.value,
					);
				},
			)
			.with(
				[{ type: "union" }, { type: "union" }, P.when(isRecord)],
				([input, fieldSignal, value]) => {
					fieldSignal.enabledSignal.value = true;
					const key = Object.keys(value)[0] ?? "";
					fieldSignal.activeKeySignal.value = key;
					return updateFields(
						value,
						input.fields,
						fieldSignal.valueSignal.value,
					);
				},
			)
			.with(
				[{ type: "array" }, { type: "array" }, P.when(Array.isArray)],
				([input, fieldSignal, value]) => {
					fieldSignal.enabledSignal.value = true;
					fieldSignal.resize(value.length);
					const extraArray = compact(
						value.map((item, index) => {
							const itemSignal = fieldSignal.valueSignal.value[index];
							return updateField(item, field, input.inputItem, itemSignal);
						}),
					);
					if (extraArray.length > 0) {
						fieldSignal.enabledSignal.value = false;
						return value;
					}
				},
			)
			.with(
				[{ type: "integer" }, { type: "integer" }, P.number],
				[{ type: "text" }, { type: "text" }, P.string],
				[{ type: "toggle" }, { type: "toggle" }, P.boolean],
				[{ type: "enum" }, { type: "enum" }, P.string],
				([_, fieldSignal, value]) => {
					fieldSignal.enabledSignal.value = true;
					fieldSignal.valueSignal.value = value;
				},
			)
			.with(
				[{ type: "object" }, P._, P._],
				[{ type: "union" }, P._, P._],
				[{ type: "array" }, P._, P._],
				[{ type: "integer" }, P._, P._],
				[{ type: "text" }, P._, P._],
				[{ type: "toggle" }, P._, P._],
				[{ type: "enum" }, P._, P._],
				[P.nullish, P._, P._],
				([input, fieldSignal, value]) => {
					if (fieldSignal) {
						fieldSignal.enabledSignal.value = false;
					}
					return value;
				},
			)
			.exhaustive();
	}
}
