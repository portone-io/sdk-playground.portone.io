import { batch } from "@preact/signals";
import type * as React from "react";
import type { UnionFieldSignal, UnionInput } from "../../state/fields";
import Control from "../Control";
import FieldControl, { fieldInputComponents } from "./FieldControl";
import type { FieldInputProps } from "./input";

const FieldInputUnion: React.FC<
	FieldInputProps<UnionInput, UnionFieldSignal>
> = ({ fieldInput, fieldSignal }) => {
	const fieldSignals = fieldSignal.valueSignal.value;
	const radioGroup = `field-input-union-${Math.random().toString(36).slice(2)}`;
	fieldSignal.activeKeySignal.subscribe((activeKey) => {
		batch(() => {
			for (const [key, fieldSignal] of Object.entries(fieldSignals)) {
				if (key === activeKey) {
					fieldSignal.enabledSignal.value = true;
				} else {
					fieldSignal.enabledSignal.value = false;
				}
			}
		});
	});
	return (
		<div className="flex flex-col gap-2">
			{Object.entries(fieldInput.fields).map(([key, field]) => {
				const FieldInput = fieldInputComponents[field.input.type];
				const required = import.meta.env.VITE_SDK_PREVIEW
					? false
					: field.required;
				return (
					<Control
						key={key}
						code={key}
						label={field.label}
						required={required}
						enabled={fieldSignals[key].enabledSignal.value}
						onToggle={(value) => {
							if (value === true) {
								fieldSignal.activeKeySignal.value = key;
							}
						}}
						radioGroup={radioGroup}
					>
						<FieldInput
							fieldInput={field.input}
							fieldSignal={fieldSignals[key]}
						/>
					</Control>
				);
			})}
		</div>
	);
};
export default FieldInputUnion;
