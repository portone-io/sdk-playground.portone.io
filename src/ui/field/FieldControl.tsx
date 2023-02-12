import { Field, FieldSignal, Input } from "../../state/fields";
import Control from "../Control";
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
  return (
    <Control
      label={field.label}
      code={code}
      required={field.required}
      enabled={enabledSignal.value}
      onToggle={(value) => enabledSignal.value = value}
    >
      <FieldInput fieldInput={field.input} fieldSignal={fieldSignal} />
    </Control>
  );
};
export default FieldControl;

const fieldInputComponents: {
  [key in Input["type"]]: React.FC<FieldInputProps<any>>;
} = {
  object: FieldInputObject,
  text: FieldInputText,
  integer: FieldInputInteger,
  toggle: FieldInputToggle,
};
