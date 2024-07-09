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
	return async function requestIssueBillingKeyAndPay() {
		if (!sdkV2) throw new Error("sdk not loaded");
		const { PortOne } = await sdkV2;
		return PortOne.requestIssueBillingKeyAndPay(configObject);
	};
});

export const codePreviewSignal = computed<string>(() => {
	const configObject = configObjectSignal.value;
	return [
		`<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>`,
		"",
		`<button onclick="issueBillingKeyAndPay()">빌링 키 발급 및 결제</button>`,
		"",
		"<script>",
		"function issueBillingKeyAndPay() {",
		`  PortOne.requestIssueBillingKeyAndPay(${toJs(configObject, "  ", 1)});`,
		"}",
		"</script>",
	].join("\n");
});

export const fields = {
	storeId: v2PayFields.storeId,
	paymentId: v2PayFields.paymentId,
	channelKey: v2PayFields.channelKey,
	orderName: v2PayFields.orderName,
	totalAmount: v2PayFields.totalAmount,
	currency: v2PayFields.currency,
	billingKeyAndPayMethod: {
		required: true,
		label: "빌링 키 발급 및 결제 수단",
		input: {
			type: "enum",
			options: ["CARD", "MOBILE"],
			default: "CARD",
			placeholder: "CARD",
		},
	},
	mobile: {
		...v2PayFields.mobile,
		enabled: false,
		hidden: computed(
			() =>
				fieldSignals.billingKeyAndPayMethod?.valueSignal?.value !== "MOBILE",
		),
		input: {
			type: "object",
			fields: {
				carrier: v2PayFields.mobile.input.fields.carrier,
				availableMethods: v2PayFields.mobile.input.fields.availableCarriers,
			},
		},
	},
	customer: v2PayFields.customer,
	windowType: v2PayFields.windowType,
	redirectUrl: v2PayFields.redirectUrl,
	noticeUrls: v2PayFields.noticeUrls,
	productType: v2PayFields.productType,
} as const satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v2-issue-billing-key-and-pay.fields`,
	fields,
);
export const { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal } =
	createJsonSignals(
		localStorage,
		`${prefix}.v2-issue-billing-key-and-pay.json`,
	);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
