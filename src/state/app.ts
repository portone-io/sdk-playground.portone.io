import { computed, effect, Signal, signal } from "@preact/signals";
import { SdkV1, SdkV1Versions, sdkV1Versions, SdkVersion } from "../sdk";
import { apiServerSignal } from "./v1";

interface AppModeBase<TSdkVersion extends SdkVersion> {
  sdkVersion: TSdkVersion;
}
interface AppModeV1 extends AppModeBase<SdkV1Versions> {
  type: "pay" | "cert";
}
export type AppMode = AppModeV1;
export const appModeSignal = signal<AppMode>({
  sdkVersion: "1.2.1",
  type: "pay",
});
export interface StateModule {
  playFnSignal: Signal<PlayFn>;
}
export const stateModulePromiseSignal = computed<Promise<StateModule>>(() => {
  type M = Promise<StateModule>;
  const appMode = appModeSignal.value;
  if (sdkV1Versions.includes(appMode.sdkVersion)) {
    if (appMode.type === "pay") return import("./v1-pay") as M;
    if (appMode.type === "cert") return import("./v1-cert") as M;
    throw new Error();
  }
  throw new Error();
});

export const sdkVersionSignal = computed(() => appModeSignal.value.sdkVersion);
export function changeSdkVersion(sdkVersion: SdkVersion) {
  if (sdkV1Versions.includes(sdkVersion)) {
    appModeSignal.value = {
      ...appModeSignal.value,
      sdkVersion,
    };
  } else {
    throw new Error();
  }
}
export const sdkV1Signal = signal<SdkV1 | undefined>(undefined);
export const currentSdkSignal = computed(() => {
  const version = sdkVersionSignal.value;
  const sdkV1 = sdkV1Signal.value;
  if (version.startsWith("1.")) return sdkV1;
});

effect(async () => {
  const version = sdkVersionSignal.value;
  const apiServer = apiServerSignal.value.trim();
  const sdk = await loadSdkV1(version, apiServer);
  sdkV1Signal.value?.cleanUp();
  sdkV1Signal.value = sdk;
});

export const waitingSignal = signal(false);
export type PlayFn = () => Promise<any>;
export const playFnSignal = computed(() => {
  const stateModulePromise = stateModulePromiseSignal.value;
  return async function play() {
    try {
      playResultSignal.value = undefined;
      waitingSignal.value = true;
      const stateModule = await stateModulePromise;
      const playFn = stateModule.playFnSignal.value;
      const response: any = await playFn();
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
