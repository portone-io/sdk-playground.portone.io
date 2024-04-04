import * as React from "react";
import {
  FieldSignals,
  ObjectFieldSignal,
  ObjectInput,
} from "../../state/fields";
import FieldControl from "./FieldControl";
import { FieldInputProps } from "./input";

const FieldInputObject: React.FC<
  FieldInputProps<ObjectInput, ObjectFieldSignal>
> = ({
  fieldInput,
  fieldSignal,
}) => {
  const fieldSignals = fieldSignal.valueSignal.value;
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(fieldInput.fields).map(([key, field]) => (
        <FieldControl
          key={key}
          code={key}
          field={field}
          fieldSignal={fieldSignals[key]}
        />
      ))}
    </div>
  );
};
export default FieldInputObject;
