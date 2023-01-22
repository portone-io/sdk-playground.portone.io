export type SdkVersion = (typeof sdkVersions)[number];
export const sdkVersions = [
  "1.2.1",
  "1.2.0",
  "1.1.8",
  "1.1.7",
] as const;

export interface InitSdkV1xConfig {
  window: typeof globalThis;
  api_server: string;
}
export type InitSdkV1xFn = (config: InitSdkV1xConfig) => SdkV1x;
export interface SdkV1x {
  IMP: {
    init(userCode: string): void;
    agency(userCode: string, tierCode: string): void;
    request_pay(
      paymentRequest: any,
      callback: (response: any) => void,
    ): void;
    // communicate, close, certification, naver_zzim
  };
  cleanUp: () => void;
}
