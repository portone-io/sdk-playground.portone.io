export type SdkV1Versions = (typeof sdkV1Versions)[number];
export const sdkV1Versions = [
  "1.3.0",
  "1.2.1",
  "1.2.0",
  "1.1.8",
  "1.1.7",
] as const;

export type SdkVersion = (typeof sdkVersions)[number];
export const sdkVersions = [
  ...sdkV1Versions,
] as const;

export type MajorVersion = (typeof majorVersions)[number];
export const majorVersions = ["v1"] as const;

export interface InitSdkV1Config {
  window: typeof globalThis;
  api_server: string;
}
export type InitSdkV1Fn = (config: InitSdkV1Config) => SdkV1;
export interface SdkV1 {
  IMP: {
    init(userCode: string): void;
    agency(userCode: string, tierCode: string): void;
    request_pay(
      paymentRequest: any,
      callback: (response: any) => void,
    ): void;
    certification(
      certificationRequest: any,
      callback: (response: any) => void,
    ): void;
    // communicate, close, naver_zzim
  };
  cleanUp: () => void;
}
