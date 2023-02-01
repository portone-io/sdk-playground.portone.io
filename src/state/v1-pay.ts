import { computed } from "@preact/signals";
import { sdkV1Signal, sdkVersionSignal } from "./app";
import { toJs } from "./code";
import {
  createConfigObjectSignal,
  createFieldSignals,
  createJsonSignals,
  Fields,
} from "./fields";
import { userCodeSignal } from "./v1";

export const playFnSignal = computed(() => {
  const sdkV1 = sdkV1Signal.value;
  const userCode = userCodeSignal.value;
  const configObject = configObjectSignal.value;
  return function requestPay() {
    if (!sdkV1) return Promise.reject(new Error("sdk not loaded"));
    return new Promise((resolve, reject) => {
      if (!userCode) reject(new Error("userCode is empty"));
      sdkV1.IMP.init(userCode);
      sdkV1.IMP.request_pay(configObject, resolve);
    });
  };
});

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

export const fields = {
  pg: {
    required: false,
    label: "지원 PG사",
    input: {
      type: "text",
      placeholder: "html5_inicis",
      default: "",
    },
  },
  pay_method: {
    required: true,
    label: "결제 수단",
    input: {
      type: "text",
      placeholder: "card",
      default: "",
    },
  },
  escrow: {
    required: false,
    label: "에스크로 여부",
    input: {
      type: "toggle",
      default: false,
    },
  },
  merchant_uid: {
    required: true,
    label: "가맹점 고유 주문 번호",
    input: {
      type: "text",
      default: "",
      placeholder: "",
      generate: () => `test_${Date.now().toString(36)}`,
    },
  },
  name: {
    required: false,
    label: "주문명",
    input: {
      type: "text",
      default: "",
      placeholder: "짜장면 1개 단무지 추가",
    },
  },
  amount: {
    required: true,
    label: "금액",
    input: {
      type: "integer",
      default: 0,
    },
  },
  tax_free: {
    required: false,
    label: "면세공급가액",
    input: {
      type: "integer",
      default: 0,
    },
  },
  currency: {
    required: false,
    label: "통화",
    input: {
      type: "text",
      default: "",
      placeholder: "KRW | USD | EUR | JPY",
    },
  },
  language: {
    required: false,
    label: "결제창 언어설정",
    input: {
      type: "text",
      default: "",
      placeholder: "ko | en",
    },
  },
  popup: {
    required: false,
    label: "결제창 팝업여부",
    input: {
      type: "toggle",
      default: false,
    },
  },
  buyer_name: {
    required: false,
    label: "주문자명",
    input: {
      type: "text",
      default: "",
      placeholder: "원포트",
    },
  },
  buyer_tel: {
    required: true,
    label: "주문자 연락처",
    input: {
      type: "text",
      default: "",
      placeholder: "010-1234-5678",
    },
  },
  buyer_email: {
    required: false,
    label: "주문자 이메일",
    input: {
      type: "text",
      default: "",
      placeholder: "buyer@example.com",
    },
  },
  buyer_addr: {
    required: false,
    label: "주문자 주소",
    input: {
      type: "text",
      default: "",
      placeholder: "시군구읍면동",
    },
  },
  buyer_postcode: {
    required: false,
    label: "주문자 우편번호",
    input: {
      type: "text",
      default: "",
      placeholder: "01234",
    },
  },
  digital: {
    required: false,
    label: "디지털 컨텐츠 여부",
    input: {
      type: "toggle",
      default: false,
    },
  },
  vbank_due: {
    required: false,
    label: "가상계좌 입금기한",
    input: {
      type: "text",
      default: "",
      placeholder: "YYYYMMDDhhmm",
    },
  },
  m_redirect_url: {
    required: false,
    label: "결제완료 후에 이동할 URL",
    input: {
      type: "text",
      default: "",
      placeholder: "https://example.com",
    },
  },
  app_scheme: {
    required: false,
    label: "앱 복귀를 위한 URL",
    input: {
      type: "text",
      default: "",
      placeholder: "iamport://",
    },
  },
  biz_num: {
    required: false,
    label: "사업자등록번호",
    input: {
      type: "text",
      default: "",
      placeholder: "0000000000",
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
