import { effect, signal } from "@preact/signals";
import { SdkV2, SdkV2Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";

export const coreServerSignal = signal(
  "https://service.iamport.kr",
);
export const checkoutServerSignal = signal(
  "https://checkout-service.prod.iamport.co",
);

export const sdkV2Signal = signal<SdkV2 | undefined>(undefined);

effect(() => {
  const version = sdkVersionSignal.value;
  const coreServer = coreServerSignal.value.trim();
  const checkoutServer = checkoutServerSignal.value.trim();
  let cleaned = false;
  (async () => {
    if (getMajorVersion(version) === "v2") {
      const sdk = await loadSdkV2(
        version as SdkV2Version,
        coreServer,
        checkoutServer,
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
  CORE_SERVER: string,
  CHECKOUT_SERVER: string,
): Promise<SdkV2> {
  switch (version) {
    case "2.0.0": {
      const { default: PortOne, slots } = await import(
        "../sdk/iamport-2.0.0.esm.js"
      );
      Object.assign(slots, { CORE_SERVER, CHECKOUT_SERVER });
      return { PortOne, cleanUp: () => {} };
    }
  }
}
