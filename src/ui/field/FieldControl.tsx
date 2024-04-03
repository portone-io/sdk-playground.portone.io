import { Field, FieldSignal, Input } from "../../state/fields";
import Control from "../Control";
import FieldInputArray from "./FieldInputArray";
import FieldInputInteger from "./FieldInputInteger";
import FieldInputObject from "./FieldInputObject";
import FieldInputText from "./FieldInputText";
import FieldInputToggle from "./FieldInputToggle";
import { FieldInputProps } from "./input";

export interface FieldControlProps {
  code: string;
  field: Field;
  fieldSignal: FieldSignal;
}
const FieldControl: React.FC<FieldControlProps> = (
  { code, field, fieldSignal },
) => {
  const { enabledSignal } = fieldSignal;
  const FieldInput = fieldInputComponents[field.input.type];
  const hidden = field.hidden?.value;
  return (
    !hidden && (
      <Control
        label={field.label}
        code={code}
        required={field.required}
        enabled={enabledSignal.value}
        onToggle={(value) => enabledSignal.value = value}
        onClick={(e) => {
          if (e.target instanceof HTMLInputElement) {
            if (
              e.target.classList.contains("control-checkbox") &&
              e.target.checked
            ) {
              enabledSignal.value = true;
            }
          }
        }}
      >
        <FieldInput fieldInput={field.input} fieldSignal={fieldSignal} />
      </Control>
    )
  );
};
export default FieldControl;

const fieldInputComponents: {
  [key in Input["type"]]: React.FC<FieldInputProps<any, any>>;
} = {
  object: FieldInputObject,
  text: FieldInputText,
  integer: FieldInputInteger,
  toggle: FieldInputToggle,
  array: FieldInputArray,
};
