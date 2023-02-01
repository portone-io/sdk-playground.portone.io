import * as React from "react";
import { appModeSignal, isV1Mode } from "../../state/app";
import V1Cert from "./v1-cert";
import V1Pay from "./v1-pay";

const Mode: React.FC = () => {
  const appMode = appModeSignal.value;
  if (!isV1Mode(appMode)) return <>TODO</>;
  if (appMode.function === "pay") return <V1Pay />;
  if (appMode.function === "cert") return <V1Cert />;
  return null;
};
export default Mode;
