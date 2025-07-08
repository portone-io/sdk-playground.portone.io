import semver from "semver";

export type SdkV1Version = (typeof sdkV1Versions)[number];
export const sdkV1Versions = [
	"1.3.0",
	"1.2.1",
	"1.2.0",
	"1.1.9-rc",
	"1.1.8",
	"1.1.8-rc",
	"1.1.7",
	"1.1.7-rc20180615",
	"1.1.7-rc20180406",
	"1.1.7-rc20180206",
	"1.1.7-ohouse",
	"1.1.6",
	"1.1.6-rc20171101",
	"1.1.6-rc",
	"1.1.6-20181005",
	"1.1.5",
	"1.1.4",
	"1.1.3",
	"1.1.2",
	"1.1.1",
	"1.1.0",
	"1.0.0",
] as const;

export const isSupportedVersion = (version: string): boolean => {
	if (import.meta.env.VITE_SDK_PREVIEW) {
		return true;
	}
	if (semver.prerelease(version)) {
		return false;
	}
	return semver.gte(version, "1.1.8");
};

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
		naver_zzim(naverZzimRequest: unknown): void;
		// communicate, close
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
		requestIssueBillingKey(config: unknown): Promise<unknown>;
		requestIssueBillingKeyAndPay(config: unknown): Promise<unknown>;
		loadPaymentUI(
			config: unknown,
			callbacks: Record<string, (value: unknown) => void>,
		): Promise<unknown>;
		loadIssueBillingKeyUI(
			request: unknown,
			callbacks: Record<string, (value: unknown) => void>,
		): Promise<void>;
	};
	cleanUp: () => void;
}
