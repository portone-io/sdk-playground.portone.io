import type * as React from "react";
import type { Fields, FieldSignals } from "../../state/fields";
import FieldControl from "./FieldControl";

interface FieldControlsProps {
  fields: Fields;
  fieldSignals: FieldSignals;
}
const FieldControls: React.FC<FieldControlsProps> = ({
  fields,
  fieldSignals,
  ...props
}) => {
  return (
    <>
      {Object.entries(fields).map(([key, field]) => (
        <FieldControl
          key={key}
          code={key}
          field={field}
          fieldSignal={fieldSignals[key]}
        />
      ))}
    </>
  );
};

export default FieldControls;
