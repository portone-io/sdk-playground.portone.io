import * as React from "react";
import { UnionFieldSignal, UnionInput } from "../../state/fields";
import FieldControl from "./FieldControl";
import { FieldInputProps } from "./input";
import { batch } from "@preact/signals";
import Control from "../Control";

const FieldInputUnion: React.FC<
  FieldInputProps<UnionInput, UnionFieldSignal>
> = ({
  fieldInput,
  fieldSignal,
}) => {
  const fieldSignals = fieldSignal.valueSignal.value;
  const radioGroup = `field-input-union-${Math.random().toString(36).slice(2)}`;
  fieldSignal.activeKeySignal.subscribe((activeKey) => {
    batch(() => {
      for (const [key, fieldSignal] of Object.entries(fieldSignals)) {
        if (key === activeKey) {
          fieldSignal.enabledSignal.value = true;
        } else {
          fieldSignal.enabledSignal.value = false;
        }
      }
    });
  });
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(fieldInput.fields).map(([key, field]) => (
        <Control
          key={key}
          code={key}
          label={field.label}
          required={field.required}
          enabled={fieldSignals[key].enabledSignal.value}
          onToggle={(value) => {
            if (value === true) {
              fieldSignal.activeKeySignal.value = key;
            }
          }}
          radioGroup={radioGroup}
        >
          <FieldControl
            code={key}
            field={field}
            fieldSignal={fieldSignals[key]}
          />
        </Control>
      ))}
    </div>
  );
};
export default FieldInputUnion;
