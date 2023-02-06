import { effect, signal } from "@preact/signals";
import { SdkV1, SdkVersion } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";

export const apiServerSignal = signal("https://service.iamport.kr");
export const userCodeSignal = signal("");

export const sdkV1Signal = signal<SdkV1 | undefined>(undefined);

effect(() => {
  const version = sdkVersionSignal.value;
  const apiServer = apiServerSignal.value.trim();
  let cleaned = false;
  (async () => {
    if (getMajorVersion(version) === "v1") {
      const sdk = await loadSdkV1(version, apiServer);
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
  version: SdkVersion,
  apiServer: string,
): Promise<SdkV1> {
  switch (version) {
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
