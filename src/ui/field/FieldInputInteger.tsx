import * as React from "react";
import { IntegerInput } from "../../state/fields";
import { FieldInputProps } from "./input";

const FieldInputInteger: React.FC<FieldInputProps<IntegerInput>> = ({
  fieldSignal,
}) => {
  const { enabledSignal, valueSignal } = fieldSignal;
  return (
    <input
      className="border"
      type="number"
      value={valueSignal.value}
      min={0}
      onChange={(e) => {
        enabledSignal.value = true;
        valueSignal.value = Number(e.currentTarget.value);
      }}
    />
  );
};
export default FieldInputInteger;
