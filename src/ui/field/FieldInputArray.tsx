import * as React from "react";
import { ArrayInput, FieldSignal, FieldSignalArray, Input } from "../../state/fields";
import { FieldInputProps } from "./input";
import FieldInputObject from "./FieldInputObject";
import FieldInputText from "./FieldInputText";
import FieldInputInteger from "./FieldInputInteger";
import FieldInputToggle from "./FieldInputToggle";

const FieldInputArray: React.FC<FieldInputProps<ArrayInput>> = ({
  fieldInput,
  fieldSignal,
}) => {
  const fieldSignalArray = fieldSignal as FieldSignalArray;
  const fieldSignals = fieldSignal.valueSignal.value;
  const FieldInput = fieldInputComponents[fieldInput.inputItem.type];
  return (
    <div className="flex flex-col items-start gap-2">
      {fieldSignals.map((itemSignal: FieldSignal, i: number) => (
        <div key={fieldSignalArray.getKey(i)} className="flex items-start gap-2">
          <FieldInput key={i} fieldInput={fieldInput.inputItem} fieldSignal={itemSignal} />
          <button
            onClick={(e) => {
              e.preventDefault();
              fieldSignalArray.remove(i)
            }}
          >
            ➖
          </button>
        </div>
      ))}
      <button
        onClick={() => fieldSignalArray.append()}
      >
        ➕
      </button>
    </div>
  );
};
export default FieldInputArray;

const fieldInputComponents: {
  [key in Input["type"]]: React.FC<FieldInputProps<any>>;
} = {
  object: FieldInputObject,
  text: FieldInputText,
  integer: FieldInputInteger,
  toggle: FieldInputToggle,
  array: () => {throw new Error("Nested arrays are not supported.")},
};
