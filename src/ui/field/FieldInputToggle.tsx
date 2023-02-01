import * as React from "react";
import { ToggleInput } from "../../state/fields";
import Toggle from "../Toggle";
import { FieldInputProps } from "./input";

const FieldInputToggle: React.FC<FieldInputProps<ToggleInput>> = ({
  fieldSignal,
}) => {
  const { enabledSignal, valueSignal } = fieldSignal;
  return (
    <Toggle
      value={valueSignal.value}
      onToggle={(value) => {
        enabledSignal.value = true;
        valueSignal.value = value;
      }}
    />
  );
};
export default FieldInputToggle;
