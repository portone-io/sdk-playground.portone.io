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
	return function requestIssueBillingKey() {
		if (!sdkV2) return Promise.reject(new Error("sdk not loaded"));
		return sdkV2.PortOne.requestIssueBillingKey(configObject);
	};
});

export const codePreviewSignal = computed<string>(() => {
	const configObject = configObjectSignal.value;
	return [
		`<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>`,
		"",
		`<button onclick="issueBillingKey()">빌링 키 발급</button>`,
		"",
		"<script>",
		"function issueBillingKey() {",
		`  PortOne.requestIssueBillingKey(${toJs(configObject, "  ", 1)});`,
		"}",
		"</script>",
	].join("\n");
});

export const fields = {
	storeId: v2PayFields.storeId,
	channelKey: v2PayFields.channelKey,
	billingKeyMethod: {
		required: true,
		label: "빌링 키 발급 수단",
		input: {
			type: "enum",
			options: ["CARD", "MOBILE", "EASY_PAY"],
			default: "CARD",
			placeholder: "CARD",
		},
	},
	card: {
		...v2PayFields.card,
		enabled: true,
		hidden: computed(
			() => fieldSignals.billingKeyMethod?.valueSignal?.value !== "CARD",
		),
		input: {
			type: "object",
			fields: {
				cardCompany: v2PayFields.card.input.fields.cardCompany,
			},
		},
	},
	mobile: {
		...v2PayFields.mobile,
		enabled: false,
		hidden: computed(
			() => fieldSignals.billingKeyMethod?.valueSignal?.value !== "MOBILE",
		),
		input: {
			type: "object",
			fields: {
				carrier: v2PayFields.mobile.input.fields.carrier,
				availableMethods: v2PayFields.mobile.input.fields.availableCarriers,
			},
		},
	},
	easyPay: {
		...v2PayFields.easyPay,
		enabled: false,
		hidden: computed(
			() => fieldSignals.billingKeyMethod?.valueSignal?.value !== "EASY_PAY",
		),
		input: {
			type: "object",
			fields: {
				easyPayProvider: v2PayFields.easyPay.input.fields.easyPayProvider,
			},
		},
	},
	customer: v2PayFields.customer,
	windowType: v2PayFields.windowType,
	redirectUrl: v2PayFields.redirectUrl,
} as const satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v2-issue-billing-key.fields`,
	fields,
);
export const { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal } =
	createJsonSignals(localStorage, `${prefix}.v2-issue-billing-key.json`);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
