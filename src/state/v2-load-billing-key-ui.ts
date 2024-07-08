import { computed } from "@preact/signals";
import { toJs } from "./code";
import {
	type Fields,
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	resetFieldSignals,
} from "./fields";
import persisted, { prefix } from "./persisted";
import { pgUiModalOpenSignal } from "./v1-load-ui";
import { IssueBillingKeyUITypeOptions, sdkV2Signal } from "./v2";
import { fields as v2IssueBillingKeyFields } from "./v2-issue-billing-key";

export function reset() {
	resetFieldSignals(fields, fieldSignals);
	jsonTextSignal.value = "{}";
}

export const playFnSignal = computed(() => {
	const sdkV2 = sdkV2Signal.value;
	const configObject = configObjectSignal.value;
	return function loadIssueBillingKeyUI() {
		if (!sdkV2) return Promise.reject(new Error("sdk not loaded"));
		return new Promise((resolve, reject) => {
			sdkV2.PortOne.loadIssueBillingKeyUI(configObject, {
				onIssueBillingKeySuccess: resolve,
				onIssueBillingKeyFail: resolve,
			}).catch(reject);
			pgUiModalOpenSignal.value = true;
		}).finally(() => {
			pgUiModalOpenSignal.value = false;
		});
	};
});

export const codePreviewSignal = computed<string>(() => {
	const configObject = configObjectSignal.value;
	const uiType = fieldSignals.uiType.valueSignal.value;
	const uiTypeRepr = JSON.stringify(uiType);
	return [
		`<script src="https://cdn.portone.io/v2/browser-sdk.js"></script>`,
		"",
		`<div class="portone-ui-container" data-portone-ui-type=${uiTypeRepr}>`,
		"  <!-- 여기에 PG사 전용 버튼이 그려집니다 -->",
		"</div>",
		"",
		"<script>",
		`PortOne.loadIssueBillingKeyUI(${toJs(configObject)});`,
		"</script>",
	].join("\n");
});

export const fields = {
	uiType: {
		required: true,
		label: "PG 정기결제 UI 형식",
		input: {
			type: "enum",
			placeholder: "PAYPAL_RT",
			default: "PAYPAL_RT",
			options: IssueBillingKeyUITypeOptions,
		},
	},
	storeId: v2IssueBillingKeyFields.storeId,
	channelKey: v2IssueBillingKeyFields.channelKey,
	billingKeyMethod: {
		required: true,
		label: v2IssueBillingKeyFields.billingKeyMethod.label,
		input: {
			type: "enum",
			options: ["PAYPAL"],
			default: "PAYPAL",
			placeholder: "PAYPAL",
		},
	},
	issueName: v2IssueBillingKeyFields.issueName,
	issueId: v2IssueBillingKeyFields.issueId,
	customer: v2IssueBillingKeyFields.customer,
} as const satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v2-load-billing-key-ui.fields`,
	fields,
);
export const { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal } =
	createJsonSignals(localStorage, `${prefix}.v2-load-billing-key-ui.json`);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
