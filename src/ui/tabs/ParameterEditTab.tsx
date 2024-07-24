import { type ReadonlySignal, type Signal, useSignal } from "@preact/signals";
import { useState } from "react";
import type { FieldSignals, Fields } from "../../state/fields";
import JsonEditor from "../JsonEditor";
import FieldControls from "../field/FieldControls";
import Reset from "../mode/Reset";

interface ParameterEditTabProps {
	resetFn: () => void;
	parseJsonFailedSignal: ReadonlySignal<boolean>;
	isEmptyJsonSignal: ReadonlySignal<boolean>;
	resetCountSignal: ReadonlySignal<number>;
	jsonTextSignal: Signal<string>;
	forQa: React.ReactNode;
	prependControls?: React.ReactNode;
	fields: Fields;
	fieldSignals: FieldSignals;
}

export const ParameterEditTab = ({
	resetFn,
	parseJsonFailedSignal,
	isEmptyJsonSignal,
	resetCountSignal,
	jsonTextSignal,
	forQa,
	prependControls,
	fields,
	fieldSignals,
}: ParameterEditTabProps) => {
	const [isJsonOpen, setIsJsonOpen] = useState(isEmptyJsonSignal.value);
	return (
		<div className="flex flex-col gap-2 md:pb-80">
			<Reset resetFn={resetFn} />
			<details open={isJsonOpen}>
				<summary
					className={`text-xs ${
						parseJsonFailedSignal.value ? "text-red-700" : "text-slate-500"
					} cursor-pointer`}
				>
					추가 파라미터 (JSON{parseJsonFailedSignal.value && " 파싱 실패"})
				</summary>
				<JsonEditor
					key={resetCountSignal.value}
					value={jsonTextSignal.value}
					onChange={(json) => {
						jsonTextSignal.value = json;
					}}
					onReset={() => {
						setIsJsonOpen(true);
					}}
				/>
				<details className="open:py-2 opacity-0 hover:opacity-100 open:opacity-100 transition-all delay-100">
					<summary className="text-xs text-slate-500 cursor-pointer">
						포트원 내부 QA 전용 설정
					</summary>
					{forQa}
				</details>
			</details>
			{prependControls}
			<FieldControls fields={fields} fieldSignals={fieldSignals} />
		</div>
	);
};
