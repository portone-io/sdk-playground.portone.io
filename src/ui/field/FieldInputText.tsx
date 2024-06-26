import type * as React from "react";
import type { TextFieldSignal, TextInput } from "../../state/fields";
import type { FieldInputProps } from "./input";

const FieldInputText: React.FC<FieldInputProps<TextInput, TextFieldSignal>> = ({
	fieldInput,
	fieldSignal,
}) => {
	const { enabledSignal, valueSignal } = fieldSignal;
	const { generate } = fieldInput;
	return (
		<>
			<input
				className="border"
				type="text"
				placeholder={fieldInput.placeholder}
				value={valueSignal.value}
				onChange={(e) => {
					enabledSignal.value = true;
					valueSignal.value = e.currentTarget.value;
				}}
			/>
			{generate && (
				<button
					type="button"
					className="ml-1"
					title="자동 생성"
					onClick={() => {
						enabledSignal.value = true;
						valueSignal.value = generate();
					}}
				>
					🎲
				</button>
			)}
		</>
	);
};
export default FieldInputText;
