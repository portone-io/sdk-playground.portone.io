import type * as React from "react";
import {
	type ArrayFieldSignal,
	type ArrayInput,
	type FieldSignal,
	Input,
} from "../../state/fields";
import { fieldInputComponents } from "./FieldControl";
import type { FieldInputProps } from "./input";

const FieldInputArray: React.FC<FieldInputProps<ArrayInput, ArrayFieldSignal>> =
	({ fieldInput, fieldSignal }) => {
		const fieldSignals = fieldSignal.valueSignal.value;
		const FieldInput = fieldInputComponents[fieldInput.inputItem.type];
		return (
			<div className="flex flex-col items-start gap-2">
				{fieldSignals.map((itemSignal: FieldSignal, i: number) => (
					<div key={fieldSignal.getKey(i)} className="flex items-start gap-2">
						<FieldInput
							fieldInput={fieldInput.inputItem}
							fieldSignal={itemSignal}
						/>
						<button
							type="button"
							onClick={() => {
								fieldSignal.remove(i);
								fieldSignal.enabledSignal.value = true;
							}}
						>
							➖
						</button>
					</div>
				))}
				<button
					type="button"
					onClick={() => {
						fieldSignal.append();
						fieldSignal.enabledSignal.value = true;
					}}
				>
					➕
				</button>
			</div>
		);
	};
export default FieldInputArray;
