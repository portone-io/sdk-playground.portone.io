import { effect, signal } from "@preact/signals";
import type { SdkV2, SdkV2Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import persisted, { prefix } from "./persisted";
import { createUrlSignal } from "./url";

import { Entity } from "https://esm.sh/@portone/browser-sdk/v2?exports=Entity";
import { importStatic } from "../misc/import-static";

export function reset() {
	checkoutServerSignal.value = defaultCheckoutServer;
}

const defaultCheckoutServer = import.meta.env.VITE_CHECKOUT_SERVER_URL;
export const checkoutServerSignal = persisted(
	localStorage,
	`${prefix}.v2.checkoutServer`,
	defaultCheckoutServer,
);
export const checkoutServerUrlSignal = createUrlSignal(checkoutServerSignal);

export const sdkV2Signal = signal<Promise<SdkV2> | undefined>(undefined);

effect(() => {
	const version = sdkVersionSignal.value;
	const checkoutServerUrl = checkoutServerUrlSignal.value;
	if (!checkoutServerUrl) {
		sdkV2Signal.value = undefined;
		return;
	}
	let cleaned = false;
	(async () => {
		if (getMajorVersion(version) === "v2") {
			const sdk = loadSdkV2(version as SdkV2Version, checkoutServerUrl.origin);
			if (cleaned) return;
			sdkV2Signal.value = sdk;
		} else {
			sdkV2Signal.value = undefined;
		}
	})();
	return () => {
		cleaned = true;
		sdkV2Signal.value?.then((sdk) => sdk.cleanUp());
	};
});

async function loadSdkV2(
	version: SdkV2Version,
	CHECKOUT_SERVER: string,
): Promise<SdkV2> {
	switch (version) {
		case "2.0.0": {
			const { default: PortOne, slots } = import.meta.env.VITE_BROWSER_SDK_V2
				? await importStatic(import.meta.env.VITE_BROWSER_SDK_V2)
				: await import("https://cdn.portone.io/v2/browser-sdk.esm.js");
			Object.assign(slots, { CHECKOUT_SERVER });
			return { PortOne, cleanUp: () => {} };
		}
	}
}

export const cardCompanyOptions = Object.keys(Entity.CardCompany);
export const bankCodeOptions = Object.keys(Entity.Bank);
export const carrierOptions = Object.keys(Entity.Carrier);
export const giftCertificateTypeOptions = Object.keys(
	Entity.GiftCertificateType,
);
export const paymentUITypeOptions = Object.keys(Entity.PaymentUIType);
export const IssueBillingKeyUITypeOptions = Object.keys(
	Entity.IssueBillingKeyUIType,
);
export const easyPayProviderOptions = Object.keys(Entity.EasyPayProvider);
export const currencyOptions = Object.keys(Entity.Currency);
export const countryOptions = Object.keys(Entity.Country);
export const genderOptions = Object.keys(Entity.Gender);
export const windowTypeOptions = Object.keys(Entity.WindowType);

// TODO: browser-sdk/v2 에서 export되지 않아서 임시로 추가한 값들 (추후 수정 필요)
export const payMethodOptions = [
	"CARD",
	"VIRTUAL_ACCOUNT",
	"TRANSFER",
	"MOBILE",
	"GIFT_CERTIFICATE",
	"EASY_PAY",
	"PAYPAL",
	"ALIPAY",
	"CONVENIENCE_STORE",
];
export const productTypeOptions = ["REAL", "DIGITAL"];
export const cashReceiptTypeOptions = ["PERSONAL", "CORPORATE", "ANONYMOUS"];
