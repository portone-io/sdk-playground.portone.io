import { computed } from "@preact/signals";
import { toJs } from "./code";
import {
	type Fields,
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	resetFieldSignals,
} from "./fields";
import { prefix } from "./persisted";
import { sdkV2Signal } from "./v2";
import { fields as v2PayFields } from "./v2-pay";

export function reset() {
	resetFieldSignals(fields, fieldSignals);
	jsonTextSignal.value = "{}";
}

export const playFnSignal = computed(() => {
	const sdkV2 = sdkV2Signal.value;
	const configObject = configObjectSignal.value;
	return async function requestSubscriptionRegistration() {
		if (!sdkV2) throw new Error("sdk not loaded");
		const { PortOne } = await sdkV2;
		return PortOne.requestSubscriptionRegistration(configObject);
	};
});

export const codePreviewSignal = computed<string>(() => {
	const configObject = configObjectSignal.value;
	return [
		`<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>`,
		"",
		`<button onclick="registerSubscription()">구독 결제 등록</button>`,
		"",
		"<script>",
		"function registerSubscription() {",
		`  PortOne.requestSubscriptionRegistration(${toJs(configObject, "  ", 1)});`,
		"}",
		"</script>",
	].join("\n");
});

export const fields = {
	storeId: v2PayFields.storeId,
	channelKey: v2PayFields.channelKey,
	subscriptionId: {
		required: true,
		label: "구독 ID",
		input: {
			type: "text",
			default: "",
			placeholder: "사전 등록한 구독의 ID",
		},
	},
	registrationSecret: {
		required: true,
		label: "구독 등록 비밀값",
		input: {
			type: "text",
			default: "",
			placeholder: "사전 등록 응답의 registrationSecret",
		},
	},
	billingKeyMethod: {
		required: false,
		label: "빌링 키 발급 수단",
		input: {
			type: "enum",
			options: ["CARD", "PAYPAL"],
			default: "CARD",
			placeholder: "CARD",
		},
	},
	issueName: {
		required: false,
		label: "빌링 키 발급 주문 명",
		input: {
			type: "text",
			default: "",
			placeholder: "미입력 시 1회차 주문명",
		},
	},
	issueId: {
		required: false,
		label: "빌링 키 발급 주문 고유번호",
		input: {
			type: "text",
			default: "",
			placeholder: "스마트로 V2·나이스페이먼츠 V2·웰컴페이먼츠는 필수",
			generate: () => `issue${Date.now().toString(36)}`,
		},
	},
	windowType: v2PayFields.windowType,
	redirectUrl: v2PayFields.redirectUrl,
	productType: v2PayFields.productType,
} as const satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v2-subscription-registration.fields`,
	fields,
);
export const { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal } =
	createJsonSignals(
		localStorage,
		`${prefix}.v2-subscription-registration.json`,
	);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
