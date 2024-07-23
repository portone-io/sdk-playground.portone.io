import { reset as resetV2 } from "../../state/v2";
import {
	codePreviewSignal,
	configObjectSignal,
	fieldSignals,
	fields,
	isEmptyJsonSignal,
	jsonTextSignal,
	jsonValueSignal,
	reset,
} from "../../state/v2-issue-billing-key-and-pay";
import { View } from "./View";
import { ForQa } from "./v2";

export default function () {
	return (
		<View
			forQa={<ForQa />}
			fields={fields}
			fieldSignals={fieldSignals}
			jsonTextSignal={jsonTextSignal}
			jsonValueSignal={jsonValueSignal}
			codePreviewSignal={codePreviewSignal}
			isEmptyJsonSignal={isEmptyJsonSignal}
			configObjectSignal={configObjectSignal}
			onReset={() => {
				reset();
				resetV2();
			}}
		/>
	);
}
