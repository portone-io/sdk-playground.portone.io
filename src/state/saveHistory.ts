import { appModeSignal, getMajorVersion } from "./app";
import { Fields, FieldSignals } from "./fields";
import {
  fields as v1CertFields,
  fieldSignals as v1CertFieldSignals,
} from "./v1-cert";
import {
  fields as v1PayFields,
  fieldSignals as v1PayFieldSignals,
} from "./v1-pay";
import {
  fields as v2PayFields,
  fieldSignals as v2PayFieldSignals,
} from "./v2-pay";

type SaveMode = "v1-pay" | "v1-cert" | "v2-pay";

type HistoryField = {
  [key in string]?: { enable: boolean; value: string | boolean | object };
};

interface HistoryItem {
  mode: SaveMode;
  name: string;
  fields: HistoryField;
  createAt: number;
  sdkVersion: string;
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

const getMode = (): SaveMode => {
  const appMode = appModeSignal.value;
  const majorVersion = getMajorVersion(appMode.sdkVersion);
  switch (majorVersion) {
    case "v1": {
      if (appMode.function === "pay") return "v1-pay";
      if (appMode.function === "cert") return "v1-cert";
    }
    case "v2": {
      if (appMode.function === "pay") return "v2-pay";
    }
    default:
      return "v1-pay";
  }
};

const makeHistoryName = (mode: SaveMode) => {
  if (mode === "v1-pay") {
    const pg = v1PayFieldSignals.pg.valueSignal.value as pgNameKeys;
    const pgName = v1PgObject[pg] ? v1PgObject[pg] : pg;
    const payMethod = v1PayFieldSignals.pay_method.valueSignal.value;

    const hasName = (pgName.length + payMethod.length) > 0;
    return hasName ? `${pgName}_${payMethod}` : "v1_pay";
  }

  if (mode === "v1-cert") {
    const pg = v1CertFieldSignals.pg.valueSignal.value as pgNameKeys;
    const hasName = (pg.length) > 0;

    return hasName ? `${pg}` : "v1_본인인증";
  }

  if (mode === "v2-pay") {
    const payMethod = v2PayFieldSignals.payMethod.valueSignal.value;
    const hasName = (payMethod.length) > 0;
    return hasName ? `v2_${payMethod}` : "v2_pay";
  }

  return "v1_pay";
};

const getFieldsSignalValue = (
  fields: Fields,
  targetFieldSignals: FieldSignals,
) => {
  const result: HistoryField = {};

  Object.entries(fields).forEach(([key, field]) => {
    if (field.input.type === "object") {
      const fieldSignals = targetFieldSignals[key].valueSignal
        .value as FieldSignals;

      const innerObject: HistoryField = {};

      Object.entries(field.input.fields).map(([innerKey, field]) => {
        innerObject[innerKey] = {
          enable: fieldSignals[innerKey].enabledSignal.value,
          value: fieldSignals[innerKey].valueSignal.value,
        };
      });
      result[key] = {
        enable: targetFieldSignals[key].enabledSignal.value,
        value: innerObject,
      };
    } else {
      result[key] = {
        enable: targetFieldSignals[key].enabledSignal.value,
        value: targetFieldSignals[key].valueSignal.value,
      };
    }
  });

  return result;
};

const getFieldsValue = (mode: SaveMode) => {
  if (mode === "v1-pay") {
    return getFieldsSignalValue(v1PayFields, v1PayFieldSignals);
  }

  if (mode === "v1-cert") {
    return getFieldsSignalValue(v1CertFields, v1CertFieldSignals);
  }

  if (mode === "v2-pay") {
    return getFieldsSignalValue(v2PayFields, v2PayFieldSignals);
  }

  return {};
};

export const save = () => {
  const mode = getMode();
  const name = makeHistoryName(mode);
  const fields = getFieldsValue(mode);

  const historyItem: HistoryItem = {
    mode,
    name,
    fields,
    createAt: Date.now(),
    sdkVersion: appModeSignal.value.sdkVersion,
  };

  const prevHistories = localStorage.getItem("history");
  if (prevHistories) {
    localStorage.setItem(
      "history",
      JSON.stringify([historyItem, ...JSON.parse(prevHistories)]),
    );

    return;
  }

  localStorage.setItem("history", JSON.stringify([historyItem]));
};
