import * as React from "react";
import { ArrayInput, FieldSignalArray, FieldSignals, Input } from "../../state/fields";
import FieldControl from "./FieldControl";
import { FieldInputProps } from "./input";
import FieldInputObject from "./FieldInputObject";
import FieldInputText from "./FieldInputText";
import FieldInputInteger from "./FieldInputInteger";
import FieldInputToggle from "./FieldInputToggle";
import { Signal } from "@preact/signals";

const FieldInputArray: React.FC<FieldInputProps<ArrayInput>> = ({
  fieldInput,
  fieldSignal,
}) => {
  const fieldSignals = (fieldSignal as FieldSignalArray).valueSignal.value;
  const FieldInput = fieldInputComponents[fieldInput.inputItem.type];
  return (
    <div className="flex flex-col gap-2">
      {fieldSignals.map((itemSignal: Signal<any>, i: number) => (
        <FieldInput key={i} fieldInput={fieldInput} fieldSignal={itemSignal.value} />
      ))}
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
