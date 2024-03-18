import { effect, signal } from "@preact/signals";
import { SdkV2, SdkV2Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import persisted, { prefix } from "./persisted";
import { createUrlSignal } from "./url";

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
