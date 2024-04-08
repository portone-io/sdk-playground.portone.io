import type * as React from "react";
import type { ToggleFieldSignal, ToggleInput } from "../../state/fields";
import Toggle from "../Toggle";
import type { FieldInputProps } from "./input";

const FieldInputToggle: React.FC<
  FieldInputProps<ToggleInput, ToggleFieldSignal>
> = ({ fieldSignal }) => {
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
