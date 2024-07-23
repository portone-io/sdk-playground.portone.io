import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import { type Signal, useSignal } from "@preact/signals";
import CodeMirror from "@uiw/react-codemirror";
import { isEqual } from "es-toolkit";
import { useState } from "react";
import { isRecord } from "../../misc/utils";
import { type FieldSignals, updateSignalsFromJson } from "../../state/fields";

interface JsonEditTabProps {
	configObjectSignal: Signal<Record<string, unknown>>;
	jsonTextSignal: Signal<string>;
	fieldSignals: FieldSignals;
}

export const JsonEditTab = ({
	configObjectSignal,
	fieldSignals,
	jsonTextSignal,
}: JsonEditTabProps) => {
	const code = useSignal(JSON.stringify(configObjectSignal.peek(), null, 2));
	const [internalJsonObject, setInternalJsonObject] = useState(
		configObjectSignal.peek(),
	);
	configObjectSignal.subscribe((newConfigObject) => {
		if (!isEqual(newConfigObject, internalJsonObject)) {
			code.value = JSON.stringify(newConfigObject, null, 2);
			setInternalJsonObject(newConfigObject);
		}
	});

	return (
		<div className="flex flex-col h-full">
			<CodeMirror
				height="100%"
				value={code.value}
				extensions={[json(), linter(jsonParseLinter(), { delay: 100 })]}
				onChange={(text) => {
					let json = null;
					try {
						json = JSON.parse(text);
					} catch {}
					if (!isRecord(json)) {
						return;
					}
					setInternalJsonObject(json);
					if (!isEqual(configObjectSignal.peek(), json)) {
						updateSignalsFromJson(json, fieldSignals, jsonTextSignal);
					}
				}}
			/>
		</div>
	);
};
