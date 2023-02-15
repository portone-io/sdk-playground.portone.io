import * as React from "react";
import { appModeSignal, getMajorVersion } from "../../state/app";
import V1Cert from "./v1-cert";
import V1Pay from "./v1-pay";
import V2Pay from "./v2-pay";

const Mode: React.FC = () => {
  const appMode = appModeSignal.value;
  const majorVersion = getMajorVersion(appMode.sdkVersion);
  switch (majorVersion) {
    default:
      return <>TODO</>;
    case "v1": {
      if (appMode.function === "pay") return <V1Pay />;
      if (appMode.function === "cert") return <V1Cert />;
    }
    case "v2": {
      if (appMode.function === "pay") return <V2Pay />;
    }
  }
  return null;
};
export default Mode;
