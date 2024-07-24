import { reset as resetV1 } from "../../state/v1";
import {
	codePreviewSignal,
	configObjectSignal,
	fieldSignals,
	fields,
	isEmptyJsonSignal,
	jsonTextSignal,
	jsonValueSignal,
	reset,
} from "../../state/v1-load-ui";
import { View } from "./View";
import { ForQa } from "./v1";

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
				resetV1();
			}}
		/>
	);
}
