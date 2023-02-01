import { computed, Signal, signal } from "@preact/signals";
import { MajorVersion, SdkV1Versions, SdkVersion } from "../sdk";

interface AppModeBase<
  TSdkVersion extends SdkVersion,
  TFunction extends string,
> {
  sdkVersion: TSdkVersion;
  function: TFunction;
}
interface AppModeV1 extends AppModeBase<SdkV1Versions, "pay" | "cert"> {}
export type AppMode = AppModeV1;
export const appModeSignal = signal<AppMode>({
  sdkVersion: "1.2.1",
  function: "pay",
});

export function isV1Mode(appMode: AppMode): appMode is AppModeV1 {
  return getMajorVersion(appMode.sdkVersion) === "v1";
}

export function getMajorVersion(sdkVersion: SdkVersion): MajorVersion {
  if (sdkVersion.split(".").shift()! === "1") return "v1";
  throw new Error();
}

type Modes<TMode extends AppModeBase<any, any>> = {
  [key in TMode["function"]]: {
    label: string;
    stateModule: () => Promise<StateModule>;
  };
};
export const modes = {
  "v1": {
    pay: { label: "결제", stateModule: () => import("./v1-pay") },
    cert: { label: "본인인증", stateModule: () => import("./v1-cert") },
  } satisfies Modes<AppModeV1>,
} satisfies { [key in MajorVersion]: Modes<any> };

export interface StateModule {
  playFnSignal: Signal<PlayFn>;
}
export const stateModulePromiseSignal = computed<Promise<StateModule>>(() => {
  const appMode = appModeSignal.value;
  if (isV1Mode(appMode)) return modes.v1[appMode.function].stateModule();
  throw new Error();
});

export const sdkVersionSignal = computed(() => appModeSignal.value.sdkVersion);
export function changeSdkVersion(sdkVersion: SdkVersion) {
  const beforeMajor = getMajorVersion(appModeSignal.value.sdkVersion);
  const afterMajor = getMajorVersion(sdkVersion);
  if (beforeMajor === afterMajor) {
    appModeSignal.value = { ...appModeSignal.value, sdkVersion };
  } else {
    throw new Error();
  }
}

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
