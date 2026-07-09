import { computed } from "@preact/signals";
import { omit } from "es-toolkit";
import { sdkVersionSignal } from "./app";
import { toJs } from "./code";
import {
	createConfigObjectSignal,
	createFieldSignals,
	createJsonSignals,
	resetFieldSignals,
} from "./fields";
import type { Fields } from "./fields";
import { prefix } from "./persisted";
import { createAccountSignals, sdkV1Signal } from "./v1";
import { fields as v2PayFields } from "./v2-pay";

export function reset() {
	resetFieldSignals(fields, fieldSignals);
	jsonTextSignal.value = "{}";
}

export const playFnSignal = computed(() => {
	const sdkV1 = sdkV1Signal.value;
	const userCode = fieldSignals.userCode.valueSignal.value;
	const configObject = configObjectSignal.value;
	return async function naverZzim() {
		if (!sdkV1) throw new Error("sdk not loaded");
		if (!userCode) throw new Error("userCode is empty");
		const { IMP } = await sdkV1;
		accountSignals.impInit(IMP);
		return IMP.naver_zzim(configObject);
	};
});

export const codePreviewSignal = computed<string>(() => {
	const version = sdkVersionSignal.value;
	const accountCodePreview = accountSignals.codePreviewSignal.value;
	const configObject = omit(configObjectSignal.value, ["userCode", "tierCode"]);
	return [
		...(version === "1.3.0"
			? [`<script src="https://cdn.iamport.kr/v1/iamport.js"></script>`]
			: [
					`<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>`,
					`<script src="https://cdn.iamport.kr/js/iamport.payment-${version}.js"></script>`,
				]),
		"",
		`<button onclick="naverZzim()">찜</button>`,
		"",
		"<script>",
		accountCodePreview,
		"",
		"function naverZzim() {",
		`  IMP.naver_zzim(${toJs(configObject, "  ", 1)});`,
		"}",
		"</script>",
	].join("\n");
});

export const fields = {
	userCode: {
		required: true,
		label: "고객사 식별코드",
		input: {
			type: "text",
			placeholder: "imp00000000",
			default: "",
		},
	},
	tierCode: {
		required: false,
		label: "하위상점(Tier) 코드",
		input: {
			type: "text",
			placeholder: "000",
			default: "",
		},
	},
	channelKey: v2PayFields.channelKey,
} as const satisfies Fields;

export const fieldSignals = createFieldSignals(
	localStorage,
	`${prefix}.v1-naver-zzim.fields`,
	fields,
);
export const accountSignals = createAccountSignals(fieldSignals);
export const { jsonTextSignal, jsonValueSignal, isEmptyJsonSignal } =
	createJsonSignals(localStorage, `${prefix}.v1-naver-zzim.json`);
export const configObjectSignal = createConfigObjectSignal({
	fields,
	fieldSignals,
	jsonValueSignal,
});
