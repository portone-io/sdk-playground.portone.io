import { computed } from "@preact/signals";
import { toJs } from "./code";
import {
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	type Fields,
	resetFieldSignals,
} from "./fields";
import { prefix } from "./persisted";
import {
	bankCodeOptions,
	cardCompanyOptions,
	carrierOptions,
	cashReceiptTypeOptions,
	countryOptions,
	currencyOptions,
	easyPayProviderOptions,
	genderOptions,
	giftCertificateTypeOptions,
	payMethodOptions,
	productTypeOptions,
	sdkV2Signal,
	windowTypeOptions,
} from "./v2";

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
		"",
		`<button onclick="requestPay()">결제하기</button>`,
		"",
		"<script>",
		"function requestPay() {",
		`  PortOne.requestPayment(${toJs(configObject, "  ", 1)});`,
		"}",
		"</script>",
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
	currency: {
		required: true,
		label: "결제 통화",
		input: {
			type: "enum",
			placeholder: "KRW | USD | EUR | JPY",
			default: "",
			options: currencyOptions,
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
	productType: {
		required: false,
		label: "상품 유형",
		input: {
			type: "enum",
			placeholder: "PRODUCT_TYPE_REAL | PRODUCT_TYPE_DIGITAL",
			default: "",
			options: productTypeOptions,
		},
	},
	payMethod: {
		required: true,
		label: "결제 수단",
		input: {
			type: "enum",
			placeholder: "CARD",
			default: "",
			options: payMethodOptions,
		},
	},
	card: {
		required: false,
		enabled: true,
		label: "카드 정보",
		hidden: computed(
			() => fieldSignals.payMethod?.valueSignal?.value !== "CARD",
		),
		input: {
			type: "object",
			fields: {
				cardCompany: {
					required: false,
					label: "카드사 다이렉트 호출 시 필요한 카드사 식별 값",
					input: {
						type: "enum",
						placeholder: "KOOKMIN_CARD",
						default: "",
						options: cardCompanyOptions,
					},
				},
				availableCards: {
					required: false,
					label: "일부 카드사만 노출 설정",
					input: {
						type: "array",
						inputItem: {
							type: "enum",
							placeholder: "KOOKMIN_CARD",
							default: "",
							options: cardCompanyOptions,
						},
						default: [],
					},
				},
				useFreeInterestFromMall: {
					required: false,
					label: "상점분담 무이자 활성화 여부",
					input: {
						type: "toggle",
						default: false,
					},
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
													type: "enum",
													placeholder: "KOOKMIN_CARD",
													default: "",
													options: cardCompanyOptions,
												},
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
													default: [],
												},
											},
										},
									},
									default: [],
								},
							},
							monthOption: {
								required: false,
								label: "할부 개월 수 설정",
								input: {
									type: "union",
									fields: {
										fixedMonth: {
											required: false,
											label: "고정된 할부 개월수",
											input: {
												type: "integer",
												default: 0,
											},
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
												default: [],
											},
										},
									},
								},
							},
						},
					},
				},
				useCardPoint: {
					required: false,
					label: "카드사 포인트 사용 여부",
					input: {
						type: "toggle",
						default: false,
					},
				},
				useAppCardOnly: {
					required: false,
					label: "앱 카드만 허용할지 여부",
					input: {
						type: "toggle",
						default: false,
					},
				},
			},
		},
	},
	virtualAccount: {
		required: false,
		enabled: true,
		label: "가상계좌 정보",
		hidden: computed(
			() => fieldSignals.payMethod?.valueSignal?.value !== "VIRTUAL_ACCOUNT",
		),
		input: {
			type: "object",
			fields: {
				cashReceiptType: {
					required: false,
					label: "현금영수증 발급 유형",
					input: {
						type: "enum",
						placeholder: "PERSONAL | CORPORATE | ANONYMOUS",
						default: "",
						options: cashReceiptTypeOptions,
					},
				},
				customerIdentifier: {
					required: false,
					label: "현금영수증 발행 대상 식별 정보",
					input: {
						type: "text",
						placeholder: "",
						default: "",
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
									default: "",
								},
							},
							accountNumber: {
								required: false,
								label: "고정식으로 사용할 가상계좌 번호",
								input: {
									type: "text",
									placeholder: "",
									default: "",
								},
							},
						},
					},
				},
				bankCode: {
					required: false,
					label: "가상계좌 발급 은행 코드",
					input: {
						type: "enum",
						placeholder: "BANK_OF_KOREA | KOREA_DEVELOPMENT_BANK",
						default: "",
						options: bankCodeOptions,
					},
				},
				accountExpiry: {
					required: false,
					label: "가상계좌 입금 만료기한",
					input: {
						type: "union",
						fields: {
							validHours: {
								required: false,
								label: "가상계좌 입금 유효 시간",
								input: {
									type: "integer",
									default: 1,
								},
							},
							dueDate: {
								required: false,
								label: "가상계좌 입금 유효 시각",
								input: {
									type: "text",
									placeholder: "YYYY-MM-DD HH:mm:ss",
									default: "",
								},
							},
						},
					},
				},
			},
		},
	},
	transfer: {
		required: false,
		enabled: true,
		label: "계좌이체 정보",
		hidden: computed(
			() => fieldSignals.payMethod?.valueSignal?.value !== "TRANSFER",
		),
		input: {
			type: "object",
			fields: {
				cashReceiptType: {
					required: false,
					label: "현금영수증 발급 유형",
					input: {
						type: "enum",
						placeholder: "PERSONAL | CORPORATE | ANONYMOUS",
						default: "",
						options: cashReceiptTypeOptions,
					},
				},
				customerIdentifier: {
					required: false,
					label: "현금영수증 발행 대상 식별 정보",
					input: {
						type: "text",
						placeholder: "",
						default: "",
					},
				},
				bankCode: {
					required: false,
					label: "계좌이체 은행 코드",
					input: {
						type: "enum",
						placeholder: "BANK_OF_KOREA | KOREA_DEVELOPMENT_BANK",
						default: "",
						options: bankCodeOptions,
					},
				},
			},
		},
	},
	mobile: {
		required: false,
		enabled: true,
		label: "휴대폰 소액결제 정보",
		hidden: computed(
			() => fieldSignals.payMethod?.valueSignal?.value !== "MOBILE",
		),
		input: {
			type: "object",
			fields: {
				carrier: {
					required: false,
					label: "소액결제 바로 호출을 위한 휴대폰 통신사",
					input: {
						type: "enum",
						placeholder: "SKT | KT | LGU",
						default: "",
						options: carrierOptions,
					},
				},
				availableCarriers: {
					required: false,
					label: "일부 통신사만 노출 설정",
					input: {
						type: "array",
						inputItem: {
							type: "enum",
							placeholder: "SKT | KT | LGU",
							default: "",
							options: carrierOptions,
						},
						default: [],
					},
				},
			},
		},
	},
	giftCertificate: {
		required: false,
		enabled: true,
		label: "상품권 정보",
		hidden: computed(
			() => fieldSignals.payMethod?.valueSignal?.value !== "GIFT_CERTIFICATE",
		),
		input: {
			type: "object",
			fields: {
				giftCertificateType: {
					required: false,
					label: "상품권 유형",
					input: {
						type: "enum",
						placeholder: "BOOKNLIFE | SMART_MUNSANG | CULTURELAND | HAPPYMONEY",
						default: "",
						options: giftCertificateTypeOptions,
					},
				},
			},
		},
	},
	easyPay: {
		required: false,
		enabled: true,
		label: "간편결제 정보",
		hidden: computed(
			() => fieldSignals.payMethod?.valueSignal?.value !== "EASY_PAY",
		),
		input: {
			type: "object",
			fields: {
				easyPayProvider: {
					required: false,
					label: "간편결제 수단",
					input: {
						type: "enum",
						placeholder: "PAYCO | SAMSUNGPAY | SSGPAY | KAKAOPAY | NAVERPAY",
						default: "",
						options: easyPayProviderOptions,
					},
				},
				useFreeInterestFromMall: {
					required: false,
					label: "상점분담 무이자 활성화 여부",
					input: {
						type: "toggle",
						default: false,
					},
				},
				useCardPoint: {
					required: false,
					label: "카드사 포인트 사용 여부",
					input: {
						type: "toggle",
						default: false,
					},
				},
				availableCards: {
					required: false,
					label: "일부 카드사만 노출 설정",
					input: {
						type: "array",
						inputItem: {
							type: "enum",
							placeholder: "KOOKMIN_CARD",
							default: "",
							options: cardCompanyOptions,
						},
						default: [],
					},
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
													type: "enum",
													placeholder: "KOOKMIN_CARD",
													default: "",
													options: cardCompanyOptions,
												},
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
													default: [],
												},
											},
										},
									},
									default: [],
								},
							},
							monthOption: {
								required: false,
								label: "할부 개월 수 설정",
								input: {
									type: "union",
									fields: {
										fixedMonth: {
											required: false,
											label: "고정된 할부 개월수",
											input: {
												type: "integer",
												default: 0,
											},
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
												default: [],
											},
										},
									},
								},
							},
						},
					},
				},
				cashReceiptType: {
					required: false,
					label: "현금영수증 발급 유형",
					input: {
						type: "enum",
						placeholder: "PERSONAL | CORPORATE | ANONYMOUS",
						default: "",
						options: cashReceiptTypeOptions,
					},
				},
				customerIdentifier: {
					required: false,
					label: "현금영수증 발행 대상 식별 정보",
					input: {
						type: "text",
						placeholder: "",
						default: "",
					},
				},
			},
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
									type: "enum",
									placeholder: "KR",
									default: "",
									options: countryOptions,
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
						type: "enum",
						placeholder: "OTHER",
						default: "",
						options: genderOptions,
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
						type: "enum",
						placeholder: "IFRAME",
						default: "",
						options: windowTypeOptions,
					},
				},
				mobile: {
					required: false,
					label: "모바일에서의 창 유형",
					input: {
						type: "enum",
						placeholder: "REDIRECTION",
						default: "",
						options: windowTypeOptions,
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
	noticeUrls: {
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
