import type * as React from "react";
import {
	type ArrayFieldSignal,
	type ArrayInput,
	type FieldSignal,
	Input,
} from "../../state/fields";
import type { FieldInputProps } from "./input";
import { fieldInputComponents } from "./FieldControl";

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
							onClick={(e) => {
								e.preventDefault();
								fieldSignal.remove(i);
							}}
						>
							➖
						</button>
					</div>
				))}
				<button type="button" onClick={() => fieldSignal.append()}>
					➕
				</button>
			</div>
		);
	};
export default FieldInputArray;
