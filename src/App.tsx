import { useComputed } from "@preact/signals";
import type * as React from "react";
import Header from "./Header";
import { appModeSignal, getMajorVersion, waitingSignal } from "./state/app";
import {
	pgUiModalOpenSignal,
	pgUiModalUiTypeSignal,
} from "./state/pg-ui-modal";
import Modal from "./ui/Modal";
import Mode from "./ui/mode/Mode";

const App: React.FC = () => {
	return (
		<div className="container px-4 my-4 m-auto flex flex-col">
			<Header />
			<Mode />
			<PgUiModal />
		</div>
	);
};
export default App;

const PgUiModal = () => {
	const open = pgUiModalOpenSignal.value;
	const majorVersion = useComputed(() =>
		getMajorVersion(appModeSignal.value.sdkVersion),
	);
	return (
		<Modal
			open={open}
			title="PG UI 영역"
			description="PG사 전용 UI가 여기에 그려집니다."
			onClose={() => {
				waitingSignal.value = false;
				pgUiModalOpenSignal.value = false;
				pgUiModalUiTypeSignal.value = null;
			}}
		>
			<div className="p-4">
				<div className="portone-ui-container" />
				{majorVersion.value === "v1" &&
					pgUiModalUiTypeSignal.value === "toss-brandpay-widget" && (
						<button
							id="portone-toss-brandpay-widget-button"
							type="button"
							className="w-full h-12 rounded-lg bg-orange-700 text-white font-bold"
						>
							결제하기
						</button>
					)}
			</div>
		</Modal>
	);
};
