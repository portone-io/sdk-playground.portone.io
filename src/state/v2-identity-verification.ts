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
	countryOptions,
	genderOptions,
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
	return function requestIdentityVerification() {
		if (!sdkV2) return Promise.reject(new Error("sdk not loaded"));
		return sdkV2.PortOne.requestIdentityVerification(configObject);
	};
});

export const codePreviewSignal = computed<string>(() => {
	const configObject = configObjectSignal.value;
	return [
		`<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>`,
		"",
		`<button onclick="requestIdentityVerification()">본인 인증하기</button>`,
		"",
		"<script>",
		"function requestIdentityVerification() {",
		`  PortOne.requestIdentityVerification(${toJs(configObject, "  ", 1)});`,
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
	identityVerificationId: {
		required: true,
		label: "본인인증건 ID",
		input: {
			type: "text",
			default: "",
			placeholder: "",
			generate: () => `test_${Date.now().toString(36)}`,
		},
	},
	channelKey: {
		required: true,
		label: "본인인증 채널 키",
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
						placeholder: "01",
						default: "",
					},
				},
				birthDay: {
					required: false,
					label: "출생일",
					input: {
						type: "text",
						placeholder: "01",
						default: "",
					},
				},
			},
		},
	},
	windowType: {
		required: false,
		label: "본인인증 창 유형",
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
						placeholder: "POPUP",
						default: "",
						options: windowTypeOptions,
					},
				},
			},
		},
	},
	redirectUrl: {
		required: false,
		label: "본인인증 후 이동할 URL",
		input: {
			type: "text",
			placeholder: "https://example.com",
			default: "",
		},
	},
} satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v2-identity-verification.fields`,
	fields,
);
export const { jsonTextSignal, jsonValueSignal } = createJsonSignals(
	localStorage,
	`${prefix}.v2-identity-verification.json`,
);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
