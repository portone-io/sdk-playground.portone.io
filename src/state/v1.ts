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

declare global {
  interface Window {
    jQuery?: typeof import("jquery");
  }
}

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
        "https://cdn.iamport.kr/v1/iamport.esm.js"
      );
      const cleanUp = IMP.deinit;
      slots.CORE_SERVER = CORE_SERVER;
      slots.CHECKOUT_SERVER = CHECKOUT_SERVER;
      return { IMP, cleanUp };
    }
    case "1.2.1": {
      const { IMP } = await loadLegacySdk(
        "iamport.payment-1.2.1.js",
      );
      IMP.slots.CORE_SERVER = CORE_SERVER;
      return { IMP, cleanUp: () => IMP.style.remove() };
    }
    case "1.2.0": {
      const { IMP } = await loadLegacySdk(
        "iamport.payment-1.2.0.js",
      );
      IMP.slots.CORE_SERVER = CORE_SERVER;
      return { IMP, cleanUp: () => IMP.style.remove() };
    }
    case "1.1.8": {
      const { IMP } = await loadLegacySdk(
        "iamport.payment-1.1.8.js",
      );
      IMP.slots.CORE_SERVER = CORE_SERVER;
      return { IMP, cleanUp: () => IMP.style.remove() };
    }
    case "1.1.7": {
      const { IMP } = await loadLegacySdk(
        "iamport.payment-1.1.7.js",
      );
      IMP.slots.CORE_SERVER = CORE_SERVER;
      return { IMP, cleanUp: () => IMP.style.remove() };
    }
  }
}

async function loadLegacySdk(
  filename: string,
) {
  const jQueryInjection = window.jQuery || import("jquery").then((module) => {
    window.jQuery = module.default;
  });
  const response = await fetch(`https://cdn.iamport.kr/js/${filename}`);
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
  userCodeSignal: Signal<string>;
  tierCodeSignal: Signal<string>;
  tierCodeEnabledSignal: Signal<boolean>;
  codePreviewSignal: ReadonlySignal<string>;
  reset: () => void;
  impInit: (sdkV1: SdkV1) => void;
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
    impInit(sdkV1) {
      const userCode = userCodeSignal.value;
      const tierCode = tierCodeSignal.value;
      const tierCodeEnabled = tierCodeEnabledSignal.value;
      if (tierCodeEnabled && tierCode) sdkV1.IMP.agency(userCode, tierCode);
      else sdkV1.IMP.init(userCode);
    },
  };
}
