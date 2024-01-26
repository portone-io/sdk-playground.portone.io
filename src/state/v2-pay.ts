import { computed } from "@preact/signals";
import { toJs } from "./code";
import {
  createConfigObjectSignal,
  createFieldSignals,
  createJsonSignals,
  Fields,
  resetFieldSignals,
} from "./fields";
import { prefix } from "./persisted";
import { sdkV2Signal } from "./v2";

export function reset() {
  resetFieldSignals(fields, fieldSignals);
  jsonTextSignal.value = "{}";
}

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
  channelKey: {
    required: false,
    label: "채널 키",
    input: {
      type: "text",
      placeholder: "channel-key-aabcdeff-0000-1234-abcd-00001234abcd",
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
  customer: {
    required: false,
    label: "고객 정보",
    input: {
      type: "object",
      fields: {
        customerId: {
          required: false,
          label: "주문자 ID",
          input: {
            type: "text",
            placeholder: "",
            default: "",
            generate: () => `user_${Date.now().toString(36)}`,
          },
        },
        fullName: {
          required: false,
          label: "전체 이름",
          input: {
            type: "text",
            placeholder: "포트원",
            default: "",
          },
        },
        firstName: {
          required: false,
          label: "(성이 아닌) 이름",
          input: {
            type: "text",
            placeholder: "트원",
            default: "",
          },
        },
        lastName: {
          required: false,
          label: "성(姓)",
          input: {
            type: "text",
            placeholder: "포",
            default: "",
          },
        },
        phoneNumber: {
          required: false,
          label: "휴대폰 번호",
          input: {
            type: "text",
            placeholder: "010-1234-5678",
            default: "",
          },
        },
        email: {
          required: false,
          label: "이메일 주소",
          input: {
            type: "text",
            placeholder: "buyer@example.com",
            default: "",
          },
        },
        address: {
          required: false,
          label: "주소",
          input: {
            type: "object",
            fields: {
              country: {
                required: false,
                label: "국가코드",
                input: {
                  type: "text",
                  placeholder: "KR | US | CN | JP",
                  default: "",
                },
              },
              addressLine1: {
                required: true,
                label: "일반주소",
                input: {
                  type: "text",
                  placeholder: "",
                  default: "",
                },
              },
              addressLine2: {
                required: true,
                label: "상세주소",
                input: {
                  type: "text",
                  placeholder: "",
                  default: "",
                },
              },
              city: {
                required: false,
                label: "도시",
                input: {
                  type: "text",
                  placeholder: "",
                  default: "",
                },
              },
              province: {
                required: false,
                label: "주, 도, 시",
                input: {
                  type: "text",
                  placeholder: "",
                  default: "",
                },
              },
            },
          },
        },
        zipcode: {
          required: false,
          label: "우편번호",
          input: {
            type: "text",
            placeholder: "01234",
            default: "",
          },
        },
        gender: {
          required: false,
          label: "구매자 성별",
          input: {
            type: "text",
            placeholder: "GENDER_OTHER",
            default: "",
          },
        },
        birthYear: {
          required: false,
          label: "출생년도",
          input: {
            type: "text",
            placeholder: "1234",
            default: "",
          },
        },
        birthMonth: {
          required: false,
          label: "출생월",
          input: {
            type: "text",
            placeholder: "12",
            default: "",
          },
        },
        birthDay: {
          required: false,
          label: "출생일",
          input: {
            type: "text",
            placeholder: "34",
            default: "",
          },
        },
      },
    },
  },
  redirectUrl: {
    required: false,
    label: "리디렉션 URL",
    input: {
      type: "text",
      placeholder: "",
      default: "",
    },
  },
} satisfies Fields;

export const fieldSignals = createFieldSignals(
  localStorage,
  `${prefix}.v2-pay.fields`,
  fields,
);
export const { jsonTextSignal, jsonValueSignal } = createJsonSignals(
  localStorage,
  `${prefix}.v2-pay.json`,
);
export const configObjectSignal = createConfigObjectSignal({
  fields,
  fieldSignals,
  jsonValueSignal,
});
