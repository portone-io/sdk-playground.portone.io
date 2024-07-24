import {
	type ReadonlySignal,
	type Signal,
	signal,
	useComputed,
} from "@preact/signals";
import type * as React from "react";
import { useCallback } from "react";
import { useMediaQueryMatches } from "../../misc/utils";
import type { FieldSignals, Fields } from "../../state/fields";
import { type Tab, selectedTabSignal } from "../../state/view";
import { RequiredIndicator } from "../../ui/Control";
import Tabs, { type TabItem } from "../../ui/Tabs";
import { CodeExampleTab } from "../tabs/CodeExampleTab";
import { JsonEditTab } from "../tabs/JsonEditTab";
import { ParameterEditTab } from "../tabs/ParameterEditTab";

interface ViewProps {
	forQa: React.ReactNode;
	jsonValueSignal: ReadonlySignal<Record<string, unknown>>;
	isEmptyJsonSignal: ReadonlySignal<boolean>;
	jsonTextSignal: Signal<string>;
	codePreviewSignal: ReadonlySignal<string>;
	fields: Fields;
	fieldSignals: FieldSignals;
	hidePaymentNotice?: boolean;
	configObjectSignal: ReadonlySignal<Record<string, unknown>>;
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
	configObjectSignal,
	onReset,
}: ViewProps) => {
	const hasNarrowWindow = useMediaQueryMatches("(max-width: 768px)");
	const parseJsonFailedSignal = useComputed(
		() => jsonValueSignal.value == null,
	);
	const resetCountSignal = signal(0);
	const resetFn = useCallback(() => {
		onReset();
		++resetCountSignal.value;
	}, [onReset, resetCountSignal]);

	const parameterEditTab = {
		title: "파라미터 입력",
		key: "parameter",
		children: (
			<ParameterEditTab
				fields={fields}
				fieldSignals={fieldSignals}
				forQa={forQa}
				isEmptyJsonSignal={isEmptyJsonSignal}
				jsonTextSignal={jsonTextSignal}
				parseJsonFailedSignal={parseJsonFailedSignal}
				resetCountSignal={resetCountSignal}
				resetFn={resetFn}
			/>
		),
	} satisfies TabItem<Tab>;
	const codeExampleTab = {
		title: "연동 코드 예시",
		key: "example",
		children: <CodeExampleTab codePreviewSignal={codePreviewSignal} />,
	} satisfies TabItem<Tab>;
	const jsonEditTab = {
		title: "JSON 입력",
		key: "json",
		children: (
			<JsonEditTab
				configObjectSignal={configObjectSignal}
				fieldSignals={fieldSignals}
				jsonTextSignal={jsonTextSignal}
			/>
		),
	} satisfies TabItem<Tab>;
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
				{hasNarrowWindow.value === false && (
					<Tabs
						onSelect={(key) => {
							selectedTabSignal.value = {
								...selectedTabSignal.value,
								left: key,
							};
						}}
						selectedTab={selectedTabSignal.value.left}
						tabs={[parameterEditTab, jsonEditTab]}
					/>
				)}
				<Tabs
					onSelect={(key) => {
						selectedTabSignal.value = {
							...selectedTabSignal.value,
							right: key,
						};
					}}
					selectedTab={selectedTabSignal.value.right}
					tabs={[
						{ ...parameterEditTab, visible: hasNarrowWindow.value },
						{ ...jsonEditTab, visible: hasNarrowWindow.value },
						codeExampleTab,
					]}
				/>
			</div>
		</>
	);
};
