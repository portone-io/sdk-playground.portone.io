import { computed, Signal, signal } from "@preact/signals";
import { sdkV1xSignal } from "./app";

export const requestPayFnSignal = computed(() => {
  const sdkV1x = sdkV1xSignal.value;
  const userCode = userCodeSignal.value;
  const configObject = configObjectSignal.value;
  return function requestPay() {
    if (!sdkV1x) return Promise.reject(new Error("sdk not loaded"));
    return new Promise((resolve, reject) => {
      if (!userCode) reject(new Error("userCode is empty"));
      sdkV1x.IMP.init(userCode);
      sdkV1x.IMP.request_pay(configObject, resolve);
    });
  };
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

export const userCodeSignal = signal("");
export const jsonTextSignal = signal("{}");
export const jsonValueSignal = computed(() => {
  const jsonText = jsonTextSignal.value;
  try {
    return JSON.parse(jsonText);
  } catch {
    return undefined;
  }
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
export interface Fields {
  [key: string]: Field;
}
export interface Field {
  required: boolean;
  label: string;
  input: Input;
}
export type Input = TextInput | IntegerInput | ToggleInput;
interface InputBase<TType extends string, TDefault> {
  type: TType;
  default: TDefault;
}
export interface TextInput extends InputBase<"text", string> {
  placeholder: string;
  generate?: () => string;
}
export interface IntegerInput extends InputBase<"integer", number> {}
export interface ToggleInput extends InputBase<"toggle", boolean> {}

export const fieldSignals = createFieldSignals(fields);

export interface FieldSignals {
  [key: string]: FieldSignal;
}
export interface FieldSignal {
  enabledSignal: Signal<boolean>;
  valueSignal: Signal<any>;
}
export function createFieldSignals(fields: Fields): FieldSignals {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, {
      enabledSignal: signal(false),
      valueSignal: signal(field.input.default),
    }]),
  );
}
