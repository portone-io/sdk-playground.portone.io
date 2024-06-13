import { computed, signal } from "@preact/signals";
import type { Signal } from "@preact/signals";
import { parse as parseErrorStack } from "error-stack-parser-es";
import type { ReactNode } from "react";
import type { MajorVersion, SdkVersion } from "../sdk";
import persisted, { prefix } from "./persisted";

export interface AppMode {
	sdkVersion: SdkVersion;
	fn: ModeFnKey;
}
export const appModeSignal = persisted<AppMode>(
	localStorage,
	`${prefix}.appMode`,
	{ sdkVersion: "2.0.0", fn: "v2-pay" },
);

export function getMajorVersion(sdkVersion: SdkVersion): MajorVersion {
	const major = sdkVersion.split(".").shift();
	if (major === "1") return "v1";
	if (major === "2") return "v2";
	throw new Error(`Unsupported major version: ${major}`);
}

export type ModeFnKey = keyof typeof modeFns;
export const modeFns = {
	"v1-pay": {
		label: "결제",
		stateModule: () => import("./v1-pay"),
	},
	"v1-cert": {
		label: "본인인증",
		stateModule: () => import("./v1-cert"),
	},
	"v1-load-ui": {
		label: "PG 제공 UI",
		stateModule: () => import("./v1-load-ui"),
	},
	"v2-pay": {
		label: "결제",
		stateModule: () => import("./v2-pay"),
	},
	"v2-identity-verification": {
		label: "본인인증",
		stateModule: () => import("./v2-identity-verification"),
	},
	"v2-load-payment-ui": {
		label: "PG 결제 UI",
		stateModule: () => import("./v2-load-payment-ui"),
	},
	"v2-issue-billing-key": {
		label: "빌링 키 발급",
		stateModule: () => import("./v2-issue-billing-key"),
	},
	"v2-issue-billing-key-and-pay": {
		label: "빌링 키 발급 및 결제",
		stateModule: () => import("./v2-issue-billing-key-and-pay"),
	},
} satisfies {
	[key: string]: {
		label: string;
		stateModule: () => Promise<StateModule>;
	};
};
export const modeFnKeysPerVersion: { [key in SdkVersion]: ModeFnKey[] } = {
	"2.0.0": [
		"v2-pay",
		"v2-identity-verification",
		"v2-load-payment-ui",
		"v2-issue-billing-key",
		"v2-issue-billing-key-and-pay",
	],
	"1.3.0": ["v1-pay", "v1-cert", "v1-load-ui"],
	"1.2.1": ["v1-pay", "v1-cert"],
	"1.2.0": ["v1-pay", "v1-cert"],
	"1.1.9-rc": ["v1-pay", "v1-cert"],
	"1.1.8": ["v1-pay", "v1-cert"],
	"1.1.8-rc": ["v1-pay", "v1-cert"],
	"1.1.7": ["v1-pay", "v1-cert"],
	"1.1.7-rc20180615": ["v1-pay", "v1-cert"],
	"1.1.7-rc20180406": ["v1-pay", "v1-cert"],
	"1.1.7-rc20180206": ["v1-pay", "v1-cert"],
	"1.1.7-ohouse": ["v1-pay", "v1-cert"],
	"1.1.6": ["v1-pay", "v1-cert"],
	"1.1.6-rc20171101": ["v1-pay", "v1-cert"],
	"1.1.6-rc": ["v1-pay", "v1-cert"],
	"1.1.6-20181005": ["v1-pay", "v1-cert"],
	"1.1.5": ["v1-pay", "v1-cert"],
	"1.1.4": ["v1-pay", "v1-cert"],
	"1.1.3": ["v1-pay", "v1-cert"],
	"1.1.2": ["v1-pay", "v1-cert"],
	"1.1.1": ["v1-pay", "v1-cert"],
	"1.1.0": ["v1-pay", "v1-cert"],
	"1.0.0": ["v1-pay", "v1-cert"],
};

export interface StateModule {
	playFnSignal: Signal<PlayFn>;
}
export const stateModulePromiseSignal = computed<Promise<StateModule>>(() =>
	modeFns[modeFnSignal.value].stateModule(),
);

export const sdkVersionSignal = computed(() => appModeSignal.value.sdkVersion);
export const modeFnSignal = computed(sanitizeModeFn);
function sanitizeModeFn(
	sdkVersion: SdkVersion = appModeSignal.value.sdkVersion,
	modeFn: ModeFnKey = appModeSignal.value.fn,
): ModeFnKey {
	const modes = modeFnKeysPerVersion[sdkVersion];
	return modes.includes(modeFn) ? modeFn : modes[0];
}
export function changeSdkVersion(sdkVersion: SdkVersion) {
	const oldSdkVersion = appModeSignal.value.sdkVersion;
	if (sdkVersion === oldSdkVersion) return;
	const fn = sanitizeModeFn(sdkVersion);
	appModeSignal.value = { ...appModeSignal.value, sdkVersion, fn };
}

export const waitingSignal = signal(false);
export type PlayFn = () => Promise<unknown>;
export const playFnSignal = computed(() => {
	const stateModulePromise = stateModulePromiseSignal.value;
	return async function play() {
		try {
			playResultSignal.value = undefined;
			waitingSignal.value = true;
			const stateModule = await stateModulePromise;
			const playFn = stateModule.playFnSignal.value;
			const response: unknown = await playFn();
			if (response === undefined || response === null) {
				throw new Error("playFn must return a value");
			}
			if (typeof response !== "object") {
				throw new Error(`Unexpected response: ${response}`);
			}
			const success = !("error_code" in response || "code" in response);
			playResultSignal.value = { success, response };
		} catch (error) {
			console.error(error);
			const errorStack =
				error instanceof Error ? buildErrorStack(error) : String(error);
			playResultSignal.value = { success: false, errorStack };
		} finally {
			waitingSignal.value = false;
		}
	};
});

function buildErrorStack(error: Error) {
	const stack = parseErrorStack(error);
	return (
		<>
			<span>
				{error.name}: {error.message}
			</span>
			<ul className="ml-12">
				{stack.map((frame) => (
					<li>
						at {frame.functionName} ({frame.fileName}:{frame.lineNumber}:
						{frame.columnNumber})
					</li>
				))}
			</ul>
		</>
	);
}
export interface PlayResult {
	success: boolean;
	response?: object;
	errorStack?: ReactNode;
}
export const playResultSignal = signal<PlayResult | undefined>(undefined);
