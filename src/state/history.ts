import { appModeSignal, getMajorVersion, modeFnSignal } from "./app";
import { Fields, FieldSignals } from "./fields";
import {
  fields as v1CertFields,
  fieldSignals as v1CertFieldSignals,
  userCodeSignal as v1CertUserCodeSignal,
} from "./v1-cert";
import {
  fields as v1PayFields,
  fieldSignals as v1PayFieldSignals,
  userCodeSignal as v1PayUserCodeSignal,
} from "./v1-pay";
import {
  fields as v2PayFields,
  fieldSignals as v2PayFieldSignals,
} from "./v2-pay";

export const LOCAL_STORAGE_HISTORY = "history";

export type SaveMode = "v1-pay" | "v1-cert" | "v2-pay";

export type HistoryField = {
  [key in string]: { enable: boolean; value: string | boolean | HistoryField };
};

export interface HistoryItem {
  mode: SaveMode;
  fields: HistoryField;
  createAt: number;
  userCode: string | null;
  sdkVersion: "1.3.0" | "1.2.1" | "1.2.0" | "1.1.8" | "1.1.7" | "2.0.0";
}

function getMode(): SaveMode {
  const appMode = appModeSignal.value;
  const modeFn = modeFnSignal.value;

  if (modeFn === "v1-pay") return "v1-pay";
  if (modeFn === "v1-cert") return "v1-cert";
  if (modeFn === "v2-pay") return "v2-pay";
  return "v1-pay";
}

function getFieldsSignalValue(
  fields: Fields,
  targetFieldSignals: FieldSignals,
) {
  const result: HistoryField = {};

  Object.entries(fields).forEach(([key, field]) => {
    if (field.input.type === "object") {
      const fieldSignals = targetFieldSignals[key].valueSignal
        .value as FieldSignals;

      result[key] = {
        enable: targetFieldSignals[key].enabledSignal.value,
        value: getFieldsSignalValue(field.input.fields, fieldSignals),
      };
    } else {
      result[key] = {
        enable: targetFieldSignals[key].enabledSignal.value,
        value: targetFieldSignals[key].valueSignal.value,
      };
    }
  });

  return result;
}

function getFieldsValue(mode: SaveMode) {
  if (mode === "v1-pay") {
    return getFieldsSignalValue(v1PayFields, v1PayFieldSignals);
  }

  if (mode === "v1-cert") {
    return getFieldsSignalValue(v1CertFields, v1CertFieldSignals);
  }

  return getFieldsSignalValue(v2PayFields, v2PayFieldSignals);
}

function getUserCode(mode: SaveMode) {
  if (mode === "v1-pay") {
    return v1PayUserCodeSignal.value;
  }

  if (mode === "v1-cert") {
    return v1CertUserCodeSignal.value;
  }
  return null;
}

export function saveHistory() {
  const mode = getMode();
  const fields = getFieldsValue(mode);

  const historyItem: HistoryItem = {
    mode,
    fields,
    userCode: getUserCode(mode),
    createAt: Date.now(),
    sdkVersion: appModeSignal.value.sdkVersion,
  };

  const prevHistories = localStorage.getItem(LOCAL_STORAGE_HISTORY);
  if (prevHistories) {
    localStorage.setItem(
      LOCAL_STORAGE_HISTORY,
      JSON.stringify([historyItem, ...JSON.parse(prevHistories)]),
    );

    return;
  }

  localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify([historyItem]));
}
