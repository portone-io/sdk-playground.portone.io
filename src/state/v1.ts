import { effect, signal } from "@preact/signals";
import { SdkV1, SdkV1Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import persisted, { prefix } from "./persisted";

export const coreServerSignal = persisted(
  localStorage,
  `${prefix}.v2.coreServer`,
  "https://service.iamport.kr",
);
export const checkoutServerSignal = persisted(
  localStorage,
  `${prefix}.v2.checkoutServer`,
  "https://checkout-service.prod.iamport.co",
);
export const userCodeSignal = persisted(
  localStorage,
  `${prefix}.v1.userCode`,
  "",
);

export const sdkV1Signal = signal<SdkV1 | undefined>(undefined);

effect(() => {
  const version = sdkVersionSignal.value;
  const coreServer = coreServerSignal.value.trim();
  const checkoutServer = checkoutServerSignal.value.trim();
  let cleaned = false;
  (async () => {
    if (getMajorVersion(version) === "v1") {
      const sdk = await loadSdkV1(
        version as SdkV1Version,
        coreServer,
        checkoutServer,
      );
      if (cleaned) return;
      sdkV1Signal.value = sdk;
    } else {
      sdkV1Signal.value = undefined;
    }
  })();
  return () => {
    cleaned = true;
    sdkV1Signal.value?.cleanUp();
  };
});

async function loadSdkV1(
  version: SdkV1Version,
  CORE_SERVER: string,
  CHECKOUT_SERVER: string,
): Promise<SdkV1> {
  switch (version) {
    case "1.3.0": {
      const { default: IMP, slots } = await import(
        "../sdk/iamport-1.3.0.esm.js"
      );
      const cleanUp = IMP.deinit;
      slots.CORE_SERVER = CORE_SERVER;
      slots.CHECKOUT_SERVER = CHECKOUT_SERVER;
      return { IMP, cleanUp };
    }
    case "1.2.1": {
      const { default: initSdk } = await import("../sdk/iamport-1.2.1");
      return initSdk({ window: globalThis, api_server: CORE_SERVER });
    }
    case "1.2.0": {
      const { default: initSdk } = await import("../sdk/iamport-1.2.0");
      return initSdk({ window: globalThis, api_server: CORE_SERVER });
    }
    case "1.1.8": {
      const { default: initSdk } = await import("../sdk/iamport-1.1.8");
      return initSdk({ window: globalThis, api_server: CORE_SERVER });
    }
    case "1.1.7": {
      const { default: initSdk } = await import("../sdk/iamport-1.1.7");
      return initSdk({ window: globalThis, api_server: CORE_SERVER });
    }
  }
}
