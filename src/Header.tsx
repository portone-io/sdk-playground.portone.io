import { EditorView } from "@codemirror/view";
import { computed } from "@preact/signals";
import type * as React from "react";
import { match } from "ts-pattern";
import { type SdkVersion, isSupportedVersion, sdkVersions } from "./sdk";
import {
	appModeSignal,
	changeSdkVersion,
	modeFnKeysPerVersion,
	modeFnSignal,
	modeFns,
	playFnSignal,
	playResultSignal,
	sdkVersionSignal,
	waitingSignal,
} from "./state/app";
import type { ModeFnKey } from "./state/app";
import { fieldSignals as v1CertFieldSignals } from "./state/v1-cert";
import { fieldSignals as v1LoadUiFieldSignals } from "./state/v1-load-ui";
import { fieldSignals as v1NaverpayZzimFieldSignals } from "./state/v1-naverpay-zzim";
import { fieldSignals as v1PayFieldSignals } from "./state/v1-pay";
import { fieldSignals as v2IdentityVerificationFieldSignals } from "./state/v2-identity-verification";
import { fieldSignals as v2IssueBillingKeyFieldSignals } from "./state/v2-issue-billing-key";
import { fieldSignals as v2IssueBillingKeyAndPayFieldSignals } from "./state/v2-issue-billing-key-and-pay";
import { fieldSignals as v2LoadBillingKeyUiFieldSignals } from "./state/v2-load-billing-key-ui";
import { fieldSignals as v2LoadPaymentUiFieldSignals } from "./state/v2-load-payment-ui";
import { fieldSignals as v2PayFieldSignals } from "./state/v2-pay";
import JsonEditor from "./ui/JsonEditor";
import TrialModal, { trialModalOpenSignal } from "./ui/TrialModal";

export const showTrialSignal = computed(() => {
	const modeFn = modeFnSignal.value;
	const v1PayUserCode = v1PayFieldSignals.userCode.valueSignal.value;
	const v1CertUserCode = v1CertFieldSignals.userCode.valueSignal.value;
	const v1LoadUiUserCode = v1LoadUiFieldSignals.userCode.valueSignal.value;
	const v1NaverpayZzimUserCode =
		v1NaverpayZzimFieldSignals.userCode.valueSignal.value;
	const v2PayStoreId = v2PayFieldSignals.storeId.valueSignal.value;
	const v2LoadPaymentUiStoreId =
		v2LoadPaymentUiFieldSignals.storeId.valueSignal.value;
	const v2LoadBillingKeyUiStoreId =
		v2LoadBillingKeyUiFieldSignals.storeId.valueSignal.value;
	const v2IdentityVerificationStoreId =
		v2IdentityVerificationFieldSignals.storeId.valueSignal.value;
	const v2IssueBillingKeyStoreId =
		v2IssueBillingKeyFieldSignals.storeId.valueSignal.value;
	const v2IssueBillingKeyAndPayStoreId =
		v2IssueBillingKeyAndPayFieldSignals.storeId.valueSignal.value;

	return match(modeFn)
		.with("v1-pay", () => !v1PayUserCode)
		.with("v1-cert", () => !v1CertUserCode)
		.with("v1-load-ui", () => !v1LoadUiUserCode)
		.with("v1-naverpay-zzim", () => !v1NaverpayZzimUserCode)
		.with("v2-pay", () => !v2PayStoreId)
		.with("v2-load-payment-ui", () => !v2LoadPaymentUiStoreId)
		.with("v2-load-billing-key-ui", () => !v2LoadBillingKeyUiStoreId)
		.with("v2-identity-verification", () => !v2IdentityVerificationStoreId)
		.with("v2-issue-billing-key", () => !v2IssueBillingKeyStoreId)
		.with("v2-issue-billing-key-and-pay", () => !v2IssueBillingKeyAndPayStoreId)
		.exhaustive();
});

const Header: React.FC = () => {
	const playResult = playResultSignal.value;
	const sdkVersion = sdkVersionSignal.value;
	const modeFn = modeFnSignal.value;
	return (
		<>
			<header className="relative flex flex-col sm:flex-row">
				<div className="flex-1 flex flex-col">
					<h1 className="inline-flex items-center">
						<Logo className="h-6" aria-label="포트원" />
						<span className="ml-2">SDK 놀이터</span>
					</h1>
					<div>
						<span>SDK 버전</span>
						<select
							className="ml-2"
							onChange={(e) => {
								changeSdkVersion(e.target.value as SdkVersion);
							}}
						>
							{sdkVersions.filter(isSupportedVersion).map((v) => (
								<option key={v} value={v} selected={v === sdkVersion}>
									{v}
								</option>
							))}
						</select>
						<select
							onChange={(e) => {
								appModeSignal.value = {
									...appModeSignal.value,
									fn: e.target.value as ModeFnKey,
								};
							}}
						>
							{modeFnKeysPerVersion[sdkVersion].map((v) => {
								const { label } = modeFns[v];
								return (
									<option key={v} value={v} selected={v === modeFn}>
										{label}
									</option>
								);
							})}
						</select>
					</div>
				</div>
				<PlayButton />
				<TrialModal />
				{playResult && (
					<div className="z-10 absolute -bottom-4 right-0 w-full md:w-1/2 text-white">
						<div className="absolute top-0 right-0 w-full h-full px-2">
							<div className="absolute -top-2 right-1/2 sm:right-12 w-0 h-0 border-[0.25rem] border-transparent border-r-black border-b-black" />
							<div className="sm:hidden absolute -top-2 left-1/2 sm:right-12 w-0 h-0 border-[0.25rem] border-transparent border-l-black border-b-black" />
							<div className="relative p-2 bg-black">
								<button
									type="button"
									className="absolute right-2"
									onClick={() => {
										playResultSignal.value = undefined;
									}}
								>
									close
								</button>
								{playResult.success ? "실행 성공" : "실행 실패"}
								{playResult.response != null && (
									<JsonEditor
										className="text-black"
										value={JSON.stringify(playResult.response, null, 2)}
										extensions={[EditorView.lineWrapping]}
										editable={false}
									/>
								)}
								{playResult.errorStack != null && (
									<div className="flex flex-col font-mono bg-white text-black whitespace-nowrap overflow-auto px-1">
										{playResult.errorStack}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</header>
			<hr className="my-4" />
		</>
	);
};
export default Header;

const PlayButton: React.FC = () => {
	const waiting = waitingSignal.value;
	const play = playFnSignal.value;
	const showTrial = showTrialSignal.value;
	const openTrialModal = () => {
		trialModalOpenSignal.value = true;
	};
	const doBounce = showTrial && !trialModalOpenSignal.value;
	return (
		<button
			type="button"
			className={`mt-4 sm:mt-0 inline-flex items-center justify-center sm:w-24 h-12 rounded-lg bg-orange-700 text-white font-bold ${
				doBounce ? "bounce" : ""
			}`}
			onClick={waiting ? undefined : showTrial ? openTrialModal : play}
		>
			{waiting ? <WaitingIndicator /> : showTrial ? "체험하기" : "실행"}
		</button>
	);
};

const WaitingIndicator: React.FC = () => {
	return (
		<svg className="waiting" width="1rem" height="1rem" viewBox="0 0 30 30">
			<title>로딩 중...</title>
			<circle
				cx="15"
				cy="15"
				r="12"
				stroke="white"
				strokeWidth="6"
				strokeLinecap="round"
				fill="transparent"
			/>
		</svg>
	);
};

interface LogoProps extends React.HTMLAttributes<SVGElement> {}
const Logo: React.FC<LogoProps> = (props) => {
	return (
		<svg
			viewBox="0 0 100 29"
			xmlns="http://www.w3.org/2000/svg"
			className="fill-black"
			{...props}
		>
			<title>포트원 로고</title>
			<path d="m43.9921 10.9461v-2.96172h-2.3712s-.001 2.96172 0 2.96172c-.3821.0049-2.0076 0-2.1894 0-4.6597 0-6.1355 1.7608-6.1491 1.9259.0029-.033-.0049-1.3234-.0049-1.9249h-2.3556v11.9121h2.3566l.0019-7.4141c.0282-1.2224 1.0053-2.0697 2.0698-2.3204.6358-.1497 1.3261-.2488 1.9794-.2497 1.6129-.002 2.6774-.003 4.2903-.0039v5.3171c0 1.5499-.0515 3.3213 1.5059 4.1832.6164.3411 1.3271.4305 2.0212.4596.1507.0068 2.6084.0408 2.6084.0272v-.0038l2.3041.0038v-1.9443c-1.6294 0-2.797.1001-4.4215-.0136-.4774-.0331-.9771-.1817-1.2814-.551-.488-.5937-.3665-1.5518-.3665-2.267v-5.2112h5.8711l2.4558-1.9259h-8.3269z" />
			<path d="m23.0485 10.7422h-.5512c-3.7274 0-6.6926 2.8685-6.6926 6.1664 0 3.297 2.6473 6.1665 6.6926 6.1665h.5512c4.2641 0 6.6926-2.8685 6.6926-6.1665 0-3.297-2.938-6.1664-6.6926-6.1664zm4.335 6.1664c0 2.2388-1.607 4.2551-4.4283 4.2551h-.3646c-2.6764 0-4.4283-2.0172-4.4283-4.2551 0-2.2388 1.9619-4.2551 4.4283-4.2551h.3646c2.4849 0 4.4283 2.0173 4.4283 4.2551z" />
			<path d="m15.7603 10.6325c-.246-2.12026-1.3951-3.42428-3.4047-4.11225-.9051-.309-1.8394-.44018-2.79212-.44213h-9.56348v16.79978h2.32452v-6.3724h.44624c2.0698 0 4.14058.033 6.21038.0194.63679-.0039 1.27646-.0418 1.91036-.1127.8701-.0972 1.7033-.3459 2.4713-.7774 1.7714-.996 2.6522-2.8062 2.3975-5.0013zm-4.3312 3.7061c-.592.2002-1.2269.2439-1.84423.2546-2.25452.0388-4.66459.0155-6.92008.0145-.09625 0-.1925-.0145-.30819-.0243v-6.58616h.33833c2.26618 0 4.68695-.02624 6.95313.01652.62614.01166 1.27454.14673 1.86954.36827 1.2648.47128 1.9415 1.51781 1.9269 2.95107-.0146 1.441-.734 2.5702-2.0163 3.0045z" />
			<path d="m84.2777 13.4166c-.4025-.7609-.9673-1.3497-1.6945-1.7675-.7282-.4169-1.6635-.6569-2.5919-.6569-2.3848 0-3.3463 1.1194-3.7119 1.7529v-1.7529h-2.3575v11.8645h2.3575v-6.7087c0-1.5314 1.2036-3.3076 2.9925-3.3076.9702 0 1.8821.3129 2.4305.9386.5473.6258.8215 1.5178.8215 2.6761v6.4016h2.3575v-6.765c0-1.0232-.2012-1.9152-.6027-2.6761z" />
			<path d="m63.497 5.88281h-.7612c-5.1478 0-9.2436 3.95484-9.2436 8.59379 0 4.6389 3.6574 8.5937 9.2436 8.5937h.7612c5.8896 0 9.2437-3.9548 9.2437-8.5937 0-4.63895-4.057-8.59379-9.2437-8.59379zm-.2547 15.27709h-.2508c-4.2184 0-7.1417-3.1094-7.1417-6.6921s3.2549-6.69211 7.1417-6.69211h.2508c3.916 0 7.1418 3.10941 7.1418 6.69211s-2.6949 6.6921-7.1418 6.6921z" />
			<path d="m96.5554 19.7907c-.7554.8278-1.887 1.3662-3.3434 1.3662h-.3646c-2.2788 0-3.8858-1.4624-4.3136-3.2786h11.3912c.0486-.3196.0739-.6461.0739-.9775 0-3.297-2.938-6.1664-6.6926-6.1664h-.5512c-3.7274 0-6.6926 2.8684-6.6926 6.1664s2.6473 6.1664 6.6926 6.1664h.5512c2.9322 0 4.9971-1.3565 6.0004-3.2765h-2.7503zm-3.708-7.145h.3646c2.132 0 3.8645 1.4858 4.3137 3.3213h-8.9909c.453-1.8355 2.1962-3.3213 4.3126-3.3213z" />
		</svg>
	);
};
