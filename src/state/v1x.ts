import { computed, signal } from "@preact/signals";

export const requiredFields = new Set([
  "pay_method",
]);
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
export const jsonTextSignal = signal("{}");
export const jsonValueSignal = computed(() => {
  const jsonText = jsonTextSignal.value;
  try {
    return JSON.parse(jsonText);
  } catch {
    return undefined;
  }
});
export const pgSignal = signal("");
export const payMethodSignal = signal("");
export const escrowSignal = signal(false);

export const fieldSignalMapping = {
  pg: pgSignal,
  pay_method: payMethodSignal,
  escrow: escrowSignal,
} as const;
