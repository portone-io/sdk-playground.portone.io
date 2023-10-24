import { computed, Signal, signal } from "@preact/signals";
import { MajorVersion, SdkVersion } from "../sdk";
import persisted, { prefix } from "./persisted";

export interface AppMode {
  sdkVersion: SdkVersion;
  fn: ModeFnKey;
}
export const appModeSignal = persisted<AppMode>(
  localStorage,
  `${prefix}.appMode`,
  { sdkVersion: "1.3.0", fn: "v1-pay" },
);

export function getMajorVersion(sdkVersion: SdkVersion): MajorVersion {
  const major = sdkVersion.split(".").shift()!;
  if (major === "1") return "v1";
  if (major === "2") return "v2";
  throw new Error();
}

export type ModeFnKey = keyof typeof modeFns;
export const modeFns = {
  "v1-pay": {
    label: "결제",
    stateModule: () => import("./v1-pay"),
  },
  "v1-cert": {
    label: "본인인증",
    stateModule: () => import("./v1-cert"),
  },
  "v1-load-ui": {
    label: "PG 제공 UI",
    stateModule: () => import("./v1-load-ui"),
  },
  "v2-pay": {
    label: "결제",
    stateModule: () => import("./v2-pay"),
  },
} satisfies {
  [key: string]: {
    label: string;
    stateModule: () => Promise<StateModule>;
  };
};
export const modeFnKeysPerVersion: { [key in SdkVersion]: ModeFnKey[] } = {
  "2.0.0": ["v2-pay"],
  "1.3.0": ["v1-pay", "v1-cert", "v1-load-ui"],
  "1.2.1": ["v1-pay", "v1-cert"],
  "1.2.0": ["v1-pay", "v1-cert"],
  "1.1.8": ["v1-pay", "v1-cert"],
  "1.1.7": ["v1-pay", "v1-cert"],
};

export interface StateModule {
  playFnSignal: Signal<PlayFn>;
}
export const stateModulePromiseSignal = computed<Promise<StateModule>>(
  () => modeFns[modeFnSignal.value].stateModule(),
);

export const sdkVersionSignal = computed(() => appModeSignal.value.sdkVersion);
export const modeFnSignal = computed(sanitizeModeFn);
function sanitizeModeFn(
  sdkVersion: SdkVersion = appModeSignal.value.sdkVersion,
  modeFn: ModeFnKey = appModeSignal.value.fn,
): ModeFnKey {
  const modes = modeFnKeysPerVersion[sdkVersion];
  return modes.includes(modeFn) ? modeFn : modes[0];
}
export function changeSdkVersion(sdkVersion: SdkVersion) {
  const oldSdkVersion = appModeSignal.value.sdkVersion;
  if (sdkVersion === oldSdkVersion) return;
  const fn = sanitizeModeFn(sdkVersion);
  appModeSignal.value = { ...appModeSignal.value, sdkVersion, fn };
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
      const success = ("error_code" in response) || ("code" in response);
      playResultSignal.value = { success, response };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      playResultSignal.value = { success: false, errorStack };
    } finally {
      waitingSignal.value = false;
    }
  };
});
export interface PlayResult {
  success: boolean;
  response?: object;
  errorStack?: string;
}
export const playResultSignal = signal<PlayResult | undefined>(undefined);
