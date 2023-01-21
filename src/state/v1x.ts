import { signal } from "@preact/signals";

export const enabledFieldsSignal = signal(new Set<string>());
export function toggleEnableField(field: string, value?: boolean): void {
  const enabledFields = enabledFieldsSignal.value;
  const newEnabledFields = new Set(enabledFields.values());
  if (value == null ? enabledFields.has(field) : !value) {
    newEnabledFields.delete(field);
  } else {
    newEnabledFields.add(field);
  }
  enabledFieldsSignal.value = newEnabledFields;
}

export const userCodeSignal = signal("");
export const pgSignal = signal("");

export const fieldSignalMapping = {
  pg: pgSignal,
} as const;
