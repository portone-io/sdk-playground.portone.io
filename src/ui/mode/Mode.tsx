import type * as React from "react";
import { type ModeFnKey, modeFnSignal } from "../../state/app";
import V1Cert from "./v1-cert";
import V1LoadUi from "./v1-load-ui";
import V1Pay from "./v1-pay";
import V2IdentityVerification from "./v2-identity-verification";
import V2LoadPaymentUi from "./v2-load-payment-ui";
import V2Pay from "./v2-pay";

const modeViewTable: { [key in ModeFnKey]: React.ReactElement } = {
	"v1-pay": <V1Pay />,
	"v1-cert": <V1Cert />,
	"v1-load-ui": <V1LoadUi />,
	"v2-pay": <V2Pay />,
	"v2-identity-verification": <V2IdentityVerification />,
	"v2-load-payment-ui": <V2LoadPaymentUi />,
};

const Mode: React.FC = () => modeViewTable[modeFnSignal.value] || null;
export default Mode;
