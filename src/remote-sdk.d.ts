declare module "https://cdn.iamport.kr/v1/iamport.esm.js" {
  const IMP: {
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
  };
  export const slots: Record<string, string>;
  export default PortOne;
}
