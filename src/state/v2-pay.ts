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
    `<script src="https://cdn.portone.io/sdk/v2"></script>`,
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
  // paymentId
  // orderName
  // totalAmount
  // payMethod
  // currency
  // channelName
  // pgProvider
} satisfies Fields;

export const fieldSignals = createFieldSignals(fields);
export const { jsonTextSignal, jsonValueSignal } = createJsonSignals();
export const configObjectSignal = createConfigObjectSignal({
  fields,
  fieldSignals,
  jsonValueSignal,
});
