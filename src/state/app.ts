import { effect, signal } from "@preact/signals";
import { SdkV1x, SdkVersion } from "../sdk/sdk";

export const apiServerSignal = signal("https://service.iamport.kr");

export const sdkVersionSignal = signal<SdkVersion>("1.1.7");
export const sdkV1xSignal = signal<SdkV1x | undefined>(undefined);

effect(async () => {
  const version = sdkVersionSignal.value;
  const apiServer = apiServerSignal.value;
  const sdk = await loadSdkV1x(version, apiServer);
  sdkV1xSignal.value?.cleanUp();
  sdkV1xSignal.value = sdk;
});

async function loadSdkV1x(
  version: SdkVersion,
  apiServer: string,
): Promise<SdkV1x> {
  switch (version) {
    case "1.1.7": {
      const { default: initSdk } = await import("../sdk/iamport-1.1.7");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
    case "1.1.8": {
      const { default: initSdk } = await import("../sdk/iamport-1.1.8");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
    case "1.2.0": {
      const { default: initSdk } = await import("../sdk/iamport-1.2.0");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
    case "1.2.1": {
      const { default: initSdk } = await import("../sdk/iamport-1.2.1");
      return initSdk({ window: globalThis, api_server: apiServer });
    }
  }
}
