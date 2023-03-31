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
  name: string;
  fields: HistoryField;
  createAt: number;
  userCode: string | null;
  sdkVersion: "1.3.0" | "1.2.1" | "1.2.0" | "1.1.8" | "1.1.7" | "2.0.0";
}

const v1PgObject = {
  html5_inicis: "이니시스",
  kcp: "KCP",
  nice: "나이스페이먼츠",
  kicc: "KICC",
  danal: "다날",
  danal_tpay: "다날",
  settle: "헥토파이낸셜",
  smartro: "스마트로",
  bluewalnut: "블루월넛",
  ksnet: "KSNET",
  tosspayments: "토스페이먼츠 (신)",
  uplus: "토스페이먼츠 (구)",
  daou: "키움페이",
  eximbay: "엑심베이",
  mobilians: "모빌리언스",
  paymentwall: "페이먼트월",
  kakaopay: "카카오페이",
  tosspay: "토스페이",
  payco: "페이코",
  smilepay: "스마일페이",
};

type pgNameKeys = keyof typeof v1PgObject;

function getMode(): SaveMode {
  const appMode = appModeSignal.value;
  const modeFn = modeFnSignal.value;

  if (modeFn === "v1-pay") return "v1-pay";
  if (modeFn === "v1-cert") return "v1-cert";
  if (modeFn === "v2-pay") return "v2-pay";
  return "v1-pay";
}

function makeHistoryName(mode: SaveMode) {
  if (mode === "v1-pay") {
    const pg = v1PayFieldSignals.pg.valueSignal.value as pgNameKeys;
    const pgName = v1PgObject[pg] ? v1PgObject[pg] : pg;
    const payMethod = v1PayFieldSignals.pay_method.valueSignal.value;

    const hasName = pgName.length + payMethod.length > 0;
    return hasName ? `${pgName}_${payMethod}` : "v1_pay";
  }

  if (mode === "v1-cert") {
    const pg = v1CertFieldSignals.pg.valueSignal.value as pgNameKeys;
    const hasName = pg.length > 0;

    return hasName ? `${pg}` : "v1_본인인증";
  }

  const payMethod = v2PayFieldSignals.payMethod.valueSignal.value;
  const hasName = payMethod.length > 0;
  return hasName ? `v2_${payMethod}` : "v2_pay";
}

function getFieldsSignalValue(
  fields: Fields,
  targetFieldSignals: FieldSignals
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
  const name = makeHistoryName(mode);
  const fields = getFieldsValue(mode);

  const historyItem: HistoryItem = {
    mode,
    name,
    fields,
    userCode: getUserCode(mode),
    createAt: Date.now(),
    sdkVersion: appModeSignal.value.sdkVersion,
  };

  const prevHistories = localStorage.getItem(LOCAL_STORAGE_HISTORY);
  if (prevHistories) {
    localStorage.setItem(
      LOCAL_STORAGE_HISTORY,
      JSON.stringify([historyItem, ...JSON.parse(prevHistories)])
    );

    return;
  }

  localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify([historyItem]));
}
