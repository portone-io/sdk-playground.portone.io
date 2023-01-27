import { computed, effect, signal } from "@preact/signals";
import { SdkV1x, SdkVersion } from "../sdk/sdk";
import { requestPayFnSignal } from "./v1x";

export const apiServerSignal = signal("https://service.iamport.kr");

export const sdkVersionSignal = signal<SdkVersion>("1.2.1");
export const sdkV1xSignal = signal<SdkV1x | undefined>(undefined);
export const currentSdkSignal = computed(() => {
  const version = sdkVersionSignal.value;
  const sdkV1x = sdkV1xSignal.value;
  if (version.startsWith("1.")) return sdkV1x;
});

effect(async () => {
  const version = sdkVersionSignal.value;
  const apiServer = apiServerSignal.value;
  const sdk = await loadSdkV1x(version, apiServer);
  sdkV1xSignal.value?.cleanUp();
  sdkV1xSignal.value = sdk;
});

export const waitingSignal = signal(false);
export type PlayFn = () => Promise<any>;
export const playFnSignal = computed(() => {
  const requestPayFn = requestPayFnSignal.value;
  return async function play() {
    try {
      playResultSignal.value = undefined;
      waitingSignal.value = true;
      const response: any = await requestPayFn();
      playResultSignal.value = { success: response.success, response };
    } finally {
      waitingSignal.value = false;
    }
  };
});
export interface PlayResult {
  success: boolean;
  response: object;
}
export const playResultSignal = signal<PlayResult | undefined>(undefined);

async function loadSdkV1x(
  version: SdkVersion,
  apiServer: string,
): Promise<SdkV1x> {
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
