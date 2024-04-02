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
      generate: () => `test${Date.now().toString(36)}`,
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
  card: {
    required: true,
    label: "카드 정보",
    hidden: computed(() => fieldSignals.payMethod?.valueSignal?.value !== "CARD"),
    input: {
      type: "object",
      fields: {
        cardCompany: {
          required: false,
          label: "카드사 다이렉트 호출 시 필요한 카드사 식별 값",
          input: {
            type: "text",
            placeholder: "KOOKMIN_CARD",
            default: ""
          }
        },
        availableCards: {
          required: false,
          label: "일부 카드사만 노출 설정",
          input: {
            type: "array",
            inputItem: {
              type: "text",
              default: "",
              placeholder: "KOOKMIN_CARD"
            },
            default: []
          }
        },
        useFreeInterestFromMall: {
          required: false,
          label: "상점분담 무이자 활성화 여부",
          input: {
            type: "toggle",
            default: false
          }
        },
        installment: {
          required: false,
          label: "할부 설정",
          input: {
            type: "object",
            fields: {
              freeInstallmentPlans: {
                required: false,
                label: "무이자 할부 설정",
                input: {
                  type: "array",
                  inputItem: {
                    type: "object",
                    fields: {
                      cardCompany: {
                        required: true,
                        label: "무이자 할부를 제공하는 카드사 식별 값",
                        input: {
                          type: "text",
                          placeholder: "KOOKMIN_CARD",
                          default: ""
                        }
                      },
                      months: {
                        required: true,
                        label: "무이자 할부를 제공하는 개월 수",
                        input: {
                          type: "array",
                          inputItem: {
                            type: "integer",
                            default: 0,
                          },
                          default: []
                        }
                      }
                    }
                  },
                  default: []
                }
              },
              monthOption: {
                required: false,
                label: "할부 개월 수 설정",
                input: {
                  type: "object",
                  fields: {
                    fixedMonth: {
                      required: false,
                      label: "고정된 할부 개월수",
                      input: {
                        type: "integer",
                        default: 0,
                      }
                    },
                    availableMonthList: {
                      required: false,
                      label: "선택 가능한 할부 개월수 리스트",
                      input: {
                        type: "array",
                        inputItem: {
                          type: "integer",
                          default: 0,
                        },
                        default: []
                      }
                    }
                  }
                }
              }
            }
          }
        },
        useCardPoint: {
          required: false,
          label: "카드사 포인트 사용 여부",
          input: {
            type: "toggle",
            default: false
          }
        },
        useAppCardOnly: {
          required: false,
          label: "앱 카드만 허용할지 여부",
          input: {
            type: "toggle",
            default: false
          }
        }
      },
    },
  },
  virtualAccount: {
    required: true,
    label: "가상계좌 정보",
    hidden: computed(() => fieldSignals.payMethod?.valueSignal?.value !== "VIRTUAL_ACCOUNT"),
    input: {
      type: "object",
      fields: {
        cashReceiptType: {
          required: false,
          label: "현금영수증 발급 유형",
          input: {
            type: "text",
            placeholder: "PERSONAL | CORPORATE | ANONYMOUS",
            default: ""
          },
        },
        customerIdentifier: {
          required: false,
          label: "현금영수증 발행 대상 식별 정보",
          input: {
            type: "text",
            placeholder: "",
            default: ""
          },
        },
        fixedOption: {
          required: false,
          label: "고정식 가상계좌 설정",
          input: {
            type: "object",
            fields: {
              pgAccountId: {
                required: false,
                label: "PG사에서 발급받은 가상계좌 ID",
                input: {
                  type: "text",
                  placeholder: "",
                  default: ""
                },
              },
              accountNumber: {
                required: false,
                label: "고정식으로 사용할 가상계좌 번호",
                input: {
                  type: "text",
                  placeholder: "",
                  default: ""
                },
              },
            },
          },
        },
        bankCode: {
          required: false,
          label: "가상계좌 발급 은행 코드",
          input: {
            type: "text",
            placeholder: "",
            default: ""
          },
        },
        accountExpiry: {
          required: true,
          label: "가상계좌 입금 만료기한",
          input: {
            type: "object",
            fields: {
              validHours: {
                required: true,
                label: "가상계좌 입금 유효 시간",
                input: {
                  type: "integer",
                  default: 1,
                },
              },
            },
          },
        },
      },
    },
  },
  transfer: {
    required: true,
    label: "계좌이체 정보",
    hidden: computed(() => fieldSignals.payMethod?.valueSignal?.value !== "TRANSFER"),
    input: {
      type: "object",
      fields: {
        cashReceiptType: {
          required: false,
          label: "현금영수증 발급 유형",
          input: {
            type: "text",
            placeholder: "PERSONAL | CORPORATE | ANONYMOUS",
            default: "",
          },
        },
        customerIdentifier: {
          required: false,
          label: "현금영수증 발행 대상 식별 정보",
          input: {
            type: "text",
            placeholder: "",
            default: ""
          },
        },
        bankCode: {
          required: true,
          label: "계좌이체 은행 코드",
          input: {
            type: "text",
            placeholder: "",
            default: "",
          },
        },
      },
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
    required: true,
    label: "결제 채널 키",
    input: {
      type: "text",
      placeholder: "channel-key-aabcdeff-0000-1234-abcd-00001234abcd",
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
                label: "국가",
                input: {
                  type: "text",
                  placeholder: "KR",
                  default: "",
                },
              },
              addressLine1: {
                required: false,
                label: "일반 주소",
                input: {
                  type: "text",
                  placeholder: "성수이로20길 16",
                  default: "",
                },
              },
              addressLine2: {
                required: false,
                label: "상세 주소",
                input: {
                  type: "text",
                  placeholder: "제이케이타워 4층",
                  default: "",
                },
              },
              city: {
                required: false,
                label: "도시",
                input: {
                  type: "text",
                  placeholder: "성동구",
                  default: "",
                },
              },
              province: {
                required: false,
                label: "주, 도, 시",
                input: {
                  type: "text",
                  placeholder: "서울특별시",
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
            placeholder: "OTHER",
            default: "",
          },
        },
        birthYear: {
          required: false,
          label: "출생년도",
          input: {
            type: "text",
            placeholder: "1970",
            default: "",
          },
        },
        birthMonth: {
          required: false,
          label: "출생월",
          input: {
            type: "text",
            placeholder: "1",
            default: "",
          },
        },
        birthDay: {
          required: false,
          label: "출생일",
          input: {
            type: "text",
            placeholder: "1",
            default: "",
          },
        },
      },
    },
  },
  windowType: {
    required: false,
    label: "결제 창 유형",
    input: {
      type: "object",
      fields: {
        pc: {
          required: false,
          label: "PC에서의 창 유형",
          input: {
            type: "text",
            placeholder: "IFRAME",
            default: "",
          },
        },
        mobile: {
          required: false,
          label: "모바일에서의 창 유형",
          input: {
            type: "text",
            placeholder: "REDIRECTION",
            default: "",
          },
        },
      },
    },
  },
  redirectUrl: {
    required: false,
    label: "결제 후 이동할 URL",
    input: {
      type: "text",
      placeholder: "https://example.com",
      default: "",
    },
  },
  noticeUrl: {
    required: false,
    label: "웹훅 수신 URL",
    input: {
      type: "array",
      inputItem: {
        type: "text",
        default: "",
        placeholder: "https://example.com",
      },
      default: [],
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
