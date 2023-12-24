import {
  computed,
  effect,
  type ReadonlySignal,
  type Signal,
  signal,
} from "@preact/signals";
import { type SdkV1, SdkV1Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import persisted, { prefix } from "./persisted";
import { createUrlSignal } from "./url";

export function reset() {
  coreServerSignal.value = defaultCoreServer;
  checkoutServerSignal.value = defaultCheckoutServer;
}

const defaultCoreServer = "https://service.iamport.kr";
export const coreServerSignal = persisted(
  localStorage,
  `${prefix}.v1.coreServer`,
  defaultCoreServer,
);
export const coreServerUrlSignal = createUrlSignal(coreServerSignal);

const defaultCheckoutServer = "https://checkout-service.prod.iamport.co";
export const checkoutServerSignal = persisted(
  localStorage,
  `${prefix}.v1.checkoutServer`,
  defaultCheckoutServer,
);
export const checkoutServerUrlSignal = createUrlSignal(checkoutServerSignal);

export const sdkV1Signal = signal<SdkV1 | undefined>(undefined);

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
      const sdk = await loadSdkV1(
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

export interface AccountSignals {
  userCodeSignal: Signal<string>;
  tierCodeSignal: Signal<string>;
  tierCodeEnabledSignal: Signal<boolean>;
  codePreviewSignal: ReadonlySignal<string>;
  reset: () => void;
}
export function createAccountSignals(
  keyPrefix: string,
): AccountSignals {
  const userCodeSignal = persisted(
    localStorage,
    `${keyPrefix}.userCode`,
    "",
  );
  const tierCodeSignal = persisted(
    localStorage,
    `${keyPrefix}.tierCode`,
    "",
  );
  const tierCodeEnabledSignal = persisted(
    localStorage,
    `${keyPrefix}.tierCode.enabled`,
    false,
  );
  const codePreviewSignal = computed<string>(() => {
    const userCode = userCodeSignal.value;
    const tierCode = tierCodeSignal.value;
    const tierCodeEnabled = tierCodeEnabledSignal.value;
    if (tierCodeEnabled && tierCode) {
      return `IMP.agency(${JSON.stringify(userCode)}, ${
        JSON.stringify(tierCode)
      });`;
    } else {
      return `IMP.init(${JSON.stringify(userCode)});`;
    }
  });
  return {
    userCodeSignal,
    tierCodeSignal,
    tierCodeEnabledSignal,
    codePreviewSignal,
    reset() {
      userCodeSignal.value = "";
      tierCodeSignal.value = "";
      tierCodeEnabledSignal.value = false;
    },
  };
}
