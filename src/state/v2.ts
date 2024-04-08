import { effect, signal } from "@preact/signals";
import { SdkV2, SdkV2Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import persisted, { prefix } from "./persisted";
import { createUrlSignal } from "./url";

import { Entity } from "https://esm.sh/@portone/browser-sdk/v2?exports=Entity";

export function reset() {
  checkoutServerSignal.value = defaultCheckoutServer;
}

const defaultCheckoutServer = "https://checkout-service.prod.iamport.co";
export const checkoutServerSignal = persisted(
  localStorage,
  `${prefix}.v2.checkoutServer`,
  defaultCheckoutServer,
);
export const checkoutServerUrlSignal = createUrlSignal(checkoutServerSignal);

export const sdkV2Signal = signal<SdkV2 | undefined>(undefined);

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
      const sdk = await loadSdkV2(
        version as SdkV2Version,
        checkoutServerUrl.origin,
      );
      if (cleaned) return;
      sdkV2Signal.value = sdk;
    } else {
      sdkV2Signal.value = undefined;
    }
  })();
  return () => {
    cleaned = true;
    sdkV2Signal.value?.cleanUp();
  };
});

async function loadSdkV2(
  version: SdkV2Version,
  CHECKOUT_SERVER: string,
): Promise<SdkV2> {
  switch (version) {
    case "2.0.0": {
      const { default: PortOne, slots } = await import(
        "https://cdn.portone.io/v2/browser-sdk.esm.js"
      );
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
];
export const productTypeOptions = [
  "REAL",
  "DIGITAL",
];
export const cashReceiptTypeOptions = [
  "PERSONAL",
  "CORPORATE",
  "ANONYMOUS",
];
