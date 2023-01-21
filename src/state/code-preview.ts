import { computed } from "@preact/signals";
import { sdkVersionSignal } from "./app";
import { userCodeSignal } from "./v1x";

export const codePreviewSignal = computed<string>(() => {
  const version = sdkVersionSignal.value;
  const userCode = userCodeSignal.value;
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
    `  IMP.request_pay({`,
    `  });`,
    `}`,
    `</script>`,
  ].join("\n");
});
