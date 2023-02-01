import { effect, signal } from "@preact/signals";
import { SdkV1, SdkVersion } from "../sdk";
import { getMajorVersion, sdkVersionSignal } from "./app";

export const apiServerSignal = signal("https://service.iamport.kr");
export const userCodeSignal = signal("");

export const sdkV1Signal = signal<SdkV1 | undefined>(undefined);

effect(async () => {
  const version = sdkVersionSignal.value;
  const apiServer = apiServerSignal.value.trim();
  sdkV1Signal.value?.cleanUp();
  if (getMajorVersion(version) === "v1") {
    sdkV1Signal.value = await loadSdkV1(version, apiServer);
  } else {
    sdkV1Signal.value = undefined;
  }
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
