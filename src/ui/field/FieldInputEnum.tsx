import * as React from "react";
import { EnumFieldSignal, EnumInput } from "../../state/fields";
import { FieldInputProps } from "./input";

const FieldInputEnum: React.FC<FieldInputProps<EnumInput, EnumFieldSignal>> = ({
  fieldInput,
  fieldSignal,
}) => {
  const { enabledSignal, valueSignal } = fieldSignal;
  const listId = `field-input-enum-${Math.random().toString(36).slice(2)}`;
  return (
    <>
      <input
        list={listId}
        className="border"
        type="text"
        placeholder={fieldInput.placeholder}
        value={valueSignal.value}
        onChange={(e) => {
          enabledSignal.value = true;
          valueSignal.value = e.currentTarget.value;
        }}
      />
      <datalist id={listId}>
        {fieldInput.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </datalist>
    </>
  );
};
export default FieldInputEnum;
