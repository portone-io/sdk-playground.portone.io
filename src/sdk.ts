export type SdkV1Version = (typeof sdkV1Versions)[number];
export const sdkV1Versions = [
	"1.3.0",
	"1.2.1",
	"1.2.0",
	"1.1.8",
	"1.1.7",
] as const;

export type SdkV2Version = (typeof sdkV2Versions)[number];
export const sdkV2Versions = ["2.0.0"] as const;

export type SdkVersion = (typeof sdkVersions)[number];
export const sdkVersions = [...sdkV2Versions, ...sdkV1Versions] as const;

export type MajorVersion = (typeof majorVersions)[number];
export const majorVersions = ["v1", "v2"] as const;

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
			paymentRequest: unknown,
			callback: (response: unknown) => void,
		): void;
		certification(
			certificationRequest: unknown,
			callback: (response: unknown) => void,
		): void;
		loadUI(
			uiType: string,
			paymentRequest: unknown,
			callback: (response: unknown) => void,
		): void;
		// communicate, close, naver_zzim
	};
	cleanUp: () => void;
}

export interface InitSdkV2Config {
	window: typeof globalThis;
	api_server: string;
}
export type InitSdkV2Fn = (config: InitSdkV2Config) => SdkV2;
export interface SdkV2 {
	PortOne: {
		requestPayment(config: unknown): Promise<unknown>;
		requestIdentityVerification(config: unknown): Promise<unknown>;
		loadPaymentUI(
			config: unknown,
			callbacks: Record<string, (value: unknown) => void>,
		): Promise<unknown>;
	};
	cleanUp: () => void;
}
