import { FieldSignal, FieldSignalArray, Input } from "../../state/fields";

export interface FieldInputProps<TInput extends Input> {
  fieldInput: TInput;
  fieldSignal: FieldSignal | FieldSignalArray;
}
