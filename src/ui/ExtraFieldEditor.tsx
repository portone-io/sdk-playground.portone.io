import * as React from "react";
import { ExtraFieldSignals, ExtraFields, Field, FieldSignal, FieldSignals, Fields, createFieldSignals } from "../state/fields";
import FieldControl from "./field/FieldControl";

interface ExtraFieldEditorProps {
  extraFields: ExtraFields;
  extraFieldSignals: ExtraFieldSignals;
}
const ExtraFieldEditor: React.FC<ExtraFieldEditorProps> = (
  { extraFields, extraFieldSignals, ...props },
) => {
  return (
    <>
      {Object.entries(extraFields.value).map(([key, field]) => (
        <FieldControl
          key={key}
          code={key}
          field={field}
          fieldSignal={extraFieldSignals.value[key]}
        />
      ))}
    </>
  );
};

export default ExtraFieldEditor;
