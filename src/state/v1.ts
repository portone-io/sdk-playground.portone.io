import {
	type ReadonlySignal,
	type Signal,
	computed,
	effect,
	signal,
} from "@preact/signals";
import { P, match } from "ts-pattern";
import { importStatic } from "../misc/import-static";
import type { SdkV1, SdkV1Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import type { FieldSignals } from "./fields";
import persisted, { prefix } from "./persisted";
import { createUrlSignal } from "./url";

declare global {
	interface Window {
		jQuery?: typeof import("jquery");
	}
}

export function reset() {
	coreServerSignal.value = defaultCoreServer;
	checkoutServerSignal.value = defaultCheckoutServer;
}

const isSdkPreview = Boolean(import.meta.env.VITE_SDK_PREVIEW);

const defaultCoreServer = import.meta.env.VITE_CORE_SERVER_URL;
export const coreServerSignal = isSdkPreview
	? signal(defaultCoreServer)
	: persisted(localStorage, `${prefix}.v1.coreServer`, defaultCoreServer);
export const coreServerUrlSignal = createUrlSignal(coreServerSignal);

const defaultCheckoutServer = import.meta.env.VITE_CHECKOUT_SERVER_URL;
export const checkoutServerSignal = isSdkPreview
	? signal(defaultCheckoutServer)
	: persisted(
			localStorage,
			`${prefix}.v1.checkoutServer`,
			defaultCheckoutServer,
		);
export const checkoutServerUrlSignal = createUrlSignal(checkoutServerSignal);

export const sdkV1Signal = signal<Promise<SdkV1> | undefined>(undefined);

effect(() => {
	const version = sdkVersionSignal.value;
	const coreServerUrl = coreServerUrlSignal.value;
	const checkoutServerUrl = checkoutServerUrlSignal.value;
	if (!(coreServerUrl && checkoutServerUrl)) {
		sdkV1Signal.value = undefined;
		return;
	}
	let cleaned = false;
	(async () => {
		if (getMajorVersion(version) === "v1") {
			const sdk = loadSdkV1(
				version as SdkV1Version,
				coreServerUrl.origin,
				checkoutServerUrl.origin,
			);
			if (cleaned) return;
			sdkV1Signal.value = sdk;
		} else {
			sdkV1Signal.value = undefined;
		}
	})();
	return () => {
		cleaned = true;
		sdkV1Signal.value?.then((sdk) => sdk.cleanUp());
	};
});

async function loadSdkV1(
	version: SdkV1Version,
	CORE_SERVER: string,
	CHECKOUT_SERVER: string,
): Promise<SdkV1> {
	return match(version)
		.with("1.3.0", async () => {
			const { default: IMP, slots } = import.meta.env.VITE_BROWSER_SDK_V1
				? await importStatic(import.meta.env.VITE_BROWSER_SDK_V1)
				: await import("https://cdn.iamport.kr/v1/iamport.esm.js");
			const cleanUp = IMP.deinit;
			slots.CORE_SERVER = CORE_SERVER;
			slots.CHECKOUT_SERVER = CHECKOUT_SERVER;
			return { IMP, cleanUp };
		})
		.with(P._, async () => {
			const { IMP } = await loadLegacySdk(`iamport.payment-${version}.js`);
			IMP.slots.CORE_SERVER = CORE_SERVER;
			return { IMP, cleanUp: () => IMP.style.remove() };
		})
		.exhaustive();
}

async function loadLegacySdk(filename: string) {
	const jQueryInjection =
		window.jQuery ||
		import("jquery").then((module) => {
			window.jQuery = module.default;
		});
	const response = import.meta.env.VITE_BROWSER_SDK_V1_LEGACY
		? await fetch(`${import.meta.env.VITE_BROWSER_SDK_V1_LEGACY}/${filename}`)
		: await fetch(`https://cdn.iamport.kr/js/${filename}`);
	const script = await response.text();
	// 1. replace polyfill modules and module assignment to `window.IMP` with `export default` and additional argument `out` added
	const esmified = script.replace(
		/.+;window\.IMP\s*\|\|\s*function\((\S+)\)(.+)\.call\({},\s*window\)/s,
		";export default function($1,out)$2",
	);
	// 2. inject style into IMP
	const [, styleVarName] = /.+;(.+?)\.type="text\/css"/.exec(esmified) ?? [];
	const styleInjected = esmified.replace(
		/{slots:/,
		`{style:${styleVarName},slots:`,
	);
	// 3. replace minified `window.IMP` with `out.IMP`
	const outputReplaced = styleInjected.replace(
		/([^A-Za-z0-9_])\w+\.IMP\s*=/,
		"$1out.IMP=",
	);
	// 4. convert to base64 data URL to import as module
	const base64Url = `data:text/javascript;base64,${btoa(outputReplaced)}`;
	const module = await import(
		/* @vite-ignore */
		base64Url
	);
	const container = {};
	await jQueryInjection;
	module.default.call({}, window, container);
	return container as {
		IMP: SdkV1["IMP"] & {
			style: HTMLStyleElement;
			slots: Record<string, string>;
		};
	};
}

export interface AccountSignals {
	codePreviewSignal: ReadonlySignal<string>;
	impInit: (IMP: SdkV1["IMP"]) => void;
}
export function createAccountSignals(
	fieldSignals: FieldSignals,
): AccountSignals {
	const { userCode: userCodeSignal, tierCode: tierCodeSignal } = fieldSignals;
	const codePreviewSignal = computed<string>(() => {
		const userCode = userCodeSignal.valueSignal.value;
		const tierCode = tierCodeSignal.valueSignal.value;
		const tierCodeEnabled = tierCodeSignal.enabledSignal.value;
		if (tierCodeEnabled && tierCode) {
			return `IMP.agency(${JSON.stringify(userCode)}, ${JSON.stringify(
				tierCode,
			)});`;
		}
		return `IMP.init(${JSON.stringify(userCode)});`;
	});
	return {
		codePreviewSignal,
		impInit(IMP) {
			if (userCodeSignal.type !== "text" || tierCodeSignal.type !== "text")
				throw new Error("unexpected field type");
			const userCode = userCodeSignal.valueSignal.peek();
			const tierCode = tierCodeSignal.valueSignal.peek();
			const tierCodeEnabled = tierCodeSignal.enabledSignal.peek();
			if (tierCodeEnabled && tierCode) IMP.agency(userCode, tierCode);
			else IMP.init(userCode);
		},
	};
}
