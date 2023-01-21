import { computed } from "@preact/signals";
import { sdkVersionSignal } from "./app";
import { enabledFieldsSignal, fieldSignalMapping, userCodeSignal } from "./v1x";

export const codePreviewSignal = computed<string>(() => {
  const version = sdkVersionSignal.value;
  const userCode = userCodeSignal.value;
  const configObject = getConfigObject();
  return [
    `<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>`,
    `<script src="https://cdn.iamport.kr/js/iamport.payment-${version}.js"></script>`,
    ``,
    `<button onclick="requestPay()">결제하기</button>`,
    ``,
    `<script>`,
    `const userCode = ${JSON.stringify(userCode)};`,
    `IMP.init(userCode);`,
    ``,
    `function requestPay() {`,
    `  IMP.request_pay(${toJs(configObject, "  ", 1)});`,
    `}`,
    `</script>`,
  ].join("\n");
});

function getConfigObject() {
  const result: any = {};
  const enabledFields = enabledFieldsSignal.value;
  for (const [field, signal] of Object.entries(fieldSignalMapping)) {
    const value = signal.value;
    if (enabledFields.has(field)) result[field] = value;
  }
  return result;
}

function toJs(object: object, indent = "  ", level = 0): string {
  const i = Array(level).fill(indent).join("");
  const ii = Array(level + 1).fill(indent).join("");
  const entries = Object.entries(object);
  if (entries.length < 1) return "{}";
  return `{\n${
    entries.map(([key, value]) => {
      if (
        (value != null) &&
        (typeof value === "object") &&
        (!Array.isArray(value))
      ) {
        return `${ii}${key}: ${toJs(value, indent, level + 1)},\n`;
      } else {
        return `${ii}${key}: ${JSON.stringify(value)},\n`;
      }
    })
  }${i}}`;
}
