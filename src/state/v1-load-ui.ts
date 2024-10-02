import { computed, signal } from "@preact/signals";
import { omit } from "es-toolkit";
import { toJs } from "./code";
import {
	type Fields,
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	resetFieldSignals,
} from "./fields";
import { prefix } from "./persisted";
import { pgUiModalOpenSignal, pgUiModalUiTypeSignal } from "./pg-ui-modal";
import { createAccountSignals, sdkV1Signal } from "./v1";
import { fields as v1PayFields } from "./v1-pay";

export function reset() {
	resetFieldSignals(fields, fieldSignals);
	jsonTextSignal.value = "{}";
}
export const playFnSignal = computed(() => {
	const sdkV1 = sdkV1Signal.value;
	const userCode = fieldSignals.userCode.valueSignal.value;
	const uiType = fieldSignals.uiType.valueSignal.value;
	const uiTypeRepr = String(uiType);
	const configObject = configObjectSignal.value;
	return async function loadUI() {
		if (!sdkV1) throw new Error("sdk not loaded");
		if (!userCode) throw new Error("userCode is empty");
		const { IMP } = await sdkV1;
		accountSignals.impInit(IMP);
		return new Promise((resolve) => {
			IMP.loadUI(uiTypeRepr, configObject, (response) => {
				resolve(response);
				pgUiModalOpenSignal.value = false;
				pgUiModalUiTypeSignal.value = null;
			});
			pgUiModalOpenSignal.value = true;
			pgUiModalUiTypeSignal.value = uiTypeRepr;
		});
	};
});

export const codePreviewSignal = computed<string>(() => {
	const accountCodePreview = accountSignals.codePreviewSignal.value;
	const uiType = fieldSignals.uiType.valueSignal.value;
	const uiTypeRepr = JSON.stringify(uiType);
	const configObject = omit(configObjectSignal.value, [
		"userCode",
		"tierCode",
		"uiType",
	]);
	const brandPay = uiType === "toss-brandpay-widget";
	return [
		`<script src="https://cdn.iamport.kr/v1/iamport.js"></script>`,
		"",
		`<div class="portone-ui-container" data-portone-ui-type=${uiTypeRepr}>`,
		"  <!-- 여기에 PG사 전용 버튼이 그려집니다 -->",
		"</div>",
		brandPay
			? [
					"",
					`<div id="portone-toss-brandpay-widget-button">`,
					"  <!-- 결제하기 버튼 역할을 하는 element -->",
					"</div>",
					"",
				].join("\n")
			: "",
		"<script>",
		accountCodePreview,
		`IMP.loadUI(${uiTypeRepr}, ${toJs(configObject)});`,
		"</script>",
	].join("\n");
});

export const fields = {
	uiType: {
		required: true,
		label: "UI 타입",
		input: {
			type: "enum",
			options: [
				"payment-bridge",
				"paypal-spb",
				"paypal-rt",
				"toss-brandpay-widget",
			],
			default: "",
			placeholder: "paypal-spb",
		},
	},
	...v1PayFields,
} as const satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v1-load-ui.fields`,
	fields,
);
export const accountSignals = createAccountSignals(fieldSignals);
export const { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal } =
	createJsonSignals(localStorage, `${prefix}.v1-load-ui.json`);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
