import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import { type Signal, batch, useSignal } from "@preact/signals";
import CodeMirror from "@uiw/react-codemirror";
import { isEqual } from "es-toolkit";
import { isRecord } from "../../misc/utils";
import {
	type FieldSignals,
	type Fields,
	updateSignalsFromJson,
} from "../../state/fields";

interface JsonEditTabProps {
	configObjectSignal: Signal<Record<string, unknown>>;
	jsonTextSignal: Signal<string>;
	fields: Fields;
	fieldSignals: FieldSignals;
}

export const JsonEditTab = ({
	configObjectSignal,
	fields,
	fieldSignals,
	jsonTextSignal,
}: JsonEditTabProps) => {
	const code = useSignal(JSON.stringify(configObjectSignal.peek(), null, 2));
	const internalJsonObject = useSignal(configObjectSignal.peek());
	configObjectSignal.subscribe((newConfigObject) => {
		if (!isEqual(newConfigObject, internalJsonObject.value)) {
			batch(() => {
				code.value = JSON.stringify(newConfigObject, null, 2);
				internalJsonObject.value = newConfigObject;
			});
		}
	});

	return (
		<div className="flex flex-col h-full">
			<CodeMirror
				height="100%"
				value={code.value}
				extensions={[json(), linter(jsonParseLinter(), { delay: 100 })]}
				onChange={(text) => {
					try {
						const json = JSON.parse(text);
						if (!isRecord(json)) {
							return;
						}
						internalJsonObject.value = json;
					} catch {}
					if (!isEqual(configObjectSignal.peek(), internalJsonObject.peek())) {
						updateSignalsFromJson(
							internalJsonObject.peek(),
							fields,
							fieldSignals,
							jsonTextSignal,
						);
					}
				}}
			/>
		</div>
	);
};
