declare module "https://cdn.iamport.kr/v1/iamport.esm.js" {
	const IMP: {
		init(userCode: string): void;
		agency(userCode: string, tierCode: string): void;
		request_pay(paymentRequest: any, callback: (response: any) => void): void;
		certification(
			certificationRequest: any,
			callback: (response: any) => void,
		): void;
		loadUI(
			uiType: string,
			paymentRequest: any,
			callback: (response: any) => void,
		): void;
		deinit(): void;
	};
	export const slots: Record<string, string>;
	export default IMP;
}

declare module "https://cdn.portone.io/v2/browser-sdk.esm.js" {
	const PortOne: {
		requestPayment(config: any): Promise<any>;
		requestIdentityVerification(config: any): Promise<any>;
		loadPaymentUI(
			config: any,
			callbacks: Record<string, (value: unknown) => void>,
		): Promise<any>;
	};
	export const slots: Record<string, string>;
	export default PortOne;
}

declare module "https://esm.sh/@portone/browser-sdk/v2?exports=Entity" {
	export const Entity: {
		Bank: Record<string, string>;
		BillingKeyAndPayMethod: Record<string, string>;
		BillingKeyMethod: Record<string, string>;
		CardCompany: Record<string, string>;
		Carrier: Record<string, string>;
		Country: Record<string, string>;
		Currency: Record<string, string>;
		EasyPayProvider: Record<string, string>;
		Gender: Record<string, string>;
		GiftCertificateType: Record<string, string>;
		IssueBillingKeyUIType: Record<string, string>;
		Locale: Record<string, string>;
		PaymentUIType: Record<string, string>;
		PgProvider: Record<string, string>;
		TransactionType: Record<string, string>;
		WindowType: Record<string, string>;
	};
}
