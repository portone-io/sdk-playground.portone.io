import { computed } from "@preact/signals";
import { sdkVersionSignal } from "./app";
import { fields, fieldSignals, jsonValueSignal, userCodeSignal } from "./v1x";

export const codePreviewSignal = computed<string>(() => {
  const version = sdkVersionSignal.value;
  const userCode = userCodeSignal.value;
  const configObject = configObjectSignal.value;
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

export const configObjectSignal = computed(() => {
  const result: any = {};
  const jsonValue = jsonValueSignal.value;
  for (const [key, field] of Object.entries(fields)) {
    const fieldSignal = fieldSignals[key];
    const value = fieldSignal.valueSignal.value;
    const enabled = fieldSignal.enabledSignal.value;
    if (field.required || enabled) {
      result[key] = value;
    }
  }
  Object.assign(result, jsonValue);
  return result;
});

function toJs(object: object, indent = "  ", level = 0): string {
  const i = Array(level).fill(indent).join("");
  const ii = Array(level + 1).fill(indent).join("");
  const entries = Object.entries(object);
  if (entries.length < 1) return "{}";
  return `{\n${
    entries.map(([key, value]) => {
      const k = /^[_$a-z][_$a-z0-9]*$/i.test(key) ? key : JSON.stringify(key);
      if (
        (value != null) &&
        (typeof value === "object") &&
        (!Array.isArray(value))
      ) {
        return `${ii}${k}: ${toJs(value, indent, level + 1)},\n`;
      } else {
        return `${ii}${k}: ${JSON.stringify(value)},\n`;
      }
    }).join("")
  }${i}}`;
}
