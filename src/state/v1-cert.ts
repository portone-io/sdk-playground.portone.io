import { computed } from "@preact/signals";
import { sdkVersionSignal } from "./app";
import { toJs } from "./code";
import {
  createConfigObjectSignal,
  createFieldSignals,
  createJsonSignals,
  Fields,
  resetFieldSignals,
} from "./fields";
import { prefix } from "./persisted";
import { createAccountSignals, sdkV1Signal } from "./v1";

export function reset() {
  resetFieldSignals(fields, fieldSignals);
  accountSignals.reset();
  jsonTextSignal.value = "{}";
}

export const accountSignals = createAccountSignals(`${prefix}.v1-cert`);

export const playFnSignal = computed(() => {
  const sdkV1 = sdkV1Signal.value;
  const userCode = accountSignals.userCodeSignal.value;
  const tierCode = accountSignals.tierCodeSignal.value;
  const configObject = configObjectSignal.value;
  return function certification() {
    if (!sdkV1) return Promise.reject(new Error("sdk not loaded"));
    return new Promise((resolve, reject) => {
      if (!userCode) reject(new Error("userCode is empty"));
      if (tierCode) sdkV1.IMP.agency(userCode, tierCode);
      else sdkV1.IMP.init(userCode);
      sdkV1.IMP.certification(configObject, resolve);
    });
  };
});

export const codePreviewSignal = computed<string>(() => {
  const version = sdkVersionSignal.value;
  const accountCodePreview = accountSignals.codePreviewSignal.value;
  const configObject = configObjectSignal.value;
  return [
    ...(
      version === "1.3.0"
        ? [
          `<script src="https://cdn.iamport.kr/v1/iamport.js"></script>`,
        ]
        : [
          `<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>`,
          `<script src="https://cdn.iamport.kr/js/iamport.payment-${version}.js"></script>`,
        ]
    ),
    ``,
    `<button onclick="requestCert()">인증하기</button>`,
    ``,
    `<script>`,
    accountCodePreview,
    ``,
    `function requestCert() {`,
    `  IMP.certification(${toJs(configObject, "  ", 1)});`,
    `}`,
    `</script>`,
  ].join("\n");
});

export const fields = {
  pg: {
    required: true,
    label: "지원 PG사",
    input: {
      type: "text",
      placeholder: "inicis_unified",
      default: "",
    },
  },
  merchant_uid: {
    required: true,
    label: "가맹점 고유 요청 번호",
    input: {
      type: "text",
      default: "",
      placeholder: "",
      generate: () => `test_${Date.now().toString(36)}`,
    },
  },
  min_age: {
    required: false,
    label: "최소 만 나이",
    input: {
      type: "integer",
      default: 15,
    },
  },
  name: {
    required: false,
    label: "고객 이름",
    input: {
      type: "text",
      default: "",
      placeholder: "포트원",
    },
  },
  phone: {
    required: false,
    label: "고객 전화번호",
    input: {
      type: "text",
      default: "",
      placeholder: "010-1234-5678",
    },
  },
  carrier: {
    required: false,
    label: "본인인증 통신사",
    input: {
      type: "text",
      default: "",
      placeholder: "SKT | KTF | LGT | MVNO",
    },
  },
  company: {
    required: false,
    label: "서비스 이름",
    input: {
      type: "text",
      default: "",
      placeholder: "포트원",
    },
  },
  m_redirect_url: {
    required: false,
    label: "본인인증 후에 이동할 URL",
    input: {
      type: "text",
      default: "",
      placeholder: "https://example.com",
    },
  },
  popup: {
    required: false,
    label: "본인인증창 팝업여부",
    input: {
      type: "toggle",
      default: false,
    },
  },
} satisfies Fields;

export const fieldSignals = createFieldSignals(
  localStorage,
  `${prefix}.v1-cert.fields`,
  fields,
);
export const { jsonTextSignal, jsonValueSignal } = createJsonSignals(
  localStorage,
  `${prefix}.v1-cert.json`,
);
export const configObjectSignal = createConfigObjectSignal({
  fields,
  fieldSignals,
  jsonValueSignal,
});
