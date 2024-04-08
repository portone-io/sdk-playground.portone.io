import type { FieldSignal, Input } from "../../state/fields";

export interface FieldInputProps<
  TInput extends Input,
  TFieldSignal extends FieldSignal,
> {
  fieldInput: TInput;
  fieldSignal: TFieldSignal;
}
