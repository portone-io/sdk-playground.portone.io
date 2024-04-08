import { computed, effect } from "@preact/signals";
import { toJs } from "./code";
import {
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	type Fields,
	resetFieldSignals,
} from "./fields";
import persisted, { prefix } from "./persisted";
import { paymentUITypeOptions, sdkV2Signal } from "./v2";
import { fields as v2PayFields } from "./v2-pay";
import { pgUiModalOpenSignal } from "./v1-load-ui";

export function reset() {
	resetFieldSignals(fields, fieldSignals);
	jsonTextSignal.value = "{}";
}

export const playFnSignal = computed(() => {
	const sdkV2 = sdkV2Signal.value;
	const configObject = configObjectSignal.value;
	return function loadPaymentUI() {
		if (!sdkV2) return Promise.reject(new Error("sdk not loaded"));
		return new Promise((resolve, reject) => {
			sdkV2.PortOne.loadPaymentUI(configObject, {
				onPaymentSuccess: resolve,
				onPaymentFail: resolve,
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
		`PortOne.loadPaymentUI(${toJs(configObject)});`,
		"</script>",
	].join("\n");
});

export const fields = {
	uiType: {
		required: true,
		label: "PG 결제 UI 형식",
		input: {
			type: "enum",
			placeholder: "PAYPAL_SPB",
			default: "",
			options: paymentUITypeOptions,
		},
	},
	...v2PayFields,
} satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v2-load-payment-ui.fields`,
	fields,
);
export const { jsonTextSignal, jsonValueSignal } = createJsonSignals(
	localStorage,
	`${prefix}.v2-load-payment-ui.json`,
);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
