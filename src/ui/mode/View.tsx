import {
	type ReadonlySignal,
	type Signal,
	signal,
	useComputed,
	useSignal,
} from "@preact/signals";
import type * as React from "react";
import { useWindowSize } from "../../misc/utils";
import { selectedTabSignal } from "../../state/app";
import type { FieldSignals, Fields } from "../../state/fields";
import { RequiredIndicator } from "../../ui/Control";
import HtmlEditor from "../../ui/HtmlEditor";
import JsonEditor from "../../ui/JsonEditor";
import Tabs from "../Tabs";
import FieldControls from "../field/FieldControls";
import Reset from "./Reset";

interface ViewProps {
	forQa: React.ReactNode;
	jsonValueSignal: ReadonlySignal<Record<string, unknown>>;
	isEmptyJsonSignal: ReadonlySignal<boolean>;
	jsonTextSignal: Signal<string>;
	codePreviewSignal: ReadonlySignal<string>;
	fields: Fields;
	fieldSignals: FieldSignals;
	prependControls?: React.ReactNode;
	hidePaymentNotice?: boolean;
	onReset: () => void;
}

export const View = ({
	forQa,
	jsonValueSignal,
	isEmptyJsonSignal,
	jsonTextSignal,
	codePreviewSignal,
	fields,
	fieldSignals,
	hidePaymentNotice,
	prependControls,
	onReset,
}: ViewProps) => {
	const parseJsonFailed = jsonValueSignal.value == null;
	const isJsonOpen = useSignal(isEmptyJsonSignal.value);
	const windowSize = useWindowSize();
	const hasNarrowWindow = useComputed(
		() => windowSize.value.width !== undefined && windowSize.value.width < 768,
	);
	const resetCountSignal = signal(0);
	const resetFn = () => {
		onReset();
		++resetCountSignal.value;
	};

	const parameterEdtior = (
		<div className="flex flex-col gap-2 md:pb-80">
			<Reset resetFn={resetFn} />
			<details open={isJsonOpen.value}>
				<summary
					className={`text-xs ${
						parseJsonFailed ? "text-red-700" : "text-slate-500"
					} cursor-pointer`}
				>
					추가 파라미터 (JSON{parseJsonFailed && " 파싱 실패"})
				</summary>
				<JsonEditor
					key={resetCountSignal.value}
					value={jsonTextSignal.value}
					onChange={(json) => {
						jsonTextSignal.value = json;
					}}
					onReset={() => {
						isJsonOpen.value = true;
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
	return (
		<>
			<p className="mb-4 text-xs text-slate-500">
				{hidePaymentNotice !== true && (
					<div>
						PG가 콘솔에서 테스트로 설정된 경우, 승인된 결제 건은 매일
						자정(23:00~23:50분 사이)에 자동으로 취소됩니다.
						<br />
					</div>
				)}
				"<RequiredIndicator />" 표시는 필수입력 항목을 의미합니다. 상황에 따라서
				필수입력 표시가 아니어도 입력이 필요할 수 있습니다.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{hasNarrowWindow.value === false && parameterEdtior}
				<Tabs
					onSelect={(key) => {
						selectedTabSignal.value = key;
					}}
					selectedTab={selectedTabSignal.value}
					tabs={[
						{
							title: "파라미터 입력",
							key: "parameter",
							children: parameterEdtior,
							visible: hasNarrowWindow.value,
						},
						{
							title: "연동 코드 예시",
							key: "example",
							children: (
								<div
									className="md:sticky top-4 flex flex-col"
									style={{ height: "calc(100vh - 2rem)" }}
								>
									<div className="flex-1">
										<HtmlEditor
											className="h-full"
											editable={false}
											value={codePreviewSignal.value}
										/>
									</div>
								</div>
							),
						},
					]}
				/>
			</div>
		</>
	);
};
