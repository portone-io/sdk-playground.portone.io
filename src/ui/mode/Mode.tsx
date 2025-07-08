import type * as React from "react";
import { type ModeFnKey, modeFnSignal } from "../../state/app";
import V1Cert from "./v1-cert";
import V1LoadUi from "./v1-load-ui";
import V1NaverpayZzim from "./v1-naverpay-zzim";
import V1Pay from "./v1-pay";
import V2IdentityVerification from "./v2-identity-verification";
import V2IssueBillingKey from "./v2-issue-billing-key";
import V2IssueBillingKeyAndPay from "./v2-issue-billing-key-and-pay";
import V2LoadBillingKeyUi from "./v2-load-billing-key-ui";
import V2LoadPaymentUi from "./v2-load-payment-ui";
import V2Pay from "./v2-pay";

const modeViewTable: { [key in ModeFnKey]: React.ReactElement } = {
	"v1-pay": <V1Pay />,
	"v1-cert": <V1Cert />,
	"v1-load-ui": <V1LoadUi />,
	"v1-naverpay-zzim": <V1NaverpayZzim />,
	"v2-pay": <V2Pay />,
	"v2-identity-verification": <V2IdentityVerification />,
	"v2-load-payment-ui": <V2LoadPaymentUi />,
	"v2-load-billing-key-ui": <V2LoadBillingKeyUi />,
	"v2-issue-billing-key": <V2IssueBillingKey />,
	"v2-issue-billing-key-and-pay": <V2IssueBillingKeyAndPay />,
};

const Mode: React.FC = () => modeViewTable[modeFnSignal.value] || null;
export default Mode;
