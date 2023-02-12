import { effect, signal } from "@preact/signals";
import { SdkV1, SdkV1Version } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";
import persisted, { prefix } from "./persisted";

export const apiServerSignal = persisted(
  localStorage,
  `${prefix}.v1.apiServer`,
  "https://service.iamport.kr",
);
export const userCodeSignal = persisted(
  localStorage,
  `${prefix}.v1.userCode`,
  "",
);

export const sdkV1Signal = signal<SdkV1 | undefined>(undefined);

effect(() => {
  const version = sdkVersionSignal.value;
  const apiServer = apiServerSignal.value.trim();
  let cleaned = false;
  (async () => {
    if (getMajorVersion(version) === "v1") {
      const sdk = await loadSdkV1(version as SdkV1Version, apiServer);
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
  apiServer: string,
): Promise<SdkV1> {
  switch (version) {
    case "1.3.0": {
      const { default: IMP, slots } = await import(
        "../sdk/iamport-1.3.0.esm.js"
      );
      const cleanUp = IMP.deinit;
      slots.CORE_SERVER = apiServer;
      return { IMP, cleanUp };
    }
    case "1.2.1": {
      const { default: initSdk } = await import("../sdk/iamport-1.2.1");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
    case "1.2.0": {
      const { default: initSdk } = await import("../sdk/iamport-1.2.0");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
    case "1.1.8": {
      const { default: initSdk } = await import("../sdk/iamport-1.1.8");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
    case "1.1.7": {
      const { default: initSdk } = await import("../sdk/iamport-1.1.7");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
  }
}
