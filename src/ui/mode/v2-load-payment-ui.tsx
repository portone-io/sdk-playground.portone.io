import { reset as resetV2 } from "../../state/v2";
import {
	codePreviewSignal,
	fieldSignals,
	fields,
	isEmptyJsonSignal,
	jsonTextSignal,
	jsonValueSignal,
	reset,
} from "../../state/v2-load-payment-ui";
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
			onReset={() => {
				reset();
				resetV2();
			}}
		/>
	);
}
