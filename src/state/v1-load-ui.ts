import { computed, signal } from "@preact/signals";
import { toJs } from "./code";
import {
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	resetFieldSignals,
} from "./fields";
import persisted, { prefix } from "./persisted";
import { createAccountSignals, sdkV1Signal } from "./v1";
import { fields as v1PayFields } from "./v1-pay";

export function reset() {
	resetFieldSignals(fields, fieldSignals);
	uiTypeSignal.value = defaultUiType;
	jsonTextSignal.value = "{}";
}

const defaultUiType = "";
export const uiTypeSignal = persisted(
	localStorage,
	`${prefix}.v1-load-ui.uiType`,
	defaultUiType,
);

export const pgUiModalOpenSignal = signal(false);
export const playFnSignal = computed(() => {
	const sdkV1 = sdkV1Signal.value;
	const userCode = fieldSignals.userCode.valueSignal.value;
	const uiType = uiTypeSignal.value;
	const configObject = configObjectSignal.value;
	return async function loadUI() {
		if (!sdkV1) throw new Error("sdk not loaded");
		if (!userCode) throw new Error("userCode is empty");
		const { IMP } = await sdkV1;
		accountSignals.impInit(IMP);
		return new Promise((resolve) => {
			IMP.loadUI(uiType, configObject, (response) => {
				resolve(response);
				pgUiModalOpenSignal.value = false;
			});
			pgUiModalOpenSignal.value = true;
		});
	};
});

export const codePreviewSignal = computed<string>(() => {
	const accountCodePreview = accountSignals.codePreviewSignal.value;
	const uiType = uiTypeSignal.value;
	const uiTypeRepr = JSON.stringify(uiType);
	const configObject = configObjectSignal.value;
	configObject.userCode = undefined;
	configObject.tierCode = undefined;
	return [
		`<script src="https://cdn.iamport.kr/v1/iamport.js"></script>`,
		"",
		`<div class="portone-ui-container" data-portone-ui-type=${uiTypeRepr}>`,
		"  <!-- 여기에 PG사 전용 버튼이 그려집니다 -->",
		"</div>",
		"",
		"<script>",
		accountCodePreview,
		`IMP.loadUI(${uiTypeRepr}, ${toJs(configObject)});`,
		"</script>",
	].join("\n");
});

export const fields = v1PayFields;

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
