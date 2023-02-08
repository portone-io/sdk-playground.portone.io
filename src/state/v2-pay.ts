import { computed } from "@preact/signals";
import { toJs } from "./code";
import {
  createConfigObjectSignal,
  createFieldSignals,
  createJsonSignals,
  Fields,
} from "./fields";
import { sdkV2Signal } from "./v2";

export const playFnSignal = computed(() => {
  const sdkV2 = sdkV2Signal.value;
  const configObject = configObjectSignal.value;
  return function requestPay() {
    if (!sdkV2) return Promise.reject(new Error("sdk not loaded"));
    return sdkV2.PortOne.requestPayment(configObject);
  };
});

export const codePreviewSignal = computed<string>(() => {
  const configObject = configObjectSignal.value;
  return [
    `<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>`,
    ``,
    `<button onclick="requestPay()">결제하기</button>`,
    ``,
    `<script>`,
    `function requestPay() {`,
    `  PortOne.requestPayment(${toJs(configObject, "  ", 1)});`,
    `}`,
    `</script>`,
  ].join("\n");
});

export const fields = {
  storeId: {
    required: true,
    label: "상점 ID",
    input: {
      type: "text",
      placeholder: "store-aabcdeff-0000-1234-abcd-00001234abcd",
      default: "",
    },
  },
  paymentId: {
    required: true,
    label: "결제 ID",
    input: {
      type: "text",
      default: "",
      placeholder: "",
      generate: () => `test_${Date.now().toString(36)}`,
    },
  },
  orderName: {
    required: true,
    label: "주문명",
    input: {
      type: "text",
      placeholder: "짜장면 1개 단무지 추가",
      default: "",
    },
  },
  totalAmount: {
    required: true,
    label: "금액",
    input: {
      type: "integer",
      default: 0,
    },
  },
  payMethod: {
    required: true,
    label: "결제 수단",
    input: {
      type: "text",
      placeholder: "CARD",
      default: "",
    },
  },
  currency: {
    required: true,
    label: "결제 통화",
    input: {
      type: "text",
      placeholder: "KRW | USD | EUR | JPY",
      default: "",
    },
  },
  channelName: {
    required: false,
    label: "채널 이름",
    input: {
      type: "text",
      placeholder: "",
      default: "",
    },
  },
  pgProvider: {
    required: false,
    label: "PG사 구분코드",
    input: {
      type: "text",
      placeholder: "PG_PROVIDER_TOSSPAYMENTS",
      default: "",
    },
  },
} satisfies Fields;

export const fieldSignals = createFieldSignals(fields);
export const { jsonTextSignal, jsonValueSignal } = createJsonSignals();
export const configObjectSignal = createConfigObjectSignal({
  fields,
  fieldSignals,
  jsonValueSignal,
});
